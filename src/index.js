import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRounters from "./routes/web";
import connectDB from "./config/connectDB";
import cors from "cors";
import "dotenv/config";

let app = express();

app.use(cors({ credentials: true, origin: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRounters(app);

connectDB();

let port = process.env.PORT || 1000; // if PORT = null => port = 1000

app.listen(port, () => {
  console.log("http://localhost:" + port);
});
``;
