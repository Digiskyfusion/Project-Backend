import express from "express";
import {
  getOrCreateConversation,
  sendMessage,
  getUserConversations,
  markMessagesAsRead
} from "../controller/chat.js";

const router = express.Router();

router.route("/conversation/:userId1/:userId2").get(getOrCreateConversation);

router.route("/message").post(sendMessage);

router.route("/user-conversations/:userId").get(getUserConversations);

router.route("/mark-as-read").patch(markMessagesAsRead);

export default router;