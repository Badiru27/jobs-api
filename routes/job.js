const express = require('express');
const router = express.Router();
const { createJob, getJob, getAllJobs, updateJob, deleteJob } = require('../controllers/job');


router.route('/').get(getAllJobs).post(createJob);
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob);

module.exports = router;