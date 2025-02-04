require('dotenv').config();
const express= require("express");
const app= express();
const mongooes= require("./utils/Db")
const router= require("./router/routers")


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",router)

mongooes().then(()=>
    {
        app.listen(3000,()=>
        {
            console.log(`connected succesfully`);
            
        })
    })