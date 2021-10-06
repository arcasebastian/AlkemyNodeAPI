exports.post = (req, res, next) => {
  return res.status(201).json({ status: "New genre successfully created" });
};
exports.getAll = (req, res, next) => {
  return res
    .status(200)
    .json([
      { name: "Animation", image: "https://localhost/images/dhdwu191832h" },
    ]);
};
exports.getOne = (req, res, next) => {
  return res.status(200).json({
    name: "Animation",
    image: "https://localhost/images/dhdwu191832h",
  });
};
exports.put = (req, res, next) => {
  return res.status(200).json({ status: "Genre successfully updated" });
};
exports.delete = (req, res, next) => {
  return res.status(200).json({ status: "Genre was successfully deleted" });
};
