import { Router } from 'express';
import { listUsers } from '../controllers/userController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', requireAuth, requireRole(['admin', 'hr']), listUsers);

export default router;