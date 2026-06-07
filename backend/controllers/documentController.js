const Document = require("../models/Document");
const User = require("../models/User");

const handleError = (res, error) => {
  console.error(error);
  return res.status(500).json({
    message: "Server error",
    error: error.message || error,
  });
};

exports.createDocument = async (req, res) => {
  try {
    const doc = await Document.create({
      title: req.body.title,
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
        {
          "sharedWith.userId": req.user.id,
        },
      ],
    });

    res.json(docs);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    res.json(doc);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    res.json({
      message: "Deleted",
    });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.shareDocument = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    doc.sharedWith.push({
      userId: user._id,
    });

    await doc.save();

    res.json({
      message: "Shared Successfully",
    });
  } catch (error) {
    return handleError(res, error);
  }
};
