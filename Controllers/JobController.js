const Job= require("../Model/Job")
const { sendMailNodemailer } = require("../Mail/SendMail");

 const postJob = async (req, res) => {
  try {
    const { title, skills, scope, budget, currency, description,location } = req.body;
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
    await sendMailNodemailer({
        to: req.user.email, // User's email
        subject: "Job Posted Successfully",
        text: `Hello ${req.user.name}, Your job has been posted successfully.`,
        html: `<p>Hi ${req.user.name},</p>
               <p>Your job titled <b>${title}</b> has been posted successfully!</p>`,
      });
    res.status(201).json({ message: "Job posted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

 const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = { getAllJobs, postJob };
