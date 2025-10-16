import { Router } from 'express';
import { MentorRequestController } from '../controllers/mentorRequest.controller';
import { verifyToken } from '../middleware/verifyToken';

const router = Router();

// List and create
router.get('/', verifyToken, (req, res, next) => {
	MentorRequestController.list(req, res).catch(next);
});
router.post('/', verifyToken, (req, res, next) => {
	MentorRequestController.create(req, res).catch(next);
});

// Single item and status change
router.get('/:id', verifyToken, (req, res, next) => {
	MentorRequestController.get(req, res).catch(next);
});
router.patch('/:id/status', verifyToken, (req, res, next) => {
	MentorRequestController.changeStatus(req, res).catch(next);
});

export default router;
