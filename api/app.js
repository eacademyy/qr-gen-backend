const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const serverless = require('serverless-http');
const userRouter = require('../Route/UserRoute');
require('dotenv').config();
require('../db');

const app = express();

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use('/userapi', userRouter);

// ⚠️ No app.listen() — Vercel handles it
module.exports = app;
module.exports.handler = serverless(app);
