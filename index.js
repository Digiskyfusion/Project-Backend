require('dotenv').config();
const express= require("express");
const app= express();
const { Server } = require("socket.io");
const http = require("http");
const mongooes= require("./utils/Db")
const router= require("./router/routers")
const { check } = require('express-validator');
const cors = require('cors');
const helmet = require('helmet');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);

const corsOption = new Server(server, {
    cors: {
      origin: "localhost:5173", // Change this to your frontend URL in production
      methods: ["GET", "POST", "PUT", "DETELE"],
      credentials: true
    },
  });

// Middleware
app.use(cors(corsOption));  // Enable CORS
app.use(helmet()); // Secure HTTP headers

app.use("/api/auth",router)
app.use("/api/user",router)
app.use("/api/chat",router)
app.use("/api/plan",router)
app.use("/api/category",router)
app.use("/api/freelancer",router)
app.use("/api/client",router)



// Socket.io connection
corsOption.on('connection', (socket) => {
    console.log('User connected: ', socket.id);
  
    // Join a room for a specific user (based on userId)
    socket.on('joinRoom', (userId) => {
      socket.join(userId); // Join a room specific to the user
      console.log(`User ${userId} joined room`);
    });
  
    // Listen for a new chat message
    socket.on('sendMessage', async (data) => {
      const { sender, receiver, message } = data;
  
      // Store the chat message in the database
      const newMessage = new Chat({
        sender,
        receiver,
        message,
      });
      await newMessage.save();
  
      // Emit the message to the receiver's room (real-time update)
      io.to(receiver).emit('receiveMessage', {
        sender,
        receiver,
        message,
        createdAt: new Date(),
      });
  
      // Optionally, emit the message to the sender as well
      io.to(sender).emit('receiveMessage', {
        sender,
        receiver,
        message,
        createdAt: new Date(),
      });
    });
  
    // When the user disconnects
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });


mongooes().then(()=>
    {
        app.listen(3000,()=>
        {
            console.log(`connected succesfully`);
            
        })
    })