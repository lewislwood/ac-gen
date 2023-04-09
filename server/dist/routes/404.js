"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.use(function (req, res, next) {
    res.status(404);
    // respond with html page
    if (req.accepts('html')) {
        // res.sendFile("../../public/help.html");
        res.redirect("/docs/index.html");
        return;
    }
    // respond with json
    if (req.accepts('json')) {
        res.json({ error: 'Not found' });
        return;
    }
    // default to plain-text. send()
    res.type('txt').send('Not found');
});
module.exports = router;
//# sourceMappingURL=404.js.map