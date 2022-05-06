import { Router } from "express"

import { getBank, postBank, deleteBank, updateBank } from "./../controllers/bankControllers.js"

const bankRouter = Router()

bankRouter.get("/bank", getBank)
bankRouter.post("/bank", postBank)
bankRouter.delete("/bank/:id", deleteBank)
bankRouter.put("/bank/:id", updateBank)

export default bankRouter
