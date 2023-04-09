"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const creatTemplates_1 = require("../creatTemplates");
// type ResBody = { foo3 ?: string }
const router = express_1.default.Router();
router.get("/", (req, res) => {
    const port = process.env.PORT || 3005;
    const { save } = req.query;
    (0, creatTemplates_1.copyTemplates)(res);
});
module.exports = router;
//# sourceMappingURL=templates.js.map