const uploadDocuments = (req, res) =>
  res.json({ name: req.file.originalname, path: req.file.path });


module.exports = uploadDocuments;