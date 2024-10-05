const path = require("path");

const uploadDocuments = (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ status: "Error", message: "No file uploaded." });
  }

  const { originalname, path: filePath } = req.file;

  res.json({
    status: "Success",
    message: "File uploaded successfully",
    data: {
      filename: originalname, // Original name of the uploaded file
      path: filePath, // Path where the file is stored
    },
  });
};

module.exports = uploadDocuments;
