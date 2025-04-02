import express from 'express';
import {getAllClient, getSingleClient}  from '../controller/client.js';
const router = express.Router();


// get all clients
router.get('/all',getAllClient);

// get client by id
router.get('/:id',getSingleClient);


export default router;