import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByUsernameOrEmail as _findUserByUsernameOrEmail,
  findUserById as _findUserById,
  updateUserVerifyStatusById as _updateUserVerifyStatusById,
} from "../model/repository.js";
import { formatFullUserResponse } from "./user-controller.js";

export async function handleLogin(req, res) {
  const { username, email, password } = req.body;

  if (!password || !(username || email)) {
    return res.status(400).json({ message: "Missing username/email or password" });
  } else if (username && email) {
    return res.status(400).json({ message: "Use only one of username or email" });
  }

  try {
    const user = await _findUserByUsernameOrEmail(username, email);
    if (!user) { // check if user exist
      return res.status(401).json({ message: "Wrong username/email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) { // check if password matches account password
      return res.status(401).json({ message: "Wrong username/email or password" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Account is not yet verified. Please check your email for verification link."})
    }

    const accessToken = jwt.sign({
      id: user.id,
    }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: "User logged in",
      data: { accessToken, ...(await formatFullUserResponse(user)) }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function handleVerifyToken(req, res) {
  try {
    const verifiedUser = req.user;
    return res.status(200).json({ message: "Token verified", data: verifiedUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function handleVerifyAccountToken(req, res) {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "'token' field missing"});
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_VERIFICATION);
  } catch (err) {
    return err.name === 'TokenExpiredError'
      ? res.status(401).json({ message: `Expired token`})
      : res.status(403).json({ message: `Invalid token`});
  }

  try {
    const user = await _findUserById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User does not exist"});
    }

    await _updateUserVerifyStatusById(user.id, true);
    return res.status(200).json({
      message: "Successfully verified.",
      username: user.username,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message});
  }
}
