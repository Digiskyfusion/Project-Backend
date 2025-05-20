import express from "express";
import "dotenv/config";
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
const app = express();
const upload = multer({});

// Middleware setup
app.use(upload.any());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [  
  "https://digisky.ai",
  "https://www.digisky.ai",
  "http://localhost:4173",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://3.109.174.170"
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

// Server health check
app.get("/", (req, res) => res.send("Server is working"));

// Routes
app.use("/user", userRoutes);
app.use("/client",Client)
app.use("/freelancer",Freelancer)
app.use("/review", Review);
app.use("/api", Forget);
app.use("/api/payment", paymentRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
