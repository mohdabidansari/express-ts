import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
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

app.post("/", extractJwtToken, async (req: Request, res: Response) => {
  try {
    console.log("TOKEN: ", req.token);
    const result = await makeRequest(req.body.text);
    res.json({ response: result.candidates[0].content.parts[0].text });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ error: "There was an error while trying to get response." });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`App running on PORT=${process.env.PORT}`);
});
