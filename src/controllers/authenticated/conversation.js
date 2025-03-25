import Chat from "../../models/chat.js";
import Message from "../../models/message.js";
import UserModel from "../../models/user.js";

class ConversationController {
    static createChat = async (req, res) => { 
        try {
            const { userId } = req.body;
            console.log(`\n[CREATE CHAT] Request from User: ${req.userId} to User: ${userId}`);
    
            if (!userId) {
                console.log("[ERROR] userId is missing in request body.");
                return res.status(400).json({ message: "userId is required" });
            }
    
            const initiator = await UserModel.findById(req.userId);
            const recipient = await UserModel.findById(userId);
    
            if (!initiator || !recipient) {
                console.log("[ERROR] One or both users not found.");
                return res.status(404).json({ message: "One or both users not found" });
            }
    
            if (initiator.roleType === "freelancer" && recipient.roleType === "freelancer") {
                console.log("[ERROR] Freelancer cannot chat with another freelancer.");
                return res.status(403).json({ message: "Freelancers cannot chat with other freelancers" });
            }
    
            // Check if chat already exists
            const existingChat = await Chat.findOne({
                $or: [
                    { user1: req.userId, user2: userId },
                    { user1: userId, user2: req.userId }
                ]
            }).populate("user1 user2", "-password").populate("latestMessage");
    
            if (existingChat) {
                console.log(`[INFO] Chat already exists between ${req.userId} and ${userId}`);
                if (existingChat.notify?.reciver_id?.equals(req.userId)) {
                    existingChat.notify.message_count = 0;
                    existingChat.notify.reciver_id = null;
                    await existingChat.save();
                }
                return res.status(200).json(existingChat);
            }
    
            // **Deduct 1 credit if Client starts chat with a Freelancer**
            if (initiator.roleType === "client" && recipient.roleType === "freelancer") {
                if (recipient.credits <= 0) {
                    console.log(`[ERROR] Freelancer ${userId} has insufficient credits.`);
                    return res.status(400).json({ message: "Freelancer has insufficient credits." });
                }
                console.log(`[INFO] Deducting 1 credit from Freelancer: ${userId}`);
                await UserModel.findByIdAndUpdate(
                    userId,
                    { $inc: { credits: -1 } },
                    { new: true }
                );
            }
    
            // Create new chat
            const newChat = new Chat({ user1: req.userId, user2: userId });
            await newChat.save();
            console.log(`[SUCCESS] New chat created between ${req.userId} and ${userId}`);
    
            const fullChat = await Chat.findById(newChat._id).populate("user1 user2", "-password");
            return res.status(201).json(fullChat);
        } catch (error) {
            console.error("[ERROR] Error creating chat:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
    
    static sendMessage = async (req, res) => {
        try {
            const { content, chatId } = req.body;
    
            if (!content || !chatId) {
                return res.status(400).json({ message: "Content and chatId are required." });
            }
    
            // Fetch sender details
            const sender = await UserModel.findById(req.userId);
            if (!sender) {
                return res.status(404).json({ message: "Sender not found." });
            }
    
            // Fetch chat details
            const chat = await Chat.findById(chatId).populate("user1 user2");
            if (!chat) {
                return res.status(404).json({ message: "Chat not found." });
            }
    
            // Determine receiver
            const receiver = chat.user1._id.equals(req.userId) ? chat.user2 : chat.user1;
    
            // Create message
            const newMessage = await Message.create({
                sender_id: req.userId,
                content,
                chat_id: chatId,
            });
    
            // Populate the message with sender and chat info
            const populatedMessage = await Message.findById(newMessage._id)
                .populate("sender_id", "name email")
                .populate("chat_id");
    
            // Update latest message in chat
            await Chat.findByIdAndUpdate(chatId, {
                latestMessage: populatedMessage._id,
                notify: {
                    message_count: (chat.notify?.message_count || 0) + 1,
                    reciver_id: receiver._id,
                },
            });
    
            // ✅ Emit message to socket
            io.to(chatId).emit("newMessage", populatedMessage);
    
            return res.status(201).json({ message: "Message sent successfully", data: populatedMessage });
        } catch (error) {
            console.error("Error sending message:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    static fetchChats = async (req, res) => {
        try {
            const userChats = await Chat.find({
                $or: [
                    { user1: req.userId },
                    { user2: req.userId }
                ]
            })
                .populate("user1 user2", "-password")
                .populate("latestMessage")
                .sort({ updatedAt: -1 });

            const result = await UserModel.populate(userChats, {
                path: "latestMessage.sender_id",
                select: "name email"
            });

            return res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching chats:", error);
            return res.status(500).json({ message: "An error occurred while fetching chats." });
        }
    };

   
    
    
    static fetchAllMessages = async (req, res) => {
        try {
            const { chatId } = req.params;

            if (!chatId) {
                return res.status(400).json({ message: "Chat ID is required" });
            }

            const messages = await Message.find({ chat_id: chatId })
                .populate("sender_id", "name email")
                .populate("chat_id");

            return res.status(200).json(messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
}

export default ConversationController;
