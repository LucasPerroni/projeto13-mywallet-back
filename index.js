import express from "express"
import cors from "cors"
import joi from "joi"
import dotenv from "dotenv"
import chalk from "chalk"
import bcrypt from "bcrypt"
import { MongoClient } from "mongodb"

dotenv.config()

// create express
const app = express()
app.use(express.json())
app.use(cors())

// connect to database
let db
const client = new MongoClient(process.env.MONGO_URI)
const promisse = client.connect()
promisse.then(() => (db = client.db(process.env.MONGO_DB)))
promisse.catch(() => console.log(chalk.bold.redBright("MongoDB connect error")))

// Sign-in
app.post("/signin", async (req, res) => {
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

    // send object with account id
    const data = {
      name: participant.name,
      email: participant.email,
      _id: participant._id,
    }
    res.status(200).send(data)
  } catch (e) {
    res.sendStatus(500)
  }
})

// Sign-up
app.post("/signup", async (req, res) => {
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
})

// port
app.listen(process.env.EXPRESS_PORT, () => console.log(chalk.bold.greenBright("Express running")))
