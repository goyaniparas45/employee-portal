const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword);
};

const isMasterPassword = async (receivedPassword) => {
  const salt = await bcrypt.genSalt(10);
  const encrypted_password = await bcrypt.hash(MASTER_PASSWORD, salt);
  return await bcrypt.compare(encrypted_password, receivedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
  isMasterPassword,
};
