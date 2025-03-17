import mongoose from "mongoose";
import UserModel from "../../models/user.js"; // Adjust the path as necessary

class Getuser {
    // Get all users with optional pagination
    static getAllUsers = async (req, res) => {
        try {
            const { page, limit } = req.query;
    
            const pageNumber = parseInt(page) || 1;
            const pageLimit = parseInt(limit) || 10;
    
            const pipeline = [
                {
                    $lookup: {
                        from: "User_Profile",
                        localField: "_id",
                        foreignField: "userId",
                        as: "profileData",
                    },
                },
                { $unwind: { path: "$profileData", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "categories",
                        localField: "profileData.category",
                        foreignField: "_id",
                        as: "categoryData",
                    },
                },
                {
                    $lookup: {
                        from: "subcategories",
                        localField: "profileData.subcategory",
                        foreignField: "_id",
                        as: "subcategoryData",
                    },
                },
                {
                    $lookup: {
                        from: "packages", 
                        localField: "packages.packageId", 
                        foreignField: "_id", 
                        as: "packageDetails", 
                    },
                },
            ];
    
            if (page && limit) {
                pipeline.push(
                    { $skip: (pageNumber - 1) * pageLimit },
                    { $limit: pageLimit }
                );
    
                const [users, totalUsers] = await Promise.all([
                    UserModel.aggregate(pipeline).exec(),
                    UserModel.countDocuments().exec(),
                ]);
    
                return res.status(200).json({
                    totalUsers,
                    totalPages: Math.ceil(totalUsers / pageLimit),
                    currentPage: pageNumber,
                    users,
                });
            } else {
                const users = await UserModel.aggregate(pipeline).exec();
                return res.status(200).json({
                    totalUsers: users.length,
                    users,
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error fetching users and profiles" });
        }
    };

    // Get user by ID
    static getUserById = async (req, res) => {
        try {
            const { userId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ error: "Invalid User ID" });
            }
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: "Error fetching user" });
        }
    };

    // Delete user by ID
    static deleteUser = async (req, res) => {
        try {
            const { userId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ error: "Invalid User ID" });
            }
            const deletedUser = await UserModel.findOneAndDelete({ _id: userId });
            if (!deletedUser) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error deleting user" });
        }
    };

    // Update user by ID
    static updateUser = async (req, res) => {
        try {
            const { userId } = req.params;
            const updates = req.body;

            const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, {
                new: true,
                runValidators: true,
            }).exec();

            if (!updatedUser) {
                return res.status(404).json({ error: "User not found" });
            }

            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: "Error updating user" });
        }
    };
}

export default Getuser;
