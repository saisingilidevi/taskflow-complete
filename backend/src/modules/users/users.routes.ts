import { Router } from 'express';
import { getMe, listUsers } from './users.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize }    from '../../middleware/authorize';

const router = Router();

router.use(authenticate);
router.get('/me',   getMe);
router.get('/',     authorize('admin'), listUsers);

export default router;
