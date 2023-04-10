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
exports.copyTemplates = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const folders = {
    public: path_1.default.resolve(__dirname, "..", "..", "client", "public"),
    media: path_1.default.resolve(__dirname, "..", "..", "client", "public", process.env.MEDIA_FOLDER),
    templates: path_1.default.resolve(__dirname, "..", "..", "client", "public", "templates")
};
const templates = {
    initialized: false,
    mediaTypes: [],
    media: "",
    info: "",
    post: ""
};
function initTemplateDefault(mode) {
    let lines = [''];
    switch (mode) {
        case 'media':
            lines = [
                '# Media Info file.  This file describes the media with the same name. ',
                '# You must copy this template file into media folder and name it the same name as the media file with the .txt extension.',
                '# Media friendly name',
                '[name]=User friendly name',
                '# Custom anchor tag, otherwise one will be genrated from name above.  This way when you share a direct link to this media it has your custom tag (perhaps shorter and more meaningful.',
                '[anchor]=User friendly name',
                '[order]=0',
                '[category]=General, Rock',
                '[length]=2:31',
                '# *****  Ends the tag info section ***',
                '# This is the media description. Each new line will become a paragraph.',
                'Here I tell it as it is. Singing my hear out.',
                'Please give to my foundation you crazy people!!!'
            ];
            break;
        case 'info':
            lines = [
                '#  Catalog info file. Settings and directives to configure catalog',
                '[logo]=',
                '[doc_title]=Browser Doc Title',
                '[cat_title]=Catalog Title',
                "# initial Volume (if soft or loud media) valid numbers 0.1 - 1.0",
                "[volume]=0.4",
                '# Allows users to select categories',
                '[allow_category_filter]=true',
                '# if you only wnat certain categories to be visible',
                '[category_filter]=',
                '        # Menu Link to point to',
                '[menu_link]=http://Helpme.org',
                ',',
                '[menu_text]=Give me blood',
                '# Instructional text prior to media files',
                '[help]=Select media file to play. Next to each play button is the download button.',
                '#  Any text below will be placed in a overviewparagrapgh(s) prior to media cards.',
                '#  html <p> .... </p> will be addded for each paragraph. Paragraphs are new lines.',
                '# You can use html if you are comfortable doing so. ie <strong>, <emp> bold, italic etc.. Even links...',
                'This is a podcast of great ideas and things you would love to use.'
            ];
            break;
        case 'post':
            lines = [
                '#This is the paragraph(s) at the end of the html file#  Simply type in some text or html. ',
                'Check out my repository...',
            ];
    }
    return lines.join("\n");
}
function lwWriteFile(file, output, fileStatus) {
    return __awaiter(this, void 0, void 0, function* () {
        const myPromise = new Promise((resolve, reject) => {
            try {
                if (!(0, fs_1.existsSync)(file)) {
                    (0, fs_1.writeFile)(file, output, (error) => {
                        if (error) {
                            fileStatus.status = "Error writing file: " + file;
                            fileStatus.error = error.message;
                            throw error;
                        }
                        fileStatus.status = "descriptor file created ";
                        resolve(fileStatus.status);
                    });
                }
                else {
                    fileStatus.status = "Already exists";
                    resolve(fileStatus.status);
                }
            }
            catch (error) {
                console.log(fileStatus.status);
                reject(fileStatus.status);
            }
        });
        return myPromise;
    });
}
function initializeTemplates() {
    try {
        if (!templates.initialized) {
            if (!(0, fs_1.existsSync)(folders.templates))
                (0, fs_1.mkdirSync)(folders.templates);
            const catMedia = path_1.default.resolve(folders.templates, "media-info.txt");
            if ((0, fs_1.existsSync)(catMedia))
                templates.media = (0, fs_1.readFileSync)(catMedia).toString().trim();
            if (templates.media.length === 0) {
                templates.media = initTemplateDefault('media');
                lwWriteFile(catMedia, templates.media, { name: "" });
            }
            const catInfo = path_1.default.resolve(folders.templates, "catalog-info.txt");
            if ((0, fs_1.existsSync)(catInfo))
                templates.info = (0, fs_1.readFileSync)(catInfo).toString().trim();
            if (templates.info.length === 0) {
                templates.info = initTemplateDefault('info');
                lwWriteFile(catInfo, templates.info, { name: "" });
            }
            const catPost = path_1.default.resolve(folders.templates, "catalog-post.txt");
            if ((0, fs_1.existsSync)(catPost))
                templates.post = (0, fs_1.readFileSync)(catPost).toString().trim();
            if (templates.post.length === 0) {
                templates.post = initTemplateDefault('post');
                lwWriteFile(catPost, templates.post, { name: "" });
            }
            if (!(0, fs_1.existsSync)(folders.media))
                (0, fs_1.mkdirSync)(folders.media);
            templates.mediaTypes = process.env.media_types.toLowerCase().split(",");
            if (templates.mediaTypes.length === 0)
                templates.mediaTypes.push("mp3");
            templates.initialized = true;
        }
    }
    catch (error) {
        console.log("InitializeTemplates error: ", error.message);
        throw error;
    }
}
function getMediaFilesList() {
    return __awaiter(this, void 0, void 0, function* () {
        const mFS = [];
        try {
            const mTypes = templates.mediaTypes;
            const mItems = (0, fs_1.readdirSync)(folders.media);
            for (const ch of mItems) {
                const ext = path_1.default.extname(ch).toLowerCase().replace(".", "");
                if (mTypes.includes(ext)) {
                    mFS.push({ name: path_1.default.basename(ch, ext) + "txt", media: ch });
                }
            }
        }
        catch (error) {
            console.log("getMediaItems error: ", error.message);
        }
        return mFS;
    });
}
function copyTemplates(res) {
    return __awaiter(this, void 0, void 0, function* () {
        const status = { folder: process.env.MEDIA_FOLDER, catalog: [], mediaFiles: [], status: "" };
        try {
            initializeTemplates();
            status.catalog.push({ name: "catalog-info.txt" });
            status.catalog.push({ name: "catalog-post.txt" });
            status.mediaFiles = yield getMediaFilesList();
            console.log("Beginning to copy templates.... (Media Files:", status.mediaFiles.length, "");
            const myPromises = [];
            for (const m of status.catalog) {
                const out = (m.name === "catalog-info.txt") ? templates.info : templates.post;
                myPromises.push(lwWriteFile(path_1.default.resolve(folders.media, m.name), out, m));
            }
            const out = templates.media;
            for (const m of status.mediaFiles) {
                myPromises.push(lwWriteFile(path_1.default.resolve(folders.media, m.name), out, m));
            }
            status.types = templates.mediaTypes.join(",");
            status.status = status.mediaFiles.length.toString() + " media file(s) found.";
            const xl = yield Promise.all(myPromises);
            // console.log(JSON.stringify(xl,null, "   "));;
            const p = path_1.default.resolve(__dirname, "..", "views", "pages", "templates.ejs");
            res.render(p, Object.assign(Object.assign({}, status), { doc_title: "Templates descriptor Status Summary", cat_title: "Templates Status Summary", logo: "logo.svg", logoAlt: "Your logo goes here .." }));
        }
        catch (error) {
            console.log("copyTemplates error: ", error.message);
        }
    });
}
exports.copyTemplates = copyTemplates;
module.exports = { copyTemplates };
//# sourceMappingURL=creatTemplates.js.map