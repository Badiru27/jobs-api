require('dotenv').config();
require('express-async-errors');
const express = require('express');

const app = express();


//connectDB
const connectDB = require('./db/connect');


// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const authenticateUser = require('.//middleware/authentication')
//routes
const jobRoute = require('./routes/job');
const authRoute = require('./routes/auth');

//error handlers
const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');


app.set('trust proxy', 1);
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());


app.get('/', (req, res) => {
    res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});
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









