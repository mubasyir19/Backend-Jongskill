import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validation.middleware';
import { authValidation } from '../validators/auth.schema';

const router = Router();

router.post('/login', validateRequest({ body: authValidation.login }), authController.login);
router.post('/register', authController.register);

export default router;
