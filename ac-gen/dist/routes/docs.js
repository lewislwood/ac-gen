"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const docs_urls_1 = require("../docs-urls");
require("dotenv/config");
const ejs = require("ejs");
const port = process.env.PORT || 3005;
const serverURL = "http://localhost:" + port.toString().padEnd(4, "0") + "/";
const router = express_1.default.Router();
router.get(/^\/developer/, (req, res, next) => {
    const { save } = req.query;
    docs_urls_1.URLs.action = (["yes", "true"].includes((save) ? save.toLowerCase() : "false")) ? "html" : "server";
    const u = (0, docs_urls_1.navURLs)("docs_developer", docs_urls_1.URLs);
    (0, docs_urls_1.docsRender)(res, "docs_developer", u);
});
router.get(/^\/save/, (req, res, next) => {
    const { save } = req.query;
    const u = (0, docs_urls_1.navURLs)("docs_about", docs_urls_1.URLs);
    docs_urls_1.URLs.action = (["yes", "true"].includes((save) ? save.toLowerCase() : "false")) ? "html" : "server";
    if (docs_urls_1.URLs.action === "server") {
        res.render("pages/docs_save.ejs", Object.assign({ files: [""] }, u));
    }
    else {
        (0, docs_urls_1.docsRenderAll)(res);
    }
});
router.get(/^\/about/, (req, res, next) => {
    const { save } = req.query;
    docs_urls_1.URLs.action = (["yes", "true"].includes((save) ? save.toLowerCase() : "false")) ? "html" : "server";
    const u = (0, docs_urls_1.navURLs)("docs_about", docs_urls_1.URLs);
    (0, docs_urls_1.docsRender)(res, "docs_about", u);
});
router.get(/^\/instructions/, (req, res, next) => {
    const { save } = req.query;
    docs_urls_1.URLs.action = (["yes", "true"].includes((save) ? save.toLowerCase() : "false")) ? "html" : "server";
    const u = (0, docs_urls_1.navURLs)("docs_instructions", docs_urls_1.URLs);
    (0, docs_urls_1.docsRender)(res, "docs_instructions", Object.assign(Object.assign({}, u), { serverURL: serverURL }));
});
router.get(/^\/download/, (req, res, next) => {
    const { save } = req.query;
    docs_urls_1.URLs.action = (["yes", "true"].includes((save) ? save.toLowerCase() : "false")) ? "html" : "server";
    const u = (0, docs_urls_1.navURLs)("docs_download", docs_urls_1.URLs);
    (0, docs_urls_1.docsRender)(res, "docs_download", Object.assign(Object.assign({}, u), { serverURL: serverURL }));
});
router.get(/^\/index/, (req, res, next) => {
    const { save } = req.query;
    docs_urls_1.URLs.action = (["yes", "true"].includes((save) ? save.toLowerCase() : "false")) ? "html" : "server";
    const u = (0, docs_urls_1.navURLs)("docs_index", docs_urls_1.URLs);
    (0, docs_urls_1.docsRender)(res, "docs_index", Object.assign(Object.assign({}, u), { serverURL: serverURL }));
});
router.use("/", (req, res, next) => {
    res.redirect("/docs/index.html");
});
module.exports = router;
//# sourceMappingURL=docs.js.map