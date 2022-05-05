import { Router } from "express"

import { postSignIn, postSignUp } from "./../controllers/loginControllers.js"

const loginRouter = Router()

loginRouter.post("/signin", postSignIn)
loginRouter.post("/signup", postSignUp)

export default loginRouter
