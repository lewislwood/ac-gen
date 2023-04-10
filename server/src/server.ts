import { clear, Console } from "console";
import express from "express"
import 'dotenv/config';
import {readCatalog, writeCatalog} from "./catalogJSON"

const open = require("open");
let launch: boolean = false;
process.argv.forEach((p:string) => {    if (p.toLowerCase() === "--open")        launch = true;});

const launchBrowser =  async  (u:string) =>  { open(u)};

const app = express();
const port = process.env.PORT || 5000; 
app.set("view engine", "ejs");
app.use("/templates", require("./routes/templates"));
app.use("/api/import", require("./routes/apiimport"));
app.use("/make-html", require("./routes/html"));
app.use("/docs", require("./routes/docs"));
// Now serve up static files
app.use(express.static('../client/public'));
app.use("/", require("./routes/404"));

app.listen  (port, () => {
    console.log("Listening on ", port);
    const url: string  = "http://localhost:" + port + "/docs";
    console.log ("Launch your browser and enter " + url);
    if (launch) launchBrowser(url);
})
