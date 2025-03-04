const express = require("express");
const app = express();
const chatModel = require("../Model/chat");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//chat

const sendMessage = async (req, res) => {
  try {
    const { receiver, message, roleType } = req.body;
    const sender = req.user;
    console.log(message);

    if (!receiver || !message) {
      return res
        .status(400)
        .json({ message: "Receiver and message are required" });
    }

    // Check if sender is a freelancer and has enough credits
    if (sender.roleType == "freelancer") {
      if (sender.credits < 1) {
        return res.status(403).json({ message: "Insufficient credits" });
      }
      sender.credits -= 1; // Deduct one credit per message
      await sender.save();
    }

    // Save chat message
    const chatMessage = new chatModel({
      sender: sender._id,
      receiver: receiver,
      message,
      roleType,
    });

    await chatMessage.save();

    res
      .status(201)
      .json({ message: "Message sent successfully", chat: chatMessage });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const chatHistoryAPI = async (req, res) => {
  try {
    const userId = req.params.userId;
    const loggedInUserId = req.user.id; // Assuming JWT or session authentication to get the logged-in user ID

    // Validate if the logged-in user is requesting their chat history
    if (!userId || userId !== loggedInUserId) {
      return res
        .status(403)
        .json({ message: "You can only access your own chat history." });
    }

    // Fetch chat history between the logged-in user and the other user
    const chatHistory = await chatModel
      .find({
        $or: [
          { senderId: loggedInUserId, receiverId: userId },
          { senderId: userId, receiverId: loggedInUserId },
        ],
      })
      .sort({ createdAt: 1 }); // Sort by date (ascending)

    if (!chatHistory) {
      return res.status(404).json({ message: "No chat history found." });
    }

    // Return the chat history
    return res.status(200).json({ chatHistory });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { sendMessage, chatHistoryAPI };
