import express from "express";
import dotenv from "dotenv";
import * as requestHelper from "../../utility/requestHelper";
dotenv.config();
const QUESTION_SERVICE = `http://${process.env.QUESTION_SERVICE_ROUTE}:${process.env.QUESTION_SERVICE_PORT}/api`;

const router = express.Router();

router.post(
  "/questions",
  requestHelper.sendPostRequest("/questions", QUESTION_SERVICE)
);

router.get(
  "/questions",
  requestHelper.sendGetRequest("/questions", QUESTION_SERVICE)
);

router.get("/questions/:id", async (req, res) => {
  const id = req.params["id"];
  return requestHelper.sendGetRequest(
    "/questions",
    QUESTION_SERVICE,
    id
  )(req, res);
});

router.put("/questions/:id", async (req, res) => {
  const id = req.params["id"];
  return requestHelper.sendPutRequest(
    "/questions",
    QUESTION_SERVICE,
    id
  )(req, res);
});

router.delete("/questions/:id", async (req, res) => {
  const id = req.params["id"];
  return requestHelper.sendDeleteRequest(
    "/questions",
    QUESTION_SERVICE,
    id
  )(req, res);
});
export default router;
