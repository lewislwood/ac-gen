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
exports.docsRenderAll = exports.docsRender = exports.saveDocFile = exports.navURLs = exports.URLs = exports.newURLs = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const docsFolder = path_1.default.resolve(__dirname, "..", "docs");
const ejs = require("ejs");
const newURLs = () => {
    return {
        "action": "server",
        "docs": ["docs_index", "docs_download", "docs_instructions", "docs_about"],
        "previous": "",
        "next": "",
        "current": "",
        "docs_about": "/docs/about.html",
        "docs_instructions": "/docs/instructions.html",
        "docs_download": "",
        "docs_index": "/docs/index.html",
        "docs_developer": "/docs/developer.html",
        "import": "/api/import",
        "html": "/make-html",
        "git": "https://git-scm.com/downloads",
        "nodejs": "https://nodejs.org/en/",
        "website": "http://blindheroes.org",
        "repo": "http://github.com/lewislwood",
        "zip": "https://codeload.github.com/lewislwood/audio-catalog/zip/refs/heads/master"
    };
};
exports.newURLs = newURLs;
exports.URLs = (0, exports.newURLs)();
function navURLs(current, myURLs) {
    const i = myURLs.docs.indexOf(current);
    let tk = myKey(current), vk;
    myURLs.current = (myURLs[tk]);
    if (i > 0) {
        tk = myKey(myURLs.docs[i - 1]);
        vk = myURLs[tk];
        myURLs.previous = vk;
    }
    else {
        myURLs.previous = "";
    }
    if (i < (myURLs.docs.length - 1) && (i >= 0)) {
        tk = myKey(myURLs.docs[i + 1]);
        vk = myURLs[tk];
        myURLs.next = vk;
    }
    else {
        myURLs.next = "";
    }
    // Modify url for local html versions
    if (myURLs.action === "html") {
        myURLs.docs.forEach((k) => {
            const tk = k;
            myURLs[tk] = makeLocalHTML(myURLs[tk]);
        });
        myURLs.previous = makeLocalHTML(myURLs.previous);
        myURLs.next = makeLocalHTML(myURLs.next);
        myURLs.current = makeLocalHTML(myURLs.current);
        myURLs["docs_developer"] = makeLocalHTML(myURLs["docs_developer"]);
    }
    return myURLs;
}
exports.navURLs = navURLs;
const myKey = (value) => {
    return value;
};
const makeLocalHTML = (file) => {
    const h = file;
    return h.replace(/^\/docs\//i, "");
};
const saveDocFile = (docFile, output) => {
    const fileName = path_1.default.resolve(docsFolder, docFile);
    console.log("full file Name: ", fileName);
    try {
        if (!(0, fs_1.existsSync)(docsFolder)) {
            (0, fs_1.mkdirSync)(docsFolder);
            console.log("Created /docs folder:", docsFolder);
        }
        (0, fs_1.writeFileSync)(fileName, output);
    }
    catch (error) {
        console.log("saveDocFile error: ", error.message);
    }
    return fileName;
};
exports.saveDocFile = saveDocFile;
function docsRender(res, page, URLs, renderSave = true) {
    return __awaiter(this, void 0, void 0, function* () {
        let output = ""; // render string
        try {
            // Generate the render string
            if (URLs.action === "server") {
                res.render("pages/" + page + ".ejs", URLs);
            }
            else {
                const p = path_1.default.resolve(__dirname, "..", "views", "pages", page + ".ejs");
                yield ejs.renderFile(p, URLs, { cache: false }, function (error, str) {
                    if (error) {
                        throw error;
                    }
                    ;
                    // set output equal to saved file
                    output = (0, exports.saveDocFile)(URLs.current, str);
                    // Now render the Saved Status screen, unless multiple calling for save all
                    if (renderSave) {
                        const u = (0, exports.newURLs)(), file = [output];
                        const p = path_1.default.resolve(__dirname, "..", "views", "pages", "docs_save.ejs");
                        res.render(p, Object.assign(Object.assign({ files: file }, u), { action: "html" }));
                    }
                });
            }
        }
        catch (error) {
            console.log("docsRender error: ", error.message);
            output = error.message;
        }
        return output;
    });
}
exports.docsRender = docsRender;
function docsRenderAll(res) {
    return __awaiter(this, void 0, void 0, function* () {
        let fileList = [];
        let u = (0, exports.newURLs)();
        const pages = [...u.docs, "docs_developer"];
        for (let i = 0; i < pages.length; i++) {
            const p = pages[i];
            u = (0, exports.newURLs)();
            u.action = "html";
            navURLs(p, u);
            const o = yield docsRender(res, p, Object.assign(Object.assign({}, u), { action: "html" }), false);
            fileList.push(o);
        }
        ;
        const p = path_1.default.resolve(__dirname, "..", "views", "pages", "docs_save.ejs");
        res.render(p, Object.assign(Object.assign({ files: fileList }, u), { action: "html" }));
    });
}
exports.docsRenderAll = docsRenderAll;
module.exports = { URLs: exports.URLs, navURLs, saveDocFile: exports.saveDocFile, newURLs: exports.newURLs, docsRender, docsRenderAll };
//# sourceMappingURL=docs-urls.js.map