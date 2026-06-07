const { parseUploadedFile } = require("../utils/fileParser");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const parsed = await parseUploadedFile(
      req.file.path,
      req.file.originalname,
    );

    res.json({
      file: req.file.filename,
      title: parsed.title,
      content: parsed.content,
    });
  } catch (error) {
    if (error.message?.includes("Unsupported file type")) {
      return res.status(400).json({ message: error.message });
    }

    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message || error,
    });
  }
};
