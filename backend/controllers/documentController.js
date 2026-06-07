const Document = require("../models/Document");
const User = require("../models/User");
const {
  findAccessibleDocument,
  isDocumentOwner,
} = require("../utils/access");
const { parseUploadedFile } = require("../utils/fileParser");

const handleError = (res, error) => {
  console.error(error);
  return res.status(500).json({
    message: "Server error",
    error: error.message || error,
  });
};

exports.createDocument = async (req, res) => {
  try {
    const title = req.body.title?.trim();

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const doc = await Document.create({
      title,
      content: req.body.content || {},
      owner: req.user.id,
    });

    res.status(201).json(doc);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({
      $or: [
        { owner: req.user.id },
        { "sharedWith.userId": req.user.id },
      ],
    }).sort({ updatedAt: -1 });

    res.json(docs);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const doc = await findAccessibleDocument(req.params.id, req.user.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(doc);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const doc = await findAccessibleDocument(req.params.id, req.user.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const updates = {};
    if (req.body.title !== undefined) {
      const title = req.body.title?.trim();
      if (!title) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      updates.title = title;
    }
    if (req.body.content !== undefined) updates.content = req.body.content;
    if (req.body.attachments !== undefined) {
      updates.attachments = req.body.attachments;
    }

    const updated = await Document.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const doc = await findAccessibleDocument(req.params.id, req.user.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (!isDocumentOwner(doc, req.user.id)) {
      return res.status(403).json({
        message: "Only the document owner can delete this document",
      });
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.shareDocument = async (req, res) => {
  try {
    const email = req.body.email?.trim()?.toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (!isDocumentOwner(doc, req.user.id)) {
      return res.status(403).json({
        message: "Only the document owner can share this document",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        message: "You cannot share a document with yourself",
      });
    }

    const alreadyShared = doc.sharedWith.some(
      (entry) => entry.userId.toString() === user._id.toString(),
    );

    if (alreadyShared) {
      return res.status(400).json({
        message: "Document is already shared with this user",
      });
    }

    doc.sharedWith.push({
      userId: user._id,
      permission: req.body.permission || "edit",
    });

    await doc.save();

    res.json({
      message: "Shared successfully",
      sharedWith: doc.sharedWith,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.importDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const parsed = await parseUploadedFile(
      req.file.path,
      req.file.originalname,
    );

    const doc = await Document.create({
      title: parsed.title || "Imported document",
      content: parsed.content,
      owner: req.user.id,
      attachments: [req.file.filename],
    });

    res.status(201).json(doc);
  } catch (error) {
    if (error.message?.includes("Unsupported file type")) {
      return res.status(400).json({ message: error.message });
    }
    return handleError(res, error);
  }
};

exports.attachFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const doc = await findAccessibleDocument(req.params.id, req.user.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const shouldImportContent = req.body.importContent === "true";

    const updates = {
      attachments: [...(doc.attachments || []), req.file.filename],
    };

    if (shouldImportContent) {
      const parsed = await parseUploadedFile(
        req.file.path,
        req.file.originalname,
      );
      updates.content = parsed.content;
    }

    const updated = await Document.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (error) {
    if (error.message?.includes("Unsupported file type")) {
      return res.status(400).json({ message: error.message });
    }
    return handleError(res, error);
  }
};
