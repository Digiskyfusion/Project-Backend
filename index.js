require('dotenv').config();
const express= require("express");
const app= express();
const mongooes= require("./utils/Db")
const router= require("./router/routers")
const { check } = require('express-validator');
const cors = require('cors');
const helmet = require('helmet');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(cors());  // Enable CORS
app.use(helmet()); // Secure HTTP headers

app.use("/api/auth",router)
app.use("/api/user",router)

mongooes().then(()=>
    {
        app.listen(3000,()=>
        {
            console.log(`connected succesfully`);
            
        })
    })