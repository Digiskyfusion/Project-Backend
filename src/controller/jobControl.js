import Job from "../model/job.js";
import { sendMailNodemailer } from "../config/email.js";

export const postJob = async (req, res) => {
  try {
    // console.log(req.user);
    
    // Only clients can post jobs
    if (req.user.roleType !== "client") {
      return res.status(403).json({ message: "Only clients can post jobs." });
    }


    const { title, skills, budget, currency, description,experience } = req.body;
    if (!title || !skills || !budget || !experience || !currency || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const file = req.file ? req.file.filename : null;

    const newJob = new Job({
      title,
      skills,
    //   scope,
      budget,
      currency,
      description,
      experience,
    //   file,
    //   location,
      postedBy: req.user.id,
    });

    await newJob.save();

    // Send confirmation email
    if (req.user.email) {
  await sendMailNodemailer({
    to: req.user.email,
    subject: "Job Posted Successfully",
    text: `Hello ${req.user.name}, Your job has been posted successfully.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: #f9f9f9;">
        <h2 style="color: #4CAF50; text-align: center;">🎉 Job Posted Successfully!</h2>
        <p style="font-size: 16px; color: #333;">Hi <strong>${req.user.name}</strong>,</p>
        <p style="font-size: 16px; color: #555;">
          Your job titled <span style="font-weight: bold; color: #000;">${title}</span> has been posted successfully on our platform.
        </p>
        <p style="font-size: 16px; color: #555;">
          Thank you for using our service. We wish you the best in finding the right candidate!
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 14px; color: #999; text-align: center;">
          If you have any questions, feel free to reply to this email.
        </p>
      </div>
    `,
  });
}

    res.status(201).json({ message: "Job posted successfully!" });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { title, skills, scope, budget, currency, description } = req.body;
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { title, skills, scope, budget, currency, description },
      { new: true, runValidators: true }
    );
    if (!updatedJob) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


