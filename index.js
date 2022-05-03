import express from "express"
import cors from "cors"
import joi from "joi"
import dotenv from "dotenv"
import chalk from "chalk"
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

app.get("/", (req, res) => {
  res.sendStatus(200)
})

// port
app.listen(process.env.EXPRESS_PORT, () => console.log(chalk.bold.greenBright("Express running")))
