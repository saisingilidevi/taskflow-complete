import { Router } from 'express';
import { createTask, getMyTasks, getAllTasks, getTask, updateTask, deleteTask } from './tasks.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize }    from '../../middleware/authorize';

const router = Router();

router.use(authenticate);

router.get('/all', authorize('admin'), getAllTasks);
router.route('/')
  .get(getMyTasks)
  .post(createTask);
router.route('/:id')
  .get(getTask)
  .patch(updateTask)
  .delete(deleteTask);

export default router;
