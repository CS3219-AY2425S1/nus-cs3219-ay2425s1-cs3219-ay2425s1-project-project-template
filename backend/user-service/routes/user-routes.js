import express from "express";

import {
  createUser,
  deleteUser,
  getAllUsers,
  getAllActiveUsers,
  getUser,
  updateUser,
  updateUserPrivilege,
} from "../controller/user-controller.js";
import { verifyAccessToken, verifyIsAdmin, verifyIsOwnerOrAdmin } from "../middleware/basic-access-control.js";

const router = express.Router();

//Get all users
router.get("/", verifyAccessToken, verifyIsAdmin, getAllUsers);

//Get active users only
router.get("/active", verifyAccessToken, verifyIsAdmin, getAllActiveUsers);

router.patch("/:id/privilege", verifyAccessToken, verifyIsAdmin, updateUserPrivilege);

router.post("/", createUser);

router.get("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, getUser);

router.patch("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, updateUser);

//Soft delete
router.delete("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, deleteUser);

//Get public profile (all and id)


//Get questions done (id)

//Save questions (id)




export default router;
