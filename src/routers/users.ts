import express from 'express'
import 'dotenv/config'

import { validateUser } from '../middlewares/validateUser'
import { checkAuth } from '../middlewares/checkAuth'
import { activateAccount, createUser, deletrUser, getAllUsers, getSingleUser, login, updateUser } from '../controller/usersController'

const router = express.Router()

// Get all users
router.get('/', checkAuth('ADMIN'), getAllUsers)

// get user by ID
router.get('/:userId', checkAuth('ADMIN'), getSingleUser)

router.get('/activateUser/:activationToken', activateAccount)

router.put('/:userId', checkAuth('ADMIN'), updateUser)

router.post('/register', validateUser, createUser)

router.post('/login', validateUser, login)

router.delete('/:userId', checkAuth('ADMIN'), deletrUser)

export default router
