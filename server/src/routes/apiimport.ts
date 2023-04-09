import express from "express"
import { importFiles} from "../getFiles"
import {readCatalog, writeCatalog} from "../catalogJSON"

const router = express.Router();

router .get("/", (req, res) => {
    importFiles()
    
   .then( (files) => {
       writeCatalog( files);
       res.send(JSON.stringify( files,null,"\t" ));
       res.end();
   })
   })  

module.exports = router;
