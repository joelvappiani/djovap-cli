import { Router } from 'express';
import * as userController from './user.controller';
import { UserUpdateSchema, UserCreateSchema, UserDeleteSchema } from './user.schema';
import { validate } from '../middlewares';
const router = Router();

router.get('/all', userController.showAll);
router.post('/', validate(UserCreateSchema), userController.createUser);
router.put('/:id', validate(UserUpdateSchema), userController.updateUser);
router.delete('/:id', validate(UserDeleteSchema), userController.deleteUser);


export default router;