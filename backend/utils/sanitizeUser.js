const sanitizeUser = (user) => {
  if (!user) return null;

  const plain = user.toObject ? user.toObject() : { ...user };
  delete plain.password;
  return plain;
};

module.exports = sanitizeUser;
