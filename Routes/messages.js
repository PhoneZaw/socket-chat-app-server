const { getMessages, addMessage } = require("../Controllers/messageController");

const router = require("express").Router();

router.post("/getMessages", getMessages);
router.post("/addMessage", addMessage);

module.exports = router;
