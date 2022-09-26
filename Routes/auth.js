const {
  register,
  login,
  getAllUsers,
  logout,
} = require("../Controllers/userController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getAllUsers/:id", getAllUsers);
router.get("/logout", logout);

module.exports = router;
