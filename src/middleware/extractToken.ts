import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

const extractJwtToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const tokenParts = authHeader.split(" ");

    if (tokenParts.length === 2 && tokenParts[0].toLowerCase() === "bearer") {
      try {
        jwt.verify(tokenParts[1], process.env.SECRET as string);
      } catch (error) {
        next("Unauthorized");
      }
      req.token = tokenParts[1];
    } else {
      return res.status(401).json({ message: "Invalid token format" });
    }
  } else {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  next();
};

export default extractJwtToken;
