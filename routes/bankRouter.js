import { Router } from "express"

import { getBank, postBank, deleteBank } from "./../controllers/bankControllers.js"

const bankRouter = Router()

bankRouter.get("/bank", getBank)
bankRouter.post("/bank", postBank)
bankRouter.delete("/bank/:id", deleteBank)

export default bankRouter
