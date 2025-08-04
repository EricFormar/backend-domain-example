import {Router} from 'express';

import { userController } from 'src/controllers/user.controller';

const router = Router();
const {registerNewUser, getUserProfile, updateUser, deleteUser} = userController();
router
    .post('/register', registerNewUser)
    .get('/profile', getUserProfile)
    .put('/update', updateUser)
    .delete('/delete', deleteUser);
export default router

