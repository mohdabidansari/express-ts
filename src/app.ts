import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { makeRequest } from "./utils";
import extractJwtToken from "./middleware/extractToken";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      token: string;
    }
  }
}

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello API</h1>");
});
app.get("/test", (req: Request, res: Response) => {
  res.send("<h1>This is test route</h1>");
});

app.post("/", extractJwtToken, async (req: Request, res: Response) => {
  try {
    const result = await makeRequest(req.body.text);
    console.log(result);
    res.json({ response: result.candidates[0].content.parts[0].text });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ error: "There was an error while trying to get response." });
  }
});

app.post("/signup", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  const token = jwt.sign({ username, password }, process.env.SECRET as string, {
    expiresIn: "2 days",
  });
  res.json({ token });
});

app.listen(process.env.PORT, () => {
  console.log(`App running on PORT=${process.env.PORT}`);
});
