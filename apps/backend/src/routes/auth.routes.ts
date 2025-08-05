import {Router} from 'express';
import { authController } from 'src/controllers/auth.controller';

const router = Router();
const {login} = authController();
router
    .post('/login', login)
export default router