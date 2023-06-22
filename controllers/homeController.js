exports.home = (req, res) => {
  res.status(200).json({
    message: "this is the home page",
    success: true,
  });
};
