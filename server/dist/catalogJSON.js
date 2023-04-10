"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortMedia = exports.readCatalog = exports.writeCatalog = exports.initCatalog = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const catalogFile = path_1.default.resolve(__dirname, "..", "..", "client", "public", process.env.MEDIA_FOLDER, "catalog.json");
function initCatalog() {
    const cat = {
        application: {
            name: "Audio-Catalog",
            created: new Date(),
            developer: "Lewis Wood",
            website: "http://blindheroes.org",
        },
        allow_category_filter: true,
        overview: "",
        help: "Select the Play button or Download to download the media.",
        logo: "logo.svg",
        logoAlt: "logo for Audio Acatalog",
        volume: 0.4,
        mediaList: []
    };
    return cat;
}
exports.initCatalog = initCatalog;
function writeCatalog(cat) {
    try {
        sortMedia(cat);
        let str = JSON.stringify(cat, null, "  ");
        console.log(str);
        (0, fs_1.writeFileSync)(catalogFile, str);
    }
    catch (error) {
        console.error("Error writing to catalog", error.message);
    }
}
exports.writeCatalog = writeCatalog;
function readCatalog() {
    let cat = initCatalog();
    cat.application.created = null;
    cat.application.created = null;
    try {
        if ((0, fs_1.existsSync)(catalogFile)) {
            let buffer = (0, fs_1.readFileSync)(catalogFile);
            if (buffer.length > 0) {
                // cat = (buffer.toJSON() as unknown) as Catalog;
                const str = buffer.toString();
                const cat = JSON.parse(str);
                if (!cat.logo)
                    cat.logo = "logo.svg";
                return sortMedia(cat);
            }
        }
    }
    catch (error) {
        console.error("Reading catalog: ", error.message);
    }
    return cat;
}
exports.readCatalog = readCatalog;
function sortMedia(cat) {
    const mediaFiles = cat.mediaList;
    cat.mediaList = mediaFiles.sort((a, b) => {
        if (a.order < b.order)
            return -1;
        else if (a.order === b.order)
            return 0;
        else
            return 1;
    });
    cat.mediaList.map((mi) => {
        if (!mi.anchor) {
            const n = mi.name.toLowerCase().split(" ").join("-").substr(0, 30);
            mi.anchor = n;
        }
    });
    return cat;
}
exports.sortMedia = sortMedia;
//# sourceMappingURL=catalogJSON.js.map