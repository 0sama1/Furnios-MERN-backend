import express from 'express'
import 'dotenv/config'

import { validateUser } from '../middlewares/validateUser'
import { checkAuth } from '../middlewares/checkAuth'
import { activateAccount, createUser, deleteUser, getAllUsers, getSingleUser, login, updateUser } from '../controllers/usersController'

const router = express.Router()

// Get all users
router.get('/', checkAuth('ADMIN'), getAllUsers)

// get user by ID
router.get('/:userId', getSingleUser)

router.get('/activateUser/:activationToken', activateAccount)

router.put('/:userId', updateUser)

router.post('/register', validateUser, createUser)

router.post('/login', validateUser, login)

router.delete('/:userId', checkAuth('ADMIN'), deleteUser)

export default router
