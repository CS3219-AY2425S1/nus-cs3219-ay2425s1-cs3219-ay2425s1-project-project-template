import bcrypt from "bcrypt";
import { isValidObjectId } from "mongoose";
import {
  createTempUser as _createTempUser,
  deleteUserById as _deleteUserById,
  findAllUsers as _findAllUsers,
  findUserByEmail as _findUserByEmail,
  findUserById as _findUserById,
  findUserByUsername as _findUserByUsername,
  findUserByUsernameOrEmail as _findUserByUsernameOrEmail,
  updateUserById as _updateUserById,
  confirmUserById as _confirmUserById,
  updateUserPrivilegeById as _updateUserPrivilegeById,
  updateUserAccountCreationTime as _upupdateUserAccountCreationTime,
  sendFriendRequestById as _sendFriendRequestById,
  acceptFriendRequestById as _acceptFriendRequestById,
  addMatchToUserById as _addMatchToUserById,
} from "../model/repository.js";
import jwt from "jsonwebtoken";

const isValidEmail = (email) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

const isValidUsername = (username) =>
  /^[a-zA-Z0-9_-]{2,32}$/.test(username); // 2-32 chars, a-z, A-Z, 0-9, _ or -

const isValidPassword = (password) => password.length >= 8; // At least 8 chars

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function createUserRequest(req, res) {
  try {
    const { username, email, password } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required.",
      });
    }

    // Validate field formats
    if (!isValidUsername(username)) {
      return res.status(400).json({
        message:
          "Username must be 2-32 characters and can contain a-z, A-Z, 0-9, _ or -.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    // Check if the username or email already exists
    const existingUser = await _findUserByUsernameOrEmail(username, email);
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username or email already exists." });
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create the user
    const createdUser = await _createTempUser(username, email, hashedPassword, false);

    // Generate random code for verification
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Generate JWT access token
    const emailToken = jwt.sign(
      { id: createdUser.id, code: verificationCode },
      process.env.JWT_SECRET,
      { expiresIn: "3m" },
    );

    try {
      const info = await transporter.sendMail({
        from: '"PeerPrep" <peerprep38@gmail.com>',
        to: `${email}`, // Double-check this hardcoded email or make it dynamic
        subject: 'Confirm your PeerPrep Account',
        html: `
              <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="text-align: center; color: #6A0CE2;">Confirm Your Account</h2>
              <p style="font-size: 16px;">Hello <span style="color: #6A0CE2; font-weight: bold;">${username}</span>,</p>
              <p style="font-size: 16px;">Thank you for signing up! To complete your registration, please use the following verification code:</p>
              <div style="text-align: center; margin: 20px 0;">
                <span style="font-size: 24px; font-weight: bold; color: #6A0CE2; background-color: #f4f4f4; padding: 10px 20px; border-radius: 5px;">${verificationCode}</span>
              </div>
              <p style="font-size: 16px;">Please enter this code in the verification section to confirm your account.</p>
              <p style="font-size: 14px; color: #777;">If you did not sign up for this account, please disregard this email.</p>
              <hr style="border-top: 1px solid #eee; margin: 20px 0;">
              <p style="font-size: 14px; text-align: center; color: #aaa;">This is an automated message. Please do not reply.</p>
            </div>
              `,
      });
    
      console.log("Message sent: %s", info.messageId); // Logs info when email is successfully sent

      return res.status(201).json({
        message: `Created new user ${username} request successfully`,
        data: {token: emailToken, expiry: new Date(Date.now() + 3 * 60 * 1000)},
      });
    } catch (error) {
      console.error("Error sending email:", error); // Log any errors encountered
      _deleteUserById(createdUser.id);
      return res.status(500).json({
        message: "Unknown error occured when sending out verification email",
      });
    }
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Unknown error occurred when creating a new user!",
    });
  }
}

