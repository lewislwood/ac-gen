import express from "express"
import {URLs, navURLs, saveDocFile, docsRender, docsRenderAll} from "../docs-urls";
import 'dotenv/config';

const ejs = require("ejs");

const port = process.env.PORT || 3005; 
const serverURL = "http://localhost:" + port.toString().padEnd(4,"0") + "/";


const router = express.Router();

type ReqDictionary = {}
type ReqBody = { save?: string }
type ReqQuery = { save?: string }

router.get(/^\/developer/, (req, res,next) => {
    const { save}:ReqQuery   =  req.query;
    URLs.action = (["yes", "true"].includes ((save) ? save.toLowerCase() : "false")) ? "html" : "server";        
    const u = navURLs(  "docs_developer", URLs);
    docsRender(res, "docs_developer", u) 
    })        
    router.get(/^\/save/, (req, res,next) => {
        const { save}:ReqQuery   =  req.query;
        const u = navURLs(  "docs_about", URLs);
        URLs.action = (["yes", "true"].includes ((save) ? save.toLowerCase() : "false")) ? "html" : "server";        
        if (URLs.action === "server") {
        res.render("pages/docs_save.ejs",{files:[""],...u});
    } else {
        docsRenderAll(res);
    }
        })    

    router.get(/^\/about/, (req, res,next) => {
        const { save}:ReqQuery   =  req.query;
        URLs.action = (["yes", "true"].includes ((save) ? save.toLowerCase() : "false")) ? "html" : "server";        
        const u = navURLs(  "docs_about", URLs);
        docsRender(res, "docs_about", u) 
        })    

        router.get(/^\/instructions/, (req, res,next) => {
    const { save}:ReqQuery   =  req.query;
    URLs.action = (["yes", "true"].includes ((save) ? save.toLowerCase() : "false")) ? "html" : "server";        
    const u = navURLs(  "docs_instructions", URLs);
    docsRender(res, "docs_instructions", {...u, serverURL : serverURL }) 
    })    

router.get(/^\/download/, (req, res,next) => {
    const { save}:ReqQuery   =  req.query;
    URLs.action = (["yes", "true"].includes ((save) ? save.toLowerCase() : "false")) ? "html" : "server";        
    const u = navURLs(  "docs_download", URLs);
    docsRender(res, "docs_download", {...u, serverURL : serverURL }) 
    })    

router.get(/^\/index/, (req, res,next) => {
    const { save}:ReqQuery   =  req.query;
    URLs.action = (["yes", "true"].includes ((save) ? save.toLowerCase() : "false")) ? "html" : "server";        
const u =     navURLs("docs_index", URLs);
    docsRender(res, "docs_index", { ...u, serverURL : serverURL }) 
})  
router.use("/", (req, res,next) => {

    res.redirect("/docs/index.html" );
})



module.exports = router;
