const express = require("express");
const router = express.Router();
const app = express()

router.get('/test',(req,res) => res.status(200).send('ok'))