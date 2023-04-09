import express from "express"
import ejs from "ejs";
import path from 'path'
import 'dotenv/config';
import {readCatalog, writeCatalog} from "../catalogJSON"
import { writeFileSync} from 'fs'

type ReqDictionary = {}
type ReqBody = { save?: string }
type ReqQuery = { save?: string }
// type ResBody = { foo3 ?: string }


const router = express.Router();

router.get("/", (req, res) => {
    const cat = readCatalog();

    const port = process.env.PORT || 5000; 
    const htmlFile = process.env.MEDIA_HTML || "index.html";
    const saveUrl:string = "http://" +  req.hostname+ ":" + port + req.originalUrl + "?save=true";
const { save}:ReqQuery   =  req.query;
   
const saveFile: boolean= ["true","yes"].includes((save) ? save.toLowerCase() : "false");
const mFolder = process.env.MEDIA_FOLDER;


if (saveFile) {
const verify = "http://"+ req.hostname + ":" + port + "/" + htmlFile; 

ejs.renderFile("views/pages/index.ejs", {mediaFolder: mFolder, ...cat, save: false, saveURL: saveUrl, htmlFile: htmlFile, verifyURL: verify , showStatus: false},{ cache: false}, function(error, str) {

    if (error) {
        res.send( error.message);
    } else {
        // saveHTML(str);
        
        const f = path.resolve(__dirname, "..","..","..","client", "public", htmlFile)
        console.log(f);
writeFileSync(f,str);
        ejs.renderFile("views/pages/index.ejs", {mediaFolder: mFolder, ...cat, save: saveFile, saveURL: saveUrl, htmlFile: htmlFile, verifyURL: verify , showStatus: true},{ cache: false}, function(error, str) {

            if (error) {
                res.send( error.message);
            } else {
                res.send(str);
        
        }
        });
        

}
});

} else {
const verify = "http://"+ req.hostname + ":" + port + "/" + htmlFile; 
ejs.renderFile("views/pages/index.ejs", { mediaFolder: mFolder, ...cat, save: saveFile, saveURL: saveUrl, htmlFile: htmlFile, verifyURL: verify , showStatus: true},{ cache: false}, function(error, str) {

    if (error) {
        res.send( error.message);
    } else {
        res.send(str);

}
});
            }
    } )

    // res.render("pages/index", cat)




module.exports = router;
