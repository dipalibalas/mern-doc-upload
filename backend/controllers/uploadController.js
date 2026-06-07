exports.uploadFile = async (req, res) => {
  try {
    if (!req.file || !req.file.filename) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    res.json({
      file: req.file.filename,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message || error,
    });
  }
};