export async function deleteUserRequest(req, res) {
  try {
    const email = req.params.email;
    if (!isValidEmail(email)) {
      return res.status(404).json({ message: `${email} is not a valid email` });
    }
    const user = await _findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: `User with email: ${email} not found` });
    } else if (user.isConfirm) {
      return res.status(403).json({ message: `This operation is illegal`});
    }
    await _deleteUserById(user.id);
    return res.status(200).json({ message: `Deleted user account creation request of email: ${email} successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when deleting user!" });
  }
}

export async function getUser(req, res) {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    } else {
      return res.status(200).json({ message: `Found user`, data: formatUserResponse(user) });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when getting user!" });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await _findAllUsers();

    return res.status(200).json({ message: `Found users`, data: users.map(formatUserResponse) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when getting all users!" });
  }
}

export async function updateUser(req, res) {
  try {
    const { username, email, password } = req.body;
    if (username || email || password) {
      const userId = req.params.id;
      if (!isValidObjectId(userId)) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }
      const user = await _findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }
      if (username || email) {
        let existingUser = await _findUserByUsername(username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ message: "username already exists" });
        }
        existingUser = await _findUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ message: "email already exists" });
        }
      }

      let hashedPassword;
      if (password) {
        const salt = bcrypt.genSaltSync(10);
        hashedPassword = bcrypt.hashSync(password, salt);
      }
      const updatedUser = await _updateUseconstrById(userId, username, email, hashedPassword);
      return res.status(200).json({
        message: `Updated data for user ${userId}`,
        data: formatUserResponse(updatedUser),
      });
    } else {
      return res.status(400).json({ message: "No field to update: username and email and password are all missing!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when updating user!" });
  }
}

export async function updateUserPrivilege(req, res) {
  try {
    const { isAdmin } = req.body;

    if (isAdmin !== undefined) {  // isAdmin can have boolean value true or false
      const userId = req.params.id;
      if (!isValidObjectId(userId)) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }
      const user = await _findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }

      const updatedUser = await _updateUserPrivilegeById(userId, isAdmin === true);
      return res.status(200).json({
        message: `Updated privilege for user ${userId}`,
        data: formatUserResponse(updatedUser),
      });
    } else {
      return res.status(400).json({ message: "isAdmin is missing!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when updating user privilege!" });
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }
    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    await _deleteUserById(userId);
    return res.status(200).json({ message: `Deleted user ${userId} successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when deleting user!" });
  }
}

export async function getFriends(req, res) {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }
    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    if (user.friends.length === 0) {
      return res.status(200).json({ message: `No friends for user ${userId}` });
    }

    const friends = await Promise.all(user.friends.map(_findUserById));
    return res.status(200).json({ message: `Found friends for user ${userId}`, data: friends.map(formatUserResponse) });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when getting friends!" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }
    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    if (user.friendRequests.length === 0) {
      return res.status(200).json({ message: `No friend requests for user ${userId}` });
    }

    const friendRequests = await Promise.all(user.friendRequests.map(_findUserById));
    return res.status(200).json({ message: `Found friend requests for user ${userId}`, data: friendRequests.map(formatUserResponse) });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when getting friend requests!" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const userId = req.params.id;
    const friendId = req.body.friendId;
    if (!isValidObjectId(userId) || !isValidObjectId(friendId)) {
      return res.status(404).json({ message: `User ${userId} or friend ${friendId} not found` });
    }
    const user = await _findUserById(userId);
    const friend = await _findUserById(friendId);
    if (!user || !friend) {
      return res.status(404).json({ message: `User ${userId} or friend ${friendId} not found` });
    }

    if (user.friends.includes(friendId)) {
      return res.status(409).json({ message: `User ${userId} is already friends with ${friendId}` });
    }

    if (friend.friendRequests.includes(userId)) {
      return res.status(409).json({ message: `User ${userId} already sent friend request to ${friendId}` });
    }

    await _sendFriendRequestById(userId, friendId);

    return res.status(200).json({ message: `Sent friend request from user ${userId} to friend ${friendId}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when adding friend!" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const userId = req.params.id;
    const friendId = req.body.friendId;
    if (!isValidObjectId(userId) || !isValidObjectId(friendId)) {
      return res.status(404).json({ message: `User ${userId} or friend ${friendId} not found` });
    }
    const user = await _findUserById(userId);
    const friend = await _findUserById(friendId);
    if (!user || !friend) {
      return res.status(404).json({ message: `User ${userId} or friend ${friendId} not found` });
    }

    if (!user.friendRequests.includes(friendId)) {
      return res.status(409).json({ message: `User ${userId} has no friend request from ${friendId}` });
    }

    await _acceptFriendRequestById(userId, friendId);

    return res.status(200).json({ message: `Accepted friend request from ${friendId} to user ${userId}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when accepting friend request!" });
  }
}

