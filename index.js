const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser'); 
const AuthRouter = require('./Routes/AuthRouter');
const UserRouter = require ('./Routes/UserRouter');
require('dotenv').config();

require('./Models/db');
app.get('/ping',(req,res) => {
    res.send('PONG');
})

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/user', UserRouter);

const PORT= process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});