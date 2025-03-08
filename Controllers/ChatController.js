const express = require("express");
const app = express();
const chatModel = require("../Model/chat");
const cookieParser = require("cookie-parser");
const userModel= require("../Model/user")
app.use(cookieParser());
const mongoose = require("mongoose");

//chat

const sendMessage =async (req, res) => {
  const { sender, receiver, message } = req.body;

  try {
    const senders = await userModel.findById(sender);
    console.log(sender);
    
    // Validate freelancer credits (assuming 1 credit per message)
    if (senders.role === 'freelancer' && senders.credits < 1) {
      return res.status(403).json({ error: 'Not enough credits to send a message' });
    }

    // Save message in database
    const chat = new chatModel({ sender, receiver, message });
    await chat.save();

    // Deduct credit if sender is a freelancer
    if (senders.role === 'freelancer') {
      senders.credits -= 1;
      await senders.save();
    }

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({
      name:"Hello",
      error: error.message });
  }
}

const chatHistoryAPI = async (req, res) => {
  try {
    const { userId } = req.params; // ID of the user to fetch chat history with
    const loggedInUserId = req.query.currentUserId; // Get from query params


    // Validate if the logged-in user is requesting their chat history
    if (!loggedInUserId) {
      return res.status(401).json({ message: "User authentication required." });
    }

    // Fetch chat history between the logged-in user and the other user
    const chatHistory = await chatModel
      .find({
        $or: [
          { sender: loggedInUserId, receiver: userId },
          { sender: userId, receiver: loggedInUserId },
        ],
      })
      .sort({ createdAt: 1 }); // Sort by date (ascending)
//     const chatHistory = await chatModel.find({});
// console.log(chatHistory);


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


// const chatHistoryAPI = async (req, res) => {
//   try {
//     const { userId } = req.params; // The other user's ID
//     const loggedInUserId = req.query.currentUserId; // The logged-in user's ID

//     if (!loggedInUserId) {
//       return res.status(401).json({ message: "User authentication required." });
//     }

//     console.log("Fetching chat between:", loggedInUserId, "and", userId);

//     // Convert IDs to ObjectId
//     const senderId = new mongoose.Types.ObjectId(loggedInUserId);
//     const receiverId = new mongoose.Types.ObjectId(userId);

//     // Fetch chat history
//     const chatHistory = await chatModel
//       .find({
//         $or: [
//           { sender: senderId, receiver: receiverId },
//           { sender: receiverId, receiver: senderId },
//         ],
//       })
//       .sort({ timestamp: 1 });

//     console.log("Chat History Found:", chatHistory);

//     if (chatHistory.length === 0) {
//       return res.status(404).json({ message: "No chat history found." });
//     }

//     return res.status(200).json({ chatHistory });
//   } catch (error) {
//     console.error("Error fetching chat history:", error);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// };

module.exports = { sendMessage, chatHistoryAPI };