export async function addMatchToUser(req, res) {
  try {
    const userId = req.params.id;
    const { sessionId, questionId, partnerId } = req.body;
    if (!isValidObjectId(userId) || !isValidObjectId(partnerId)) {
      return res.status(404).json({ message: `User ${userId} or partner ${partnerId} not found` });
    }
    const user = await _findUserById(userId);
    const partner = await _findUserById(partnerId);
    if (!user || !partner) {
      return res.status(404).json({ message: `User ${userId} or partner ${partnerId} not found` });
    }

    await _addMatchToUserById(userId, sessionId, questionId, partnerId);

    return res.status(200).json({ message: `Added match to user ${userId}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when adding match!" });
  }
}

export function formatUserResponse(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    isConfirm: user.isConfirm,
    createdAt: user.createdAt,
  };
}


export async function refreshEmailToken(req, res) {
  try {
    const verifiedUser = req.user;
    const updatedUser = await _upupdateUserAccountCreationTime(verifiedUser.id, Date.now());


    // Generate random code for verification
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Generate JWT access token
    const emailToken = jwt.sign(
      { id: updatedUser.id, code: verificationCode },
      process.env.JWT_SECRET,
      { expiresIn: "3m" },
    );

    try {
      const info = await transporter.sendMail({
        from: '"PeerPrep" <peerprep38@gmail.com>',
        to: `${updatedUser.email}`, // Double-check this hardcoded email or make it dynamic
        subject: 'Confirm your PeerPrep Account',
        html: `
              <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="text-align: center; color: #6A0CE2;">Confirm Your Account</h2>
              <p style="font-size: 16px;">Hello <span style="color: #6A0CE2; font-weight: bold;">${updatedUser.username}</span>,</p>
              <p style="font-size: 16px;">Thank you for signing up! To complete your registration, please use the following verification code:</p>
              <div style="text-align: center; margin: 20px 0;">
                <span style="font-size: 24px; font-weight: bold; color: #6A0CE2; background-color: #f4f4f4; padding: 10px 20px; border-radius: 5px;">${verificationCode}</span>
              </div>
              <p style="font-size: 16px;">Please enter this code in the verification section to confirm your account.</p>
              <p style="font-size: 14px; color: #777;">If you did not sign up for this account, please disregard this email.</p>
              <hr style="border-top: 1px solid #eee; margin: 20px 0;">
              <p style="font-size: 14px; text-align: center; color: #aaa;">This is an automated message. Please do not reply.</p>
            </div>
              `,
      });
    
      console.log("Message sent: %s", info.messageId); // Logs info when email is successfully sent

      return res.status(201).json({
        message: `Token refreshed for new user ${updateUser.username} successfully`,
        data: {token: emailToken, expiry: new Date(Date.now() + 3 * 60 * 1000)},
      });
    } catch (error) {
      console.error("Error sending email:", error); // Log any errors encountered
      _deleteUserById(createdUser.id);
      return res.status(500).json({
        message: "Unknown error occured when sending out verification email",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Unknown error occurred when refreshing token",
    });
  }
}
