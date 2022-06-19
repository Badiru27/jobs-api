const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        max: 50,
        required: [true, 'Please provide a company name']
    },
    position: {
        type: String,
        required: [true, 'Please provide a position'],
        max: 100
    },
    status: {
        type: String,
        enum: ['interview', 'decline', 'pending'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);