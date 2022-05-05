import dayjs from "dayjs"
import joi from "joi"

import db from "./../db.js"

export async function getBank(req, res) {
  const { authorization } = req.headers

  try {
    // get user using token
    const token = authorization?.replace("Bearer", "").trim()
    if (!token) {
      return res.sendStatus(401)
    }

    const session = await db.collection("sessions").findOne({ token })
    if (!session) {
      return res.sendStatus(401)
    }

    const user = await db.collection("participants").findOne({ _id: session.userId })
    if (!user) {
      return req.sendStatus(401)
    }

    // get bank history
    const history = await db.collection("bank").find({ userId: user._id }).toArray()
    history.forEach((h) => delete h.userId) // delete userId before sending to front

    res.send(history)
  } catch (e) {
    res.sendStatus(500)
  }
}

export async function postBank(req, res) {
  const { authorization } = req.headers

  // validate req.body
  const entrySchema = joi.object({
    type: joi.string().valid("entry", "payment").required(),
    value: joi
      .string()
      .pattern(/^[1-9][0-9]*\.[0-9]{2}$/)
      .required(),
    description: joi.string().required(),
  })
  const validation = entrySchema.validate(req.body, { abortEarly: false })
  if (validation.error) {
    res.status(422).send(validation.error.details.map((e) => e.message))
    return
  }

  try {
    // get user using token
    const token = authorization?.replace("Bearer", "").trim()
    if (!token) {
      return res.sendStatus(401)
    }

    const session = await db.collection("sessions").findOne({ token })
    if (!session) {
      return res.sendStatus(401)
    }

    const user = await db.collection("participants").findOne({ _id: session.userId })
    if (!user) {
      return res.sendStatus(401)
    }

    await db.collection("bank").insertOne({
      ...req.body,
      date: dayjs().format("DD/MM"),
      userId: session.userId,
    })

    res.sendStatus(201)
  } catch (e) {
    res.sendStatus(500)
  }
}
