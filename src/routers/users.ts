import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import 'dotenv/config'
import ApiError from '../errors/ApiError'
import User from '../models/user'
import { validateUser } from '../middlewares/validateUser'
import { generateActivationToken, sendActivationEmail } from '../util/email'
import { checkAuth } from '../middlewares/checkAuth'
import { DecodedUser } from '../types/types'
import { checkRole } from '../middlewares/checkRole'

const router = express.Router()
console.log(crypto.randomBytes(64).toString('hex'))
// get user by ID
router.get('/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId).populate('order')
    if (!user) {
      next(ApiError.badRequest('User not found'))
      return
    }
    res.json(user)
  } catch (error) {
    next(ApiError.internal('Internal server error'))
  }
})

router.get('/activateUser/:activationToken', async (req, res, next) => {
  const activationToken = req.params.activationToken
  const user = await User.findOne({ activationToken })

  if (!user) {
    next(ApiError.badRequest('Invalid activation token'))
    return
  }

  user.isActive = true
  user.activationToken = undefined

  await user.save()

  res.status(200).json({
    msg: 'Account activated successfully',
  })
})

router.get('/', checkAuth('ADMIN'), async (req, res, next) => {
  const users = await User.find().populate('order')
  res.json({
    users,
  })
})

router.put('/:userId', checkAuth('ADMIN'), async (req, res, next) => {
  const userId = req.params.userId
  const { firstName, lastName, avatar, role } = req.body
  try {
    const updatedUser = await User.updateOne(
      {
        _id: userId,
      },
      {
        $set: {
          firstName,
          lastName,
          avatar,
          role,
        },
      }
    )
    if (updatedUser.modifiedCount > 0) {
      res.json({
        firstName,
        lastName,
        avatar,
        role,
        msg: 'user updated successfully',
        updatedUser,
      })
    } else {
      next(ApiError.badRequest('No changes were made'))
      return
    }
  } catch (error) {
    next(ApiError.badRequest('User not found'))
    return
  }
})
router.post('/register', validateUser, async (req, res, next) => {
  const { email, password } = req.validatedUser
  const { firstName, lastName, avatar, order } = req.body

  try {
    const userExists = await User.findOne({ email })
    if (userExists) {
      return next(ApiError.badRequest('Email already registered'))
    }

    const activationToken = generateActivationToken()
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      firstName,
      lastName,
      avatar,
      email,
      order,
      password: hashedPassword,
      activationToken,
    })
    await newUser.save()

    await sendActivationEmail(email, activationToken)

    res.json({
      msg: 'User registered. Check your email to activate your account!',
      user: newUser,
    })
  } catch (error) {
    console.log('error:', error)
    next(ApiError.badRequest('Something went wrong'))
  }
})

router.post('/login', validateUser, async (req, res, next) => {
  const { email, password } = req.validatedUser
  const user = await User.findOne({ email })

  // we moved this check to be after comparing to avoid timing attack
  if (!user || !user.isActive) {
    next(ApiError.badRequest('Invalid email or account not activated'))
    return
  }
  const isPassValid = await bcrypt.compare(password, user.password)

  if (!isPassValid) {
    next(ApiError.badRequest('Invalid email or password'))
    return
  }

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.TOKEN_SECRET as string,
    {
      expiresIn: '24h',
      algorithm: 'HS256',
    }
  )

  res.status(200).json({ msg: 'Login successful', token })
})
router.delete('/:userId', checkAuth('ADMIN'), async (req, res, next) => {
  try {
    const userId = req.params.userId
    const user = await User.findByIdAndDelete(userId).populate('order')
    if (!user) {
      next(ApiError.badRequest('User not found'))
      return
    }
    res.json({
      user,
      msg: 'User deleted successfully',
    })
  } catch (error) {
    next(ApiError.internal('internal server error'))
    return
  }
})

export default router
