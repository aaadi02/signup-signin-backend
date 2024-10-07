const express = require('express');
const authRouter = require('./router/authRoute');
const databaseConnect = require('./config/databaseConfig');
const app = express();
const cookieParser = require('cookie-parser');

databaseConnect();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth/', authRouter);

app.use('/', (req, res) => {
 res.status(200).json({data: "JWT Auth server"})
});

module.exports = app;