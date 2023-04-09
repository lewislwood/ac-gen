"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTagDesc = void 0;
const fs_1 = require("fs");
//  Reads a tag file with [name]=value tags per line 
//   # lines are comments, remaining lines are description
function readTagDesc(fileName) {
    const tagDesc = { tags: [], description: "" };
    // Read file instantly, since only ran locally
    const buf = (0, fs_1.readFileSync)(fileName);
    if (buf.length > 0) {
        let tags = buf.toString().split("\n");
        let fields = [];
        // eliminate blank lines
        tags.forEach((v) => {
            if ((v.trim().length > 1) && (!v.startsWith("#")))
                fields.push(v.trim());
        });
        tags = []; // Now pull tags out
        let doParse = (fields.length > 1);
        const regEx = /^\[[a-z,_]+\]=/i;
        while (doParse) {
            doParse = regEx.test(fields[0]);
            if (doParse === true) {
                tags.push(fields[0]);
                fields = fields.slice(1);
                doParse = (fields.length > 1);
            }
        }
        tagDesc.description = "<p 'ta-justify'>" + ((fields.length > 1) ? fields.join("</p><p>") : fields[0]) + "</p>";
        // Key value array for tags 
        let tagItems = [];
        for (let i = 0; i < tags.length; i++) {
            const t = tags[i].substr(1).split("]=");
            const ti = { key: t[0], value: t[1] };
            if (ti.value.trim().length > 0)
                tagDesc.tags.push(ti);
        }
    }
    return tagDesc;
}
exports.readTagDesc = readTagDesc;
//# sourceMappingURL=tag-desc.js.map