const express = require('express');
let router = express.Router();
let multer = require('multer');
let FILES_DIR = './public/images';

const testsController = require('../controllers/TestController');

/*const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, FILES_DIR);
	},
	filename: (req, file, cb) => {
		const fileName = file.originalname.toLowerCase().split(' ').join('-');
		cb(null, fileName);
	},
});


const upload = multer({
	storage: storage,
	// limits: {
	// 	fileSize: 1024 * 1024 * 5
	// },
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype == 'image/png' ||
			file.mimetype == 'image/jpg' ||
			file.mimetype == 'image/jpeg' ||
			file.mimetype == 'image/pdf'
		) {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(new Error('Only .png, .jpg, .jpeg and .pdf format allowed!'));
		}
	},
});
*/
router
	// List all tests
	.get('/', (req, res, next) => {
		testsController.getAll(req, res, next);
	})
	// Get pending Tests
	.get('/pendingtests', (req, res, next) => {
		testsController.getPendingTests(req, res, next);
	})

	// Get priority tests
	.get('/prioritytests', (req, res, next) => {
		testsController.getPriorityTests(req, res, next);
	})

	// Get a single test by id
	.get('/:testesId', (req, res, next) => {
		testsController.getById(req, res, next);
	})

	// Get all tests for a userId
	.get('/forUser/:userId', (req, res, next) => {
		testsController.getAllTesteUser(req, res, next);
	})

	// Create a new test
	.post('/', (req, res, next) => {
		testsController.create(req, res, next);
	})

	// Delete a test by id
	.delete('/:testesId', (req, res, next) => {
		testsController.deleteById(req, res, next);
	})

	// Edit a test by id
	.put(
		'/:testesId',
		/*upload.array('pdf', 6)*/ (req, res, next) => {
			testsController.updateById(req, res, next);
		}
	);

module.exports = router;
