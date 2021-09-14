exports.register = (req, res, next) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  res.json({
    message: "Success register",
    data: data,
  });
};
