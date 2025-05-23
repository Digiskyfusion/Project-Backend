import Chat from "../model/chat.js";
import User from "../model/user.js";

export const getOrCreateConversation = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    const users = await User.find({ _id: { $in: [userId1, userId2] } });
    if (users.length !== 2) {
      return res.status(404).json({
        success: false,
        message: "One or both users not found"
      });
    }

    let conversation = await Chat.findOne({
      participants: { $all: [userId1, userId2] }
    })
      .populate("participants", "name image")
      .populate("messages.sender", "name image");

    if (!conversation) {
      conversation = new Chat({
        participants: [userId1, userId2],
        messages: []
      });
      await conversation.save();
      conversation = await Chat.findById(conversation._id)
        .populate("participants", "name image");
    }

    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error("Error in getOrCreateConversation:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching conversation"
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, text } = req.body;
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({
        success: false,
        message: "Sender not found"
      });
    }

    const message = {
      sender: senderId,
      text,
      timestamp: new Date(),
      read: false
    };

    const updatedConversation = await Chat.findByIdAndUpdate(
      conversationId,
      {
        $push: { messages: message },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    )
      .populate("participants", "name image")
      .populate("messages.sender", "name image");

    res.status(200).json({
      success: true,
      data: updatedConversation
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({
      success: false,
      message: "Error sending message"
    });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;

   const conversations = await Chat.find({
  participants: userId,
  messages: { $exists: true, $not: { $size: 0 } }
})
.populate("participants", "name image")
.populate("messages.sender", "name image")
.sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error("Error in getUserConversations:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching conversations"
    });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId, userId } = req.body;

    const conversation = await Chat.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    // Only update messages not sent by the user
    let updated = false;
    conversation.messages.forEach(msg => {
      if (msg.sender.toString() !== userId && !msg.read) {
        msg.read = true;
        updated = true;
      }
    });

    if (updated) {
      await conversation.save();
    }

    res.status(200).json({
      success: true,
      message: "Messages marked as read"
    });
  } catch (error) {
    console.error("Error in markMessagesAsRead:", error);
    res.status(500).json({
      success: false,
      message: "Error marking messages as read"
    });
  }
};
