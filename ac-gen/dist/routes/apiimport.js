"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getFiles_1 = require("../getFiles");
const catalogJSON_1 = require("../catalogJSON");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    (0, getFiles_1.importFiles)()
        .then((files) => {
        (0, catalogJSON_1.writeCatalog)(files);
        res.send(JSON.stringify(files, null, "\t"));
        res.end();
    });
});
module.exports = router;
//# sourceMappingURL=apiimport.js.map