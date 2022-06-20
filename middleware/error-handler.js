const { StatusCodes } = require('http-status-codes')


const errorHandlerMiddleware = (err, req, res, next) => {

    const customError = {
        statusCode: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'It\'s not your fault. The error is from the server'
    }

    if (err.name === 'ValidationError') {
        console.log(Object.values(err.errors))
        customError.msg = Object.values(err.errors).map((item) => item.message).join(',')
        customError.statusCode= 400;
    }

    if (err.code && err.code === 11000) {
        customError.msg = `Duplicate key entered for ${Object.values(err.keyValue)} field, please choose another value`;
        customError.statusCode = 400;
    }
    if (err.name === 'CastError') {
        customError.msg = `No item found with id: ${err.value}`;
        customError.statusCode = 404;
    }

    return res.status(customError.statusCode).json({ msg: customError.msg });
}
 
module.exports = errorHandlerMiddleware