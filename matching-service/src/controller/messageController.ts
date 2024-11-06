import { Request, Response } from "express";

// Health check
export async function returnPing(req: Request, res: Response) {
  res.status(200).json({ data: "pong" });
}
