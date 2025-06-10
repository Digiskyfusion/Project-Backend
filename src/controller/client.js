import userModel from '../model/user.js';


// get all client
export const getAllClient = async (req, res) => {
    try {
        const clients = await userModel.find({ roleType: "client" });
        res.status(200).json({ success: true, data: clients });
    } catch (err) {
        res
            .status(500)
            .json({
                success: false,
                message: "Error fetching clients",
                error: err.message,
            });
    }
};

// get client by id
export const getSingleClient = async (req,res) => {
    try{
        const id = req.params.id;
        const user = await userModel.findOne({ _id: id, roleType: 'client' });

        if (!user) {
            // If user not found or roleType is not 'client'
            return res.status(404).json({ message: 'User not found or not a client' });
          }

          res.status(200).json({ success: true, data: user });

    }catch(err){
        res
            .status(500)
            .json({
                success: false,
                message: "Error fetching clients",
                error: err.message,
            });
    }
};