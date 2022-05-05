import joi from "joi"
import bcrypt from "bcrypt"
import { v4 } from "uuid"

import db from "./../db.js"

export async function postSignIn(req, res) {
  const { email, password } = req.body

  // validate if req.body is correct
  const signinSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  const validation = signinSchema.validate(req.body, { abortEarly: false })
  if (validation.error) {
    res.status(422).send(validation.error.details.map((e) => e.message))
    return
  }

  try {
    // get account by email
    const participant = await db.collection("participants").findOne({ email: email })
    if (!participant) {
      res.sendStatus(404)
      return
    }

    // validate if password is correct
    const valid = bcrypt.compareSync(password, participant.password)
    if (!valid) {
      res.sendStatus(401)
      return
    }

    const token = v4()

    // delete existent session
    const session = await db.collection("sessions").findOne({ userId: participant._id })
    if (session) {
      await db.collection("sessions").deleteOne(session)
    }

    // create new session
    await db.collection("sessions").insertOne({
      userId: participant._id,
      token,
    })

    const data = {
      token,
      name: participant.name,
    }

    res.status(200).send(data)
  } catch (e) {
    res.sendStatus(500)
  }
}

export async function postSignUp(req, res) {
  const { name, email, password } = req.body

  // validate if req.body is correct
  const signinSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  const validation = signinSchema.validate(req.body, { abortEarly: false })
  if (validation.error) {
    res.status(422).send(validation.error.details.map((e) => e.message))
    return
  }

  try {
    // check if email is already in use
    const existentEmail = await db.collection("participants").findOne({ email: req.body.email })
    if (existentEmail) {
      res.sendStatus(409)
      return
    }

    // create new document in collection
    await db.collection("participants").insertOne({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
    })
    res.sendStatus(201)
  } catch (e) {
    res.sendStatus(500)
  }
}
