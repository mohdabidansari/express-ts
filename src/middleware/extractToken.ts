import { Request, Response, NextFunction } from "express";

const extractJwtToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const tokenParts = authHeader.split(" ");

    if (tokenParts.length === 2 && tokenParts[0].toLowerCase() === "bearer") {
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
