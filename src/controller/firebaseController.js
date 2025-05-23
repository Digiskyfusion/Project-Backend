// Change from CommonJS to ES modules
import NotificationService from "../service/notificationService.js";

export const sendFireBaseNotification = async (req, res) => {
  try {
    const {title, body, deviceToken} = req.body;
    await NotificationService.sendNotification(deviceToken, title, body);
    res.status(200).json({ message: "Notification Sent successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Error sending notification", success: false });
  }
};