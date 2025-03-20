const ReviewModel= require("../Model/Review")


const getAllreview=async (req, res) => {
    try {
      const reviews = await ReviewModel.find();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  //create new review
  const createReview= async (req, res) => {
    const { name, rating, comment } = req.body;
    // if (!name || !rating || !comment) {
    //   return res.status(400).json({ message: "All fields are required" });
    // }
  
    try {
      const newReview = new ReviewModel({ name, rating, comment });
      await newReview.save();
      res.status(201).json(newReview);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  module.exports= {getAllreview,createReview}