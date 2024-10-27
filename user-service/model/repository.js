import UserModel from "./user-model.js";
import "dotenv/config";
import { connect } from "mongoose";

export async function connectToDB() {
  let mongoDBUri = process.env.USER_MONGODB_URI;

  await connect(mongoDBUri);
}

export async function createTempUser(username, email, password, isConfirm=false) {
  return new UserModel({ username, email, password, isConfirm}).save();
}

export async function findUserByEmail(email) {
  return UserModel.findOne({ email });
}

export async function findUserById(userId) {
  return UserModel.findById(userId);
}

export async function findUserByUsername(username) {
  return UserModel.findOne({ username });
}

export async function findUserByUsernameOrEmail(username, email) {
  return UserModel.findOne({
    $or: [
      { username },
      { email },
    ],
  });
}

export async function findAllUsers() {
  return UserModel.find();
}

export async function updateUserById(userId, username, email, password) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        username,
        email,
        password,
      },
    },
    { new: true },  // return the updated user
  );
}

export async function updateUserAccountCreationTime(userId, createdAt) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        createdAt
      },
    },
    { new: true },  // return the updated user
  );
}

export async function confirmUserById(userId, isConfirm) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        isConfirm,
      },
    },
    { new: true },  // return the updated user
  );
}

export async function updateUserPrivilegeById(userId, isAdmin) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        isAdmin,
      },
    },
    { new: true },  // return the updated user
  );
}

export async function deleteUserById(userId) {
  return UserModel.findByIdAndDelete(userId);
}

export async function addMatchToUserById(userId, sessionId, questionId, partnerId) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $push: {
        matchHistory: { sessionId, questionId, partnerId },
      },
    },
    { new: true },  // return the updated user
  );
}

export async function sendFriendRequestById(userId, friendId) {
  return UserModel.findByIdAndUpdate(
    friendId,
    {
      $push: {
        friendRequests: userId,
      },
    },
    { new: true },  // return the updated user
  )
}

export async function acceptFriendRequestById(userId, friendId) {

  await UserModel.findByIdAndUpdate(
    friendId,
    {
      $push: {
        friends: userId,
      },
      $pull: {
        friendRequests: userId,
      }
    },
    { new: true },  // return the updated user
  )

  return UserModel.findByIdAndUpdate(
    userId,
    {
      $push: {
        friends: friendId,
      },
      $pull: {
        friendRequests: friendId,
      },
    },
    { new: true },  // return the updated user
  )
}
