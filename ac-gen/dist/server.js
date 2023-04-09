"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const open = require("open");
let launch = false;
process.argv.forEach((p) => { if (p.toLowerCase() === "--open")
    launch = true; });
const launchBrowser = (u) => __awaiter(void 0, void 0, void 0, function* () { open(u); });
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use("/templates", require("./routes/templates"));
app.set("view engine", "ejs");
app.use("/api/import", require("./routes/apiimport"));
app.use("/make-html", require("./routes/html"));
app.use("/docs", require("./routes/docs"));
// Now serve up static files
app.use(express_1.default.static('../client/public'));
app.use("/", require("./routes/404"));
app.listen(port, () => {
    console.log("Listening on ", port);
    const url = "http://localhost:" + port + "/docs";
    console.log("Launch your browser and enter " + url);
    if (launch)
        launchBrowser(url);
});
//# sourceMappingURL=server.js.map