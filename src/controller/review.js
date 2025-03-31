import review from "../model/review.js";

// Create new review
export const createReview = async (req, res) => {
    const { name, rating, comment } = req.body;
  
    try {
      const newReview = new review({ name, rating, comment });
      await newReview.save();
      res.status(201).json(newReview);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
export const getAllreview = async (req, res) => {
  try {
    const reviews = await review.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

