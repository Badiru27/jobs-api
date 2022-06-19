const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');

const createJob = async(req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
};

const getAllJobs = async(req, res) => {
    const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs})
};

const getJob = async(req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;
    const job = await Job.findOne({ createdBy: userId, _id: jobId });
    if (!job) throw new NotFoundError(`No job found with id ${jobId}`);
    res.status(StatusCodes.OK).json({ job });
};
const updateJob = async(req, res) => {
    const { user: { userId }, params: { id: jobId }, body: { company, position } } = req;

    if (company === '' || position === '') throw new BadRequestError('Company and Position fields cannot be empty');

    const job = await Job.findByIdAndUpdate({ createdBy: userId, _id: jobId }, req.body, { new: true, runValidators: true });
    if (!job) throw new NotFoundError(`No job found with id ${jobId}`);
    res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async(req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;

    const job = await Job.findByIdAndRemove({ createdBy: userId, _id: jobId });
    if (!job) throw new NotFoundError(`No job found with id ${jobId}`);
    res.status(StatusCodes.OK).send(`${jobId} deleted successfully`);

};

module.exports = { createJob, getJob, getAllJobs, updateJob, deleteJob };