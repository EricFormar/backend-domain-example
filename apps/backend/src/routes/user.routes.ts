import {Router} from 'express';

import { userController } from 'src/controllers/user.controller';

const router = Router();
const {registerNewUser,getAllUsers, getUserById, updateUser, deleteUser} = userController();
router
    .get('/', getAllUsers)
    .post('/', registerNewUser)
    .get('/:id', getUserById)
    .put('/', updateUser)
    .delete('/', deleteUser);
export default router

