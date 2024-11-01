import express from "express";
import {
    create_room,
    get_room_by_user,
    update_heartbeat,
    get_all_rooms_controller
} from "../controller/collab-controller.js";

const router = express.Router();

router.post("/create-room", create_room);

router.get("/user/:user", get_room_by_user);

router.patch("/heartbeat/:roomId", update_heartbeat);

router.get("/rooms", get_all_rooms_controller);

export default router;
