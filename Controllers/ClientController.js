const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const clientModel = require("../Model/client");
const { sendMailNodemailer } = require("../Mail/SendMail");
app.use(cookieParser());

// clinetSchema crud

// createClient
const createClient = async (req, res) => {
  try {
    const { client_id, image, mobileNumber, govt_id_proof, govt_id_number } =
      req.body;

    const newClient = new clientModel({
      client_id,
      image,
      mobileNumber,
      govt_id_proof,
      govt_id_number,
    });
    await newClient.save();
    //  console.log(newClient);
    res
      .status(201)
      .json({
        success: true,
        message: "Client added successfully",
        data: newClient,
      });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error adding client",
        error: err.message,
      });
  }
};

// get all client
const getAllClient = async (req, res) => {
  try {
    const clients = await clientModel.find();
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

// get single clinet

const getSingleClinet = async (req, res) => {
  try {
    const client = await clientModel.findById(req.params.id);
    if (!client)
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    res.status(200).json({ success: true, data: client });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching client",
        error: err.message,
      });
  }
};

// update clinet

const updateClinet = async (req, res) => {
  try {
    const updatedClient = await clientModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedClient)
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    res
      .status(200)
      .json({
        success: true,
        message: "Client updated successfully",
        data: updatedClient,
      });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error updating client",
        error: err.message,
      });
  }
};

// delete client

const deleteClient = async (req, res) => {
  try {
    const deletedClient = await clientModel.findByIdAndDelete(req.params.id);
    if (!deletedClient)
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    res
      .status(200)
      .json({ success: true, message: "Client deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error deleting client",
        error: err.message,
      });
  }
};

module.exports = {
  createClient,
  getAllClient,
  getSingleClinet,
  updateClinet,
  deleteClient,
};
