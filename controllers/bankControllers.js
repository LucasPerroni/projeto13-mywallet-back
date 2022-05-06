import dayjs from "dayjs"
import { ObjectId } from "mongodb"

import db from "./../db.js"

export async function getBank(req, res) {
  const { user } = res.locals

  try {
    // get bank history
    const history = await db.collection("bank").find({ userId: user._id }).toArray()
    history.forEach((h) => delete h.userId) // delete userId before sending to front

    res.send(history)
  } catch (e) {
    res.sendStatus(500)
  }
}

export async function postBank(req, res) {
  const { user } = res.locals

  try {
    await db.collection("bank").insertOne({
      ...req.body,
      date: dayjs().format("DD/MM"),
      userId: user._id,
    })

    res.sendStatus(201)
  } catch (e) {
    res.sendStatus(500)
  }
}

export async function deleteBank(req, res) {
  const { user } = res.locals
  const { id } = req.params

  try {
    // validate if user id is the same of the transaction
    const transaction = await db.collection("bank").findOne({ _id: new ObjectId(id) })
    if (transaction.userId.toString() !== user._id.toString()) {
      return res.sendStatus(401)
    }

    // delete transaction
    await db.collection("bank").deleteOne(transaction)
    res.sendStatus(200)
  } catch (e) {
    res.sendStatus(500)
  }
}

export async function updateBank(req, res) {
  const { user } = res.locals
  const { id } = req.params

  try {
    // validate if user id is the same of the transaction
    const transaction = await db.collection("bank").findOne({ _id: new ObjectId(id) })
    if (transaction.userId.toString() !== user._id.toString()) {
      return res.sendStatus(401)
    }

    // update transaction
    await db.collection("bank").updateOne(transaction, { $set: req.body })
    res.sendStatus(200)
  } catch (e) {
    res.sendStatus(500)
  }
}
