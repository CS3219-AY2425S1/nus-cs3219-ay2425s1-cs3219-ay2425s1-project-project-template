import bcrypt from "bcrypt";
import { isValidObjectId } from "mongoose";
import {
  createUser as _createUser,
  deleteUserById as _deleteUserById,
  findAllUsers as _findAllUsers,
  findUserByEmail as _findUserByEmail,
  findUserById as _findUserById,
  findUserByUsername as _findUserByUsername,
  findUserByUsernameOrEmail as _findUserByUsernameOrEmail,
  addHistoryEntry as _addHistoryEntry,
  updateUserById as _updateUserById,
  updateUserPrivilegeById as _updateUserPrivilegeById,
} from "../model/repository.js";

export async function createUser(req, res) {
  try {
    const { username, email, password, proficiency, displayName } = req.body;
    if (username && email && password) {
      const existingUser = await _findUserByUsernameOrEmail(username, email);
      if (existingUser) {
        return res.status(409).json({ message: "username or email already exists" });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const createdUser = await _createUser(username, email, hashedPassword, proficiency, displayName);
      return res.status(201).json({
        message: `Created new user ${username} successfully`,
        data: formatUserResponse(createdUser),
      });
    } else {
      return res.status(400).json({ message: "username and/or email and/or password are missing" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when creating new user!" });
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

export async function addUserHistory(req, res) {
  try {
    const userId = req.params.id;
    const { sessionId, questionId, questionDescription, language, codeSnippet } = req.body;
    const timestamp = new Date();
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: `Invalid user ID: ${userId}` });
    }
    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }
    if (!sessionId || !questionId || !language || !codeSnippet) {
      return res.status(400).json({ 
        message: `Missing required fields in history entry. Provided: 
        Session Id: ${sessionId}, 
        Question Id: ${questionId},
        Question Title: ${questionDescription}
        Language: ${language},
        codeSnippet: ${codeSnippet}` 
      });
    }
    const historyEntry = {
      sessionId,
      questionId,
      questionDescription,
      language,
      codeSnippet,
      timestamp,
    };
    const updatedUser = await _addHistoryEntry(userId, historyEntry);
    return res.status(200).json({
      message: `Added history entry for user ${userId}`,
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error adding history entry' });
  }
}

export async function updateUser(req, res) {
  try {
    const { username, email, password, proficiency, displayName } = req.body;
    if (username || email || password || proficiency || displayName) {
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

      const updatedUser = await _updateUserById(userId, username, email, hashedPassword, proficiency, displayName);
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

export function formatUserResponse(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    proficiency: user.proficiency,
    displayName: user.displayName,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
    history: user.history
  };
}
