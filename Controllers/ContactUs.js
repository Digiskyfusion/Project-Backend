const Contact= require("../Model/ContactUS")


const contact=async (req, res) => {
    try {
      const { name, email, phone, subject, message } = req.body;
      const newContact = new Contact({ name, email, phone, subject, message });
      await newContact.save();
      res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }


  module.exports= {contact}