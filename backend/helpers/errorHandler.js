const errorHandler = (err, res) => {
  if (err.code === 11000) {
    return res
      .status(400)
      .json({ status: "error", message: "Email already exists" });
  }
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => {
      return {
        field: error["properties"].path,
        message: error["properties"].message,
      };
    });
    return res.status(400).json(errors);
  }

  return res.status(500).json({
    status: "error",
    message: "An unknown error occurred",
  });
};

module.exports = errorHandler;
