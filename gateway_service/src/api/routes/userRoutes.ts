import express from "express";

const router = express.Router();
router.get("", async (req, res) => {
  res.status(200).send("Reached Auth Server");
});
export default router;
