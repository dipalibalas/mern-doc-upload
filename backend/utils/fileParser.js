const fs = require("fs/promises");
const path = require("path");

const SUPPORTED_EXTENSIONS = [".txt", ".md", ".docx"];

const textToTipTap = (text) => {
  const paragraphs = text
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line, index, lines) => line.length > 0 || lines[index + 1] !== "");

  if (paragraphs.length === 0) {
    return {
      type: "doc",
      content: [{ type: "paragraph" }],
    };
  }

  return {
    type: "doc",
    content: paragraphs.map((line) => ({
      type: "paragraph",
      content: line
        ? [{ type: "text", text: line }]
        : [],
    })),
  };
};

const parseUploadedFile = async (filePath, originalName) => {
  const extension = path.extname(originalName).toLowerCase();

  if (!SUPPORTED_EXTENSIONS.includes(extension)) {
    throw new Error(
      `Unsupported file type. Supported: ${SUPPORTED_EXTENSIONS.join(", ")}`,
    );
  }

  if (extension === ".docx") {
    let mammoth;
    try {
      mammoth = require("mammoth");
    } catch {
      throw new Error("DOCX import is not available on this server");
    }

    const result = await mammoth.extractRawText({ path: filePath });
    return {
      title: path.basename(originalName, extension),
      content: textToTipTap(result.value),
      text: result.value,
    };
  }

  const text = await fs.readFile(filePath, "utf-8");
  return {
    title: path.basename(originalName, extension),
    content: textToTipTap(text),
    text,
  };
};

module.exports = {
  SUPPORTED_EXTENSIONS,
  textToTipTap,
  parseUploadedFile,
};
