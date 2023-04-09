"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const catalogJSON_1 = require("../catalogJSON");
const fs_1 = require("fs");
// type ResBody = { foo3 ?: string }
const router = express_1.default.Router();
router.get("/", (req, res) => {
    const cat = (0, catalogJSON_1.readCatalog)();
    const port = process.env.PORT || 5000;
    const htmlFile = process.env.MEDIA_HTML || "index.html";
    const saveUrl = "http://" + req.hostname + ":" + port + req.originalUrl + "?save=true";
    const { save } = req.query;
    const saveFile = ["true", "yes"].includes((save) ? save.toLowerCase() : "false");
    const mFolder = process.env.MEDIA_FOLDER;
    if (saveFile) {
        const verify = "http://" + req.hostname + ":" + port + "/" + htmlFile;
        ejs_1.default.renderFile("views/pages/index.ejs", Object.assign(Object.assign({ mediaFolder: mFolder }, cat), { save: false, saveURL: saveUrl, htmlFile: htmlFile, verifyURL: verify, showStatus: false }), { cache: false }, function (error, str) {
            if (error) {
                res.send(error.message);
            }
            else {
                // saveHTML(str);
                const f = path_1.default.resolve(__dirname, "..", "..", "..", "client", "public", htmlFile);
                console.log(f);
                (0, fs_1.writeFileSync)(f, str);
                ejs_1.default.renderFile("views/pages/index.ejs", Object.assign(Object.assign({ mediaFolder: mFolder }, cat), { save: saveFile, saveURL: saveUrl, htmlFile: htmlFile, verifyURL: verify, showStatus: true }), { cache: false }, function (error, str) {
                    if (error) {
                        res.send(error.message);
                    }
                    else {
                        res.send(str);
                    }
                });
            }
        });
    }
    else {
        const verify = "http://" + req.hostname + ":" + port + "/" + htmlFile;
        ejs_1.default.renderFile("views/pages/index.ejs", Object.assign(Object.assign({ mediaFolder: mFolder }, cat), { save: saveFile, saveURL: saveUrl, htmlFile: htmlFile, verifyURL: verify, showStatus: true }), { cache: false }, function (error, str) {
            if (error) {
                res.send(error.message);
            }
            else {
                res.send(str);
            }
        });
    }
});
// res.render("pages/index", cat)
module.exports = router;
//# sourceMappingURL=html.js.map