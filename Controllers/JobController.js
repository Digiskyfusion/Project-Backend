const Job= require("../Model/Job")
const { sendMailNodemailer } = require("../Mail/SendMail");


const postJob = async (req, res) => {
  try {
    // Authorization Check: Sirf client job post kar sakta hai
    if (req.user.roleType !== "client") {
      return res.status(403).json({ message: "Only clients can post jobs." });
    }

    const { title, skills, scope, budget, currency, description,location } = req.body;
    if (!title || !skills || !scope || !budget || !currency || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const file = req.file ? req.file.filename : null;

    const newJob = new Job({
      title,
      skills,
      scope,
      budget,
      currency,
      description,
      file,
      location,
      postedBy: req.user.id,
    });

    await newJob.save();

    // Check if email exists before sending
    if (req.user.email) {
      await sendMailNodemailer({
        to: req.user.email,
        subject: "Job Posted Successfully",
        text: `Hello ${req.user.name}, Your job has been posted successfully.`,
        html: `<p>Hi ${req.user.name},</p>
               <p>Your job titled <b>${title}</b> has been posted successfully!</p>`,
      });
    }

    res.status(201).json({ message: "Job posted successfully!" });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

 const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    // console.log(jobs);
    
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteJob= async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


const updateJob= async (req, res) => {
  try {
    const { title, skills, scope, budget, currency, description } = req.body;
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,req.body,{ runValidators: true}, // Ensures validation rules app
      { title, skills, scope, budget, currency, description },
      { new: true }
    );
    if (!updatedJob) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}


const findById=async (req, res) => {
  const user = await Job.findById(req.user._id).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
}
module.exports = { getAllJobs, postJob,deleteJob ,updateJob,findById};
