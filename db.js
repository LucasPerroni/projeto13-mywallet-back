import { MongoClient } from "mongodb"
import dotenv from "dotenv"

dotenv.config()

let db
const client = new MongoClient(process.env.MONGO_URI)

try {
  await client.connect()
  db = client.db(process.env.MONGO_DB)
} catch (error) {
  console.log(chalk.bold.redBright("MongoDB connect error"))
}

export default db
