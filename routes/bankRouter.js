import { Router } from "express"

import { getBank, postBank } from "./../controllers/bankControllers.js"

const bankRouter = Router()

bankRouter.get("/bank", getBank)
bankRouter.post("/bank", postBank)

export default bankRouter
