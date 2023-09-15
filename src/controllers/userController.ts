import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import User from "../models/UserModel";
import jwt_decode from "jwt-decode";
import { decodedToken, verifyAndDecodeToken } from "../services/token";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "RESTFULAPIs";
const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

export const registerUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email } = req.body;
  const hash_password = bcrypt.hashSync(password, SALT_ROUNDS);

  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    username,
    hash_password,
    email,
  });

  user
    .save()
    .then(() => res.sendStatus(204))
    .catch((error) => {
      error.code === 11000
        ? res.status(401).json({ message: "username or email already exist" })
        : res.status(500).json({ message: "database error" });
    });
};

export const loginUser = (req: Request, res: Response) => {
  const { username, password } = req.body;

  User.findOne({ username: username })
    .then((user) =>
      user && user.comparePassword(password)
        ? res.status(200).json({
            Token: jwt.sign({ email: user.email, _id: user._id }, JWT_SECRET),
          })
        : res.status(404).json({
            message: "Authentication failed. Invalid user or password.",
          })
    )
    .catch(() => res.status(500).json({ message: "database error" }));
};

export const changePassword = (req: Request, res: Response) => {
  const userId = verifyAndDecodeToken(req, res)?._id;
  if (!userId) return;

  const { old_password, new_password } = req.body;
  User.findOne({ _id: userId })
    .then((user) =>
      user && user.comparePassword(old_password)
        ? User.updateOne(
            { _id: userId },
            {
              $set: {
                hash_password: bcrypt.hashSync(new_password, SALT_ROUNDS),
              },
            },
            { new: true }
          )
            .then(() => res.status(200).json({ message: "Password updated" }))
            .catch(() =>
              res
                .status(404)
                .json({ message: "Password change failed. Please retry" })
            )
        : res.status(404).json({
            message: "Invalid password.",
          })
    )
    .catch(() => res.status(500).json({ message: "database error" }));
};

export const personalInformation = (req: Request, res: Response) => {
  const userId = verifyAndDecodeToken(req, res)?._id;
  if (!userId) return;

  User.findOne({ _id: userId })
    .then((user) =>
      res.status(200).json({ username: user.username, email: user.email })
    )
    .catch(() => res.status(500).json({ message: "database error" }));
};
