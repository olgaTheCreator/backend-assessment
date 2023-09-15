import { JwtPayload } from "jwt-decode";
import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";

dotenv.config();

interface Token {
  email: string;
  _id: string;
  iat: number;
}

export type decodedToken = JwtPayload & Token;

const JWT_SECRET = process.env.JWT_SECRET || "RESTFULAPIs";

export const verifyAndDecodeToken = (
  req: Request,
  res: Response
): Token | undefined => {
  if (req.header("authorization") == undefined) {
    res.status(401).json("No credentials");
    return;
  } else {
    const token = req.headers.authorization.split(" ")[1];
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      res.status(401).json("Not authorised");
      return;
    }
    return jwt_decode<decodedToken>(token);
  }
};
