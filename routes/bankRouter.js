import { Router } from "express"

import { getBank, postBank, deleteBank, updateBank } from "./../controllers/bankControllers.js"

import { token } from "../middlewares/tokenMiddleware.js"
import { transaction } from "../middlewares/transactionMiddleware.js"

const bankRouter = Router()

bankRouter.get("/bank", token, getBank)
bankRouter.post("/bank", token, transaction, postBank)
bankRouter.delete("/bank/:id", token, deleteBank)
bankRouter.put("/bank/:id", token, transaction, updateBank)

export default bankRouter
