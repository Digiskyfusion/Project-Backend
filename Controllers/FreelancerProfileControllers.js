const Freelancer = require("../Model/FreelancerProfile");

// Create Freelancer Profile
const createFreelancer = async (req, res) => {
  try {
    const { fullName, email, phone, address, skills, experience, bio } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : null;
// console.log(req.user.id);
const user_id = req.user._id; // Assuming _id is part of the decoded token

const existingProfile = await Freelancer.findOne({ user_id });

if (existingProfile) {
  return res.status(400).json({ message: "You have already submitted your profile." });
}

    const newFreelancer = new Freelancer({
      user_id: req.user.id,
      fullName,
      email,
      phone,
      address,
      skills,
      experience,
      bio,
      profileImage,
    });

    await newFreelancer.save();
    res.status(201).json({ message: "Freelancer profile created successfully", freelancer: newFreelancer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Freelancers
const getFreelancers = async (req, res) => {
  try {
    const freelancers = await Freelancer.find();
    res.status(200).json(freelancers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getfreelancerById = async (req, res) => {
  try {
      const { id } = req.params;
      const client = await Freelancer.findById(id);
      
      if (!client) {
          return res.status(404).json({ error: "freelancer not found" });
      }

      res.json(client);
  } catch (error) {
      res.status(500).json({ error: "Invalid freelancer ID" });
  }
};



const getFreelancerByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // user_id frontend se aa raha hai

    const freelancer = await Freelancer.findOne({ user_id: userId });
console.log(freelancer);

    if (!freelancer) {
      return res.status(404).json({ message: "profile create " });
    }

    res.status(200).json(freelancer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const updateFreelancerProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedData = req.body;

    const updatedFreelancer = await Freelancer.findOneAndUpdate(
      { user_id: userId },
      { $set: updatedData },
      { new: true, runValidators: true } // ✅ Ensures updated document is returned
    );

    if (!updatedFreelancer) {
      return res.status(404).json({ message: "Freelancer profile not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      freelancer: updatedFreelancer, // ✅ Make sure frontend gets updated data
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = { createFreelancer, getFreelancers,getfreelancerById,getFreelancerByUserId,updateFreelancerProfile};
