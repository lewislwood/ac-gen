import express from "express"
import ejs from "ejs";
import 'dotenv/config';
import {copyTemplates} from "../creatTemplates";

type ReqDictionary = {}
type ReqBody = { save?: string }
type ReqQuery = { save?: string }
// type ResBody = { foo3 ?: string }


const router = express.Router();

router.get("/", (req, res) => {

    const port = process.env.PORT || 3005; 
const { save}:ReqQuery   =  req.query;
   
copyTemplates(res);

})    




module.exports = router;
