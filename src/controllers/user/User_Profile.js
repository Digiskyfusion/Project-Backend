import mongoose from "mongoose";
import ProfileModel from "../../models/User_Profile.js"; // Adjust the path as necessary
import UserModel from "../../models/user.js";

class GetUserProfileVerification {
  // Get all profiles with pagination
  async getAllProfiles(req, res) {
    const { page = 1, limit = 10 } = req.query;
    try {
      const profiles = await ProfileModel.find()
        .skip((page - 1) * parseInt(limit))
        .limit(parseInt(limit));
      const total = await ProfileModel.countDocuments();

      res.status(200).json({ profiles, total });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get a single profile by ID
  async getProfileById(req, res) {
    const { id } = req.params;
    try {
      const profile = await ProfileModel.findById(id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.status(200).json(profile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Add or update a profile
  async addProfile(req, res) {
    const data = req.body;
    const { userId } = data;

    try {
      const updatedProfile = await ProfileModel.findOneAndUpdate(
        { userId },
        { $set: data },
        { new: true, upsert: true } // 'new' returns the updated document, 'upsert' creates if not found
      );

      res.status(201).json(updatedProfile);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete a profile by ID
  async deleteProfile(req, res) {
    const { id } = req.params;
    try {
      const deletedProfile = await ProfileModel.findByIdAndDelete(id);
      if (!deletedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get users by subcategory
  async getUserBySubCategory(req, res) {
    const { subcategory } = req.params;
    try {
      const users = await ProfileModel.find({ subcategory })
        .populate("userId") // Populate user data
        .populate("category") // Populate category data
        .populate("subcategory") // Populate subcategory data
        .exec();

      if (!users.length) {
        return res
          .status(404)
          .json({ message: "No users found for this subcategory." });
      }

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({
        error: "Error fetching users by subcategory",
        message: error.message,
      });
    }
  }

  // Get users by subcategory
  async getUserByFilters(req, res) {
    const { category, role, status } = req.query;
    try {
        const profileFilters = {};
        if (category) {
            profileFilters.category = category;
        }

        if (role) {
            profileFilters.roletype = role;
        }

        const userFilters = {};
        if (status) userFilters.status = status;

        const users = await ProfileModel.aggregate([
            {
                // Lookup to join ProfileModel with UserModel
                $lookup: {
                    from: "users", // User collection
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            { $unwind: "$userDetails" }, // Flatten userDetails array
            {
                // Lookup to join ProfileModel with Payment model
                $lookup: {
                    from: "payments", // Payment collection
                    localField: "userId",
                    foreignField: "userId",
                    as: "paymentDetails",
                },
            },
            {
                $unwind: {
                    path: "$paymentDetails",
                    preserveNullAndEmptyArrays: true,
                },
            }, // Flatten paymentDetails array, allow empty
            {
                // Lookup to join ProfileModel with Category model
                $lookup: {
                    from: "categories", // Category collection
                    localField: "category",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true,
                },
            }, // Flatten categoryDetails array, allow empty
            {
                // Lookup to join ProfileModel with Package model
                $lookup: {
                    from: "packages", // Package collection
                    localField: "packageId", // Ensure this field exists in ProfileModel
                    foreignField: "_id",
                    as: "packageDetails",
                },
            },
            {
                $unwind: {
                    path: "$packageDetails",
                    preserveNullAndEmptyArrays: true,
                },
            }, // Flatten packageDetails array, allow empty
            {
                // Match filters
                $match: {
                    ...(profileFilters.category && {
                        "category._id": new mongoose.Types.ObjectId(profileFilters.category),
                    }),
                    ...(role && { "userDetails.roleType": role }),
                    ...(status && { "paymentDetails.status": status }),
                },
            },
            {
              $group: {
                  _id: "$userId",
                  name: { $first: "$userDetails.name" },
                  email: { $first: "$userDetails.email" },
                  roleType: { $first: "$userDetails.roleType" },
                  mobileNumber: { $first: "$userDetails.mobileNumber" },
                  credits: { $first: "$userDetails.credits" },
                  joinedAt: { $first: "$userDetails.joinedAt" },
                  categoryName: { $first: "$category.name" },
                  paymentStatuses: { $push: "$paymentDetails.status" },
                  packageNames: { $push: "$packageDetails.name" }
              }
          }          
        ]);

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            error: "Error fetching users",
            message: error.message,
        });
    }
}

  // get users by userId
  async getByUserId(req, res) {
    try {
      const { userId } = req.params;

      // Query the ProfileModel by userId
      const profiles = await ProfileModel.find({ userId })
        .populate(["userId", "category", "subcategory"]) // Populate user data
        // Populate subcategory data
        .exec();

      if (!profiles.length) {
        // If no profiles are found, query the users collection
        const users = await UserModel.findById(userId).exec();

        if (!users) {
          return res
            .status(404)
            .json({ message: "No Data found for this user." });
        }

        return res.status(200).json({ fallback: true, user: users });
      }

      // Return profile data
      res.status(200).json({ fallback: false, profiles });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error fetching user data", message: error.message });
    }
  }
}

export default new GetUserProfileVerification();