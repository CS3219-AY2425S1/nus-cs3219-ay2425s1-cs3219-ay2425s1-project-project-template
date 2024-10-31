// models/user.js

import { connectToMongoDB } from "../db"

let usersCollection

async function getUsersCollection() {
  if (!usersCollection) {
    const db = await connectToMongoDB()
    usersCollection = db.collection("users")
  }
  return usersCollection
}

// Add a new user to the MongoDB
async function addUser(user) {
  const collection = await getUsersCollection()
  await collection.insertOne(user)
  console.log(`User ${user.user_id} added to MongoDB`)
}

// Update users' queue status after being matched
async function updateUserStatus(userIds, status) {
  const collection = await getUsersCollection()
  await collection.updateMany({ user_id: { $in: userIds } }, { $set: { queue_status: status } })
  console.log(`Updated queue_status for users: ${userIds}`)
}

// Find all users matching specific criteria (difficulty/topic)
async function findUsersByCriteria(criteria) {
  const collection = await getUsersCollection()
  return await collection.find(criteria).toArray()
}

export { getUsersCollection, addUser, updateUserStatus, findUsersByCriteria }
