import express from "express";
import "dotenv/config";
import cors from "cors";
import multer from "multer";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import userAuth from "./routes/userAuth.js";
import payment from "./routes/authenticated/payment.js";
import oAuth from "./routes/oAuth.js";
import connectDb from "./config/mongo.js";
import packageRoutes from "./routes/authenticated/package.js";
import verifyToken from "./middlewares/authentication.js";
import userInfo from "./routes/authenticated/user.js";
import adminuser from "./routes/admin/user.js";
import conversation from "./routes/authenticated/conversation.js";
import { Server } from "socket.io";
import path from "path";
import UserModel from "./models/user.js";
import Chat from "./models/chat.js";
import verifyAdmin from "./middlewares/admin_authentication.js";
import categoryRoutes from "./routes/admin/category.js";
import subcategoryRoutes from "./routes/admin/subcategory.js";
import usersRoutes from "./routes/user/user.js";
import profileRoutes from "./routes/user/User_Profile.js";
import blogRoutes from "./routes/admin/blog.js";

// Multer config
const upload = multer({});
const app = express();
app.use(upload.any());

// Middleware setup
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  "https://digisky.ai",
  "https://www.digisky.ai",
  "http://localhost:4173",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Database connection
connectDb();

// Server check
app.get("/", (req, res) => {
  res.send("Server is working");
});

// Routes setup
app.use("/auth", userAuth);
app.use("/validate-token", verifyToken, async (req, res) => {
  const user = await UserModel.findById(
    req.userId,
    "_id name email roleType country verification status credits image joinedAt mobileNumber"
  );
  return res.status(200).json({ message: "Token verified successfully", user });
});
app.use("/google-auth", oAuth);
app.use("/userInfo", verifyToken, userInfo);
app.use("/user/payment", payment);
app.use("/user/package", packageRoutes);
app.use("/user/chat", verifyToken, conversation);
app.use("/admin", verifyAdmin, adminuser);
app.use("/category", categoryRoutes);
app.use("/subcategory", subcategoryRoutes); // Corrected to lowercase for consistency
app.use("/users", usersRoutes); // Updated to plural for clarity
app.use("/user/profile", profileRoutes);
app.use("/blog", blogRoutes); 

// Error handler
app.use(errorHandler);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
});

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});


// Map to store socket IDs of connected users
const connectedUsers = new Map();
const userStatus = new Map();

io.of("/").on("connection", (socket) => {
  socket.on("disconnect", () => {
  });
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
  });

  socket.on("disconnect", () => {
      console.log("User Disconnected");
  });
});


