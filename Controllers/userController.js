const UserModel = require("../Models/userModel");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username, password });

    if (!user) {
      return res.json({
        message: "Incorrect UserModelname or password",
        status: false,
      });
    }
    user.password = undefined;
    return res.json({ status: true, user });
  } catch (e) {
    next(e);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userChecker = await UserModel.findOne({ username });
    if (userChecker) {
      return res.json({ message: "User already exist", status: false });
    }
    const emailChecker = await UserModel.findOne({ email });
    if (emailChecker) {
      return res.json({ message: "Email already exist", status: false });
    } else {
      const user = await UserModel.create({
        username,
        email,
        password,
      });
      user.password = undefined;
      return res.json({ status: true, user });
    }
  } catch (e) {
    next(e);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "_id",
    ]);
    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports.logout = (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
