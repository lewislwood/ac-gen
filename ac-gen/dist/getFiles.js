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
exports.searchFiles = exports.importFiles = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const tag_desc_1 = require("./tag-desc");
const catalogJSON_1 = require("./catalogJSON");
const process_1 = __importDefault(require("process"));
const mediaFolder = path_1.default.resolve(__dirname, "..", "..", "client", "public", process_1.default.env.MEDIA_FOLDER);
const media_types = process_1.default.env.media_types.split(",");
// Keyed array of media items with associated files., used to orgaize
let mediaFilesList = {};
let catalog = (0, catalogJSON_1.initCatalog)();
function importFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        catalog = (0, catalogJSON_1.initCatalog)();
        getCatalogInfo();
        mediaFilesList = {};
        const fileList = yield searchFiles(mediaFolder, false, ["mp3", "txt"])
            .then((data) => {
            const mKeys = Object.keys(mediaFilesList).sort();
            for (let i = 0; i < mKeys.length; i++) {
                const mFiles = mediaFilesList[mKeys[i]];
                addMediaItemToList(mFiles, mKeys[i]);
            }
            // writeCatalog(catalog);
            return (0, catalogJSON_1.sortMedia)(catalog);
        });
        return fileList;
        //   return { "name": "Lewis L. Wood", "dir": mediaFolder,
        // "files": files}
    });
}
exports.importFiles = importFiles;
function searchFiles(folderName, recursive = true, extensions) {
    return __awaiter(this, void 0, void 0, function* () {
        const folderChildren = yield fs_1.promises.readdir(folderName);
        console.log("searching....");
        const mPrefix = mediaFolder.length + 1, files = [];
        for (const child of folderChildren) {
            const childPath = path_1.default.resolve(folderName, child);
            const childStats = yield fs_1.promises.lstat(childPath);
            if ((childStats.isDirectory()) && (recursive)) {
                yield searchFiles(childPath, recursive, extensions);
            }
            if (childStats.isFile()) {
                const extension = child.split('.').pop() || '';
                const skipFile = (extensions === null || extensions === void 0 ? void 0 : extensions.length)
                    ? !extensions.includes(extension)
                    : false;
                if (skipFile)
                    continue;
                const fullPathToFile = path_1.default.resolve(childPath);
                addMediaFileToList(childStats, fullPathToFile.substr(mPrefix));
                // paths = [...paths, fullPathToFile]
            }
        }
        return mediaFilesList;
    });
}
exports.searchFiles = searchFiles;
const addMediaFileToList = (fileStats, fileName) => {
    const e = fileName.split(".").pop();
    const mf = {
        name: fileName,
        ext: (e === undefined) ? null : e,
        size: fileStats.size,
        fileDate: fileStats.mtime
    };
    // exclude these catalog files special
    const ex = ['catalog-info.txt', 'catalog-post.txt'];
    if (ex.includes(mf.name.toLowerCase())) {
        return;
    }
    const key = (e === undefined) ? mf.name : mf.name.replace("." + e, "");
    let fileList = mediaFilesList[key];
    if (fileList === undefined) {
        fileList = [mf];
    }
    else {
        fileList.push(mf);
    }
    mediaFilesList[key] = fileList;
};
// Add media item to a list 
const addMediaItemToList = (files, keyName) => {
    let mp3 = null, txt = null;
    for (let i = 0; i < files.length; i++) {
        const m = files[i];
        if (m.ext === "mp3") {
            mp3 = m;
        }
        else {
            txt = m;
        }
    }
    // Handle media description File if it has one.
    const md = (txt != null) ? readMediaDesc(txt) : { order: -1, category: "General", description: "No Description provided" };
    try {
        if (mp3 === null)
            return;
        const mI = {
            file: mp3.name,
            name: (md.name === undefined) ? keyName : md.name,
            length: (md.length === undefined) ? null : md.length,
            type: (mp3.ext === null) ? "mp3" : mp3.ext,
            size: mp3.size,
            Modified: mp3 === null || mp3 === void 0 ? void 0 : mp3.fileDate,
            order: md.order,
            category: md.category,
            description: md.description
        };
        catalog.mediaList.push(mI);
    }
    catch (error) {
        console.log("Media Description Error: ", error.message);
    }
};
// Reads and translates txt description into its components
const readMediaDesc = (file) => {
    let ord = catalog.mediaList.length, cat = "General", desc = "";
    const md = {
        order: ord,
        category: cat,
        description: file.name
    };
    const tagDesc = (0, tag_desc_1.readTagDesc)(path_1.default.resolve(mediaFolder, file.name));
    md.description = tagDesc.description;
    tagDesc.tags.forEach((ti) => {
        switch (ti.key) {
            case "name":
                md.name = ti.value;
                break;
            case "anchor":
                md.anchor = ti.value;
                break;
            case "order":
                md.order = parseInt(ti.value);
                break;
            case "category":
                md.category = ti.value;
                break;
            case "length":
                md.length = ti.value;
                break;
            default:
                console.log(file.name, ": Key: ", ti.key, "not found for tag Item");
        }
    });
    return md;
};
// getCatalog Info to describe and control HTML generation later.
function getCatalogInfo() {
    const infoFile = path_1.default.resolve(mediaFolder, "catalog-info.txt");
    const postFile = path_1.default.resolve(mediaFolder, "catalog-post.txt");
    try {
        if ((0, fs_1.existsSync)(infoFile)) {
            const tagDesc = (0, tag_desc_1.readTagDesc)(infoFile);
            catalog.overview = tagDesc.description;
            tagDesc.tags.forEach((ti) => {
                const k = ti.key.trim().toLowerCase().replace(/\_/g, "");
                switch (k) {
                    case "logo":
                        catalog.logo = ti.value;
                        break;
                    case "doctitle":
                        catalog.doc_title = ti.value;
                        break;
                    case "cattitle":
                        catalog.cat_title = ti.value;
                        break;
                    case "volume":
                        catalog.volume = parseFloat(ti.value);
                        break;
                    case "allowcategoryfilter":
                        catalog.allow_category_filter = (ti.value.toLowerCase() === "true");
                        break;
                    case "categoryfilter":
                        catalog.category_filter = ti.value;
                        break;
                    case "menulink":
                        catalog.menu_link = ti.value;
                        break;
                    case "menutext":
                        catalog.menu_text = ti.value;
                        break;
                    case "help":
                        catalog.help = ti.value;
                        break;
                    default:
                        console.log("Catalog-info invalid tag: ", ti.key);
                }
            });
        }
    }
    catch (error) {
        console.log("getCatalogInfo error: ", error.message);
    }
    try {
        if ((0, fs_1.existsSync)(postFile)) {
            const tagDesc = (0, tag_desc_1.readTagDesc)(postFile);
            catalog.post_description = tagDesc.description;
        }
    }
    catch (error) {
        console.log("getCatalogInfo-post error: ", error.message);
    }
}
//# sourceMappingURL=getFiles.js.map