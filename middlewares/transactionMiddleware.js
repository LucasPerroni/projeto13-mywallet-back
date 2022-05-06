import joi from "joi"

export async function transaction(req, res, next) {
  // validate req.body format
  const updateSchema = joi.object({
    type: joi.string().valid("entry", "payment").required(),
    value: joi
      .string()
      .pattern(/^[1-9][0-9]*\.[0-9]{2}$/)
      .required(),
    description: joi.string().required(),
  })
  const validation = updateSchema.validate(req.body, { abortEarly: false })
  if (validation.error) {
    return res.status(422).send(validation.error.details.map((e) => e.message))
  }

  next()
}
