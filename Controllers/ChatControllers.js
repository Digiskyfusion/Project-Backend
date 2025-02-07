// /controllers/chatController.js
const User = require('../Model/user');
const Chat = require('../Model/chat');

// Chat API - Send Message
const sendMessage = async (req, res) => {
    try {
        const { receiver, message } = req.body;

        // Ensure the sender is a freelancer and has enough credits
        const sender = req.user; // User from the protected middleware

        if (sender.role !== 'freelancer') {
            return res.status(400).json({ message: 'Only freelancers can send messages' });
        }

        // Check if the sender has enough credits (example: deduct 10 credits per message)
        const requiredCredits = 10;
        if (sender.credits < requiredCredits) {
            return res.status(400).json({ message: 'Not enough credits to send a message' });
        }

        // Deduct credits
        sender.credits -= requiredCredits;
        await sender.save();

        // Save the chat message
        const newChatMessage = new Chat({
            sender: sender._id,
            receiver,
            message
        });

        await newChatMessage.save();

        res.status(201).json({
            message: 'Message sent successfully',
            chat: newChatMessage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { sendMessage };
