import userModel from "../model/user.js";


// get all freelancer
export const getAllFreelancer = async (req, res) => {
    try {
        const freelancers = await userModel.find({ roleType: "freelancer" });
        res.status(200).json({ success: true, data: freelancers });
    } catch (err) {
        res
            .status(500)
            .json({
                success: false,
                message: "Error fetching freelancers",
                error: err.message,
            });
    }
};

// get freelancer by id
export const getSingleFreelancer = async (req,res) => {
    try{
        const id = req.params.id;
        const user = await userModel.findOne({ _id: id, roleType: 'freelancer' });

        if (!user) {
            // If user not found or roleType is not 'client'
            return res.status(404).json({ message: 'User not found or not a freelancer' });
          }

          res.status(200).json({ success: true, data: user });

    }catch(err){
        res
            .status(500)
            .json({
                success: false,
                message: "Error fetching freelancer",
                error: err.message,
            });
    }
};