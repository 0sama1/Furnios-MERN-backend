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
import { DecodedUser } from '../types'
import { checkRole } from '../middlewares/checkRole'

const router = express.Router()
console.log(crypto.randomBytes(64).toString('hex'))

router.post('/register', validateUser, async (req, res, next) => {
  const { email, password } = req.validatedUser

  try {
    const userExists = await User.findOne({ email })
    if (userExists) {
      return next(ApiError.badRequest('Email already registered'))
    }

    const activationToken = generateActivationToken()
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      email,
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

router.delete('/:userId', checkAuth('ADMIN'), async (req, res) => {
  console.log('👀 ', req.params.userId)
  await User.deleteOne({ _id: req.params.userId })
  res.send()
})

router.get('/', checkAuth('USER'), async (req, res, next) => {
  const users = await User.find()
  res.json({
    users,
  })
})

export default router
