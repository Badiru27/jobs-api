require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();


//connectDB
const connectDB = require('./db/connect');

const authenticateUser = require('.//middleware/authentication')
//routes
const jobRoute = require('./routes/job');
const authRoute = require('./routes/auth');

//error handlers
const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');

app.use(express.json());



app.use('/api/v1/auth', authRoute);
app.use('/api/v1/job', authenticateUser, jobRoute);


app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => { console.log(`Server running on ${port}....`) });
    } catch (error) {
        console.log(error)
    }
};

 
start();









