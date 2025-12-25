import { Router } from "express";
import { getAllUsers, login, register } from "../controllers/userController";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/all', getAllUsers);

export default router;