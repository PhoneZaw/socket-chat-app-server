const MessageModel = require("./../Models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  const { from, to } = req.body;
  const messages = await MessageModel.find({
    users: {
      $all: [from, to],
    },
  }).sort({ updatedAt: 1 });

  const processedMessages = messages.map((msg) => ({
    fromSelf: msg.sender.toString() === from,
    message: msg.message,
  }));
  res.json(processedMessages);
  try {
  } catch (e) {
    next(e);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { message, from, to } = req.body;
    const data = MessageModel.create({
      message,
      users: [from, to],
      sender: from,
    });

    if (data)
      return res.json({ message: "Message Added Successfully", status: true });
    else
      return res.json({
        msg: "Failed to add message to the database",
        status: false,
      });
  } catch (e) {
    next(e);
  }
};
