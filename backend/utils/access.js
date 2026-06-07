const Document = require("../models/Document");

const hasDocumentAccess = (doc, userId) => {
  if (!doc || !userId) return false;

  const ownerId = doc.owner?.toString?.() ?? String(doc.owner);
  if (ownerId === userId.toString()) return true;

  return doc.sharedWith?.some(
    (entry) => entry.userId?.toString?.() === userId.toString(),
  );
};

const isDocumentOwner = (doc, userId) => {
  if (!doc || !userId) return false;
  const ownerId = doc.owner?.toString?.() ?? String(doc.owner);
  return ownerId === userId.toString();
};

const findAccessibleDocument = async (id, userId) => {
  const doc = await Document.findById(id);
  if (!doc || !hasDocumentAccess(doc, userId)) return null;
  return doc;
};

module.exports = {
  hasDocumentAccess,
  isDocumentOwner,
  findAccessibleDocument,
};
