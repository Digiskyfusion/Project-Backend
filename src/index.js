import express from "express";
import "dotenv/config";
import { createServer } from 'http';
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import multer from "multer";
import connectDb from "./config/mongo.js";
import userRoutes from "./routes/user.js";  // ✅ Ensure this matches the actual file path
import Review from "./routes/review.js"
import Client from "./routes/client.js"
import Freelancer from "./routes/freelancer.js"
import Forget from "./routes/Forget.js"
import paymentRoutes from "./routes/paymentRoutes.js";
import chat from "./routes/chat.js";
import firebaseRoute from "./routes/firebaseRoute.js";
import jobrouter from "./routes/jobRoute.js"
import { Server } from 'socket.io';
import path from "path";
import { fileURLToPath } from "url";
import User from "./model/user.js";

const app = express();
const upload = multer({});
const server = createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json())


const io = new Server(server, {
  cors: {
   origin: [
      "http://localhost:5173",
      "https://digisky.ai",
      "https://www.digisky.ai",
      "http://localhost:4173",
      "http://localhost:5173",
      "http://localhost:3000",
      "https://3.109.174.170",
      "https://api.digisky.ai"
    ],
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      socket.to(data.conversationId).emit('receive_message', data);
      
      socket.emit('message_delivered', data);
    } catch (error) {
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Middleware setup
// app.use(upload.any());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


// CORS configuration
// const allowedOrigins = 

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow non-browser tools like Postman

      const allowedBaseDomains = [  
  "https://digisky.ai",
  "https://www.digisky.ai",
  "http://localhost:4173",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://3.109.174.170",
  "https://api.digisky.ai"
];
      const url = new URL(origin);
      const hostname = url.hostname;

      const isAllowed = allowedBaseDomains.some(base => 
        hostname === base || hostname.endsWith(`.${base}`)
      );

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use((req, res, next) => {
  const host = req.hostname;
  const hostParts = host.split('.');

  if (hostParts.length > 2) {
    const subdomain = hostParts[0];

    if (subdomain !== 'www' && subdomain !== 'digisky') {
      req.subdomainUser = subdomain;
    }
  }

  next();
});



// Database connection
connectDb();

// Server health check
app.get("/", (req, res) => res.send("Server is working"));


// Routes
app.use("/user", userRoutes);
app.use("/client",Client)
app.use("/freelancer",Freelancer)
app.use("/review", Review);
app.use("/api", Forget);
app.use("/api/payment", paymentRoutes);
app.use('/chat', chat);
app.use('/firebase', firebaseRoute);
app.use("/api/jobs", jobrouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Start server

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running on http://localhost:${port}`));
export { io }