import { Router } from 'express';
import * as homeController from './home.controller'
const router = Router()

router.get('/', homeController.homeMessage)
router.get('/test', homeController.testMessage)

export default router;