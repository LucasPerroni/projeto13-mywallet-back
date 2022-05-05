import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import chalk from "chalk"

import loginRouter from "./routes/loginRouter.js"
import bankRouter from "./routes/bankRouter.js"

dotenv.config()

// create express
const app = express()
app.use(express.json())
app.use(cors())

// Routes
app.use(loginRouter)
app.use(bankRouter)

// port
app.listen(process.env.EXPRESS_PORT, () => console.log(chalk.bold.greenBright("Express running")))
