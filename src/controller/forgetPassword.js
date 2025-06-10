import userModel from "../model/user.js"
import randomstring from "randomstring";
import {sendMailNodemailer} from "../config/email.js"


export const forgetPassword = async (req, res) => {
    try {
        let { email } = req.body;
        let user = await userModel.findOne({ email });
      
        
        if (user) {
            let randomString = randomstring.generate();
            let expirationTime = Date.now() + 60 * 60 * 1000;
            await userModel.updateOne({ email }, { $set: { token: randomString ,tokenExpiresAt:new Date(expirationTime) } });
            try {
              // Send email
              await sendMailNodemailer({
                to: email,
                subject: "Welcome to  reset password",
                text: "hello",
                html: `<p>Hi ${user.name},</p>
                <p>Please click the link below to reset your password:</p>
                <a href="https://digisky.ai/resetpassword?token=${randomString}" target="_blank">Reset Password</a>
                <p>If you did not request this, please ignore this email.</p>`,
              });
          
              return res.status(200).json({
                success: true,
                message: "Please check your email inbox to reset your password."
            });
            } catch (error) {
             return res.status(500).json({ message: "Failed to send mail", error });
            }
        } else {
            return res.status(404).json({
                success: false,
                message: "This email does not exist."
            });
        }
    } catch (error) {
        console.log("Error in forgetPassword:", error);
        return res.status(500).send("Error from forgetPassword route.");
    }
};

export const resetPassword = async (req, res) => {
    try {
        const token = req.query.token;
        // console.log(token);
        
        let tokenData = await userModel.findOne({ token });
    //  console.log(tokenData);

        if (tokenData) {
            const { password } = req.body;

            // Hash the new password
            bcrypt.genSalt(10, async (err, salt) => {
                if (err) {
                    return res.status(500).send({ success: false, message: "Error generating salt" });
                }

                // Hash the password
                bcrypt.hash(password, salt, async (err, hash) => {
                    if (err) {
                        return res.status(500).send({ success: false, message: "Error hashing password" });
                    }

                    // Update the user password in the database
                    let updatedUser = await userModel.findByIdAndUpdate(
                         tokenData._id,
                        { $set: { password: hash, token: "" } },
                        { new: true }
                    );

                    // Respond with the updated user data
                    res.status(200).json({
                        success: true,
                        message: "User password has been reset ssuccessfully.",
                        data: updatedUser,
                    });
                });
            });
        } else {
            return res.status(404).send({ success: false, message: "The link has expired or is invalid hihi." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "An error occurred during password reset." });
    }
};