const ClientProfile = require("../Model/ClientProfile");

const createClients = async (req, res) => {
    try {
        const {fullName, email, phoneNumber, address, experience,  bio } = req.body;

          const user_id = req.user._id; // Assuming _id is part of the decoded token
          
          const existingProfile = await Freelancer.findOne({ user_id });
          
          if (existingProfile) {
            return res.status(400).json({ message: "You have already submitted your profile." });
          }
          
        const skills = req.body.skills ? [].concat(req.body.skills) : [];
        const portfolioLinks = req.body.portfolioLinks ? [].concat(req.body.portfolioLinks) : [];
        const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

        const newClient = new ClientProfile({
            user_id ,
            fullName,
            email,
            phoneNumber,
            address,
            experience,
            bio,
            skills,
            portfolioLinks,
            profileImage
        });
// console.log(req.body);

        await newClient.save();
        res.status(201).json({ message: "Client profile created successfully!", client: newClient });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getClients = async (req, res) => {
    try {
        const clients = await ClientProfile.find();
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await ClientProfile.findById(id);
        
        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }

        res.json(client);
    } catch (error) {
        res.status(500).json({ error: "Invalid client ID" });
    }
};


module.exports= {createClients,getClients,getClientById}