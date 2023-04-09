import { promises as fs, StatOptions, Stats,   existsSync, mkdirSync , writeFileSync} from 'fs'
import path from 'path'
import { stringify } from 'querystring';
const docsFolder = path.resolve(__dirname, "..", "docs");
const ejs = require("ejs");




type acURLs  = {
    action : "server" | "html"
    docs: string[]
      previous: string
      next: string
      current: string
      'docs_about': string
      'docs_instructions': string
      "docs_download": string
      'docs_index': string
      "docs_developer": string
      import: string
      html: string
      git: string
      nodejs: string
      website: string
  repo: string
  zip: string
  serverURL?: string
  }


export const newURLs= ():acURLs  => {

    return {
    "action": "server",
    "docs": ["docs_index", "docs_download", "docs_instructions", "docs_about"],
    "previous":"" ,
    "next": "",
    "current": "",
    "docs_about": "/docs/about.html",
    "docs_instructions": "/docs/instructions.html",
    "docs_download": "",
    "docs_index": "/docs/index.html",
    "docs_developer": "/docs/developer.html",
    "import": "/api/import",
    "html": "/make-html",
    "git": "https://git-scm.com/downloads",
    "nodejs": "https://nodejs.org/en/",
    "website": "http://blindheroes.org",
"repo": "http://github.com/lewislwood",
"zip": "https://codeload.github.com/lewislwood/audio-catalog/zip/refs/heads/master"
}}

export const URLs: acURLs = newURLs();

type UrlKey = keyof acURLs;
export function navURLs( current: string, myURLs: acURLs): acURLs {
const i = myURLs.docs.indexOf(current);
let tk: UrlKey = myKey( current), vk:any;


myURLs.current =  (myURLs[ tk]) as string;

if (i >0) {
tk = myKey(myURLs.docs[i-1]);
vk = myURLs[ tk];
myURLs.previous = vk;
} else { myURLs.previous = "";}
if (i < (myURLs.docs.length -1) && (i >= 0)) {
    tk = myKey(myURLs.docs[i + 1]);
    vk = myURLs[ tk];
    myURLs.next= vk;
    } else { myURLs.next= "";}
    // Modify url for local html versions
    if (myURLs.action === "html") {
     myURLs.docs.forEach((k:any) => {
        const tk:UrlKey = k;
        myURLs[tk] =  makeLocalHTML(myURLs[tk]);
     }) 
     myURLs.previous = makeLocalHTML( myURLs.previous);
     myURLs.next= makeLocalHTML( myURLs.next);
     myURLs.current= makeLocalHTML( myURLs.current);
myURLs["docs_developer"] = makeLocalHTML( myURLs["docs_developer"]);     
    }

return myURLs;
}
const myKey = (value: any):UrlKey  => {
    return value;
}

const makeLocalHTML = (file:any):any=> {
    const h:string  = file;
    return h.replace(/^\/docs\//i, "");
}
export const saveDocFile= ( docFile: string, output: string): string  => {
    const fileName: string = path.resolve( docsFolder, docFile);
    console.log( "full file Name: " , fileName);
try {
    if (! existsSync(docsFolder) ){
        mkdirSync(docsFolder);
    console.log("Created /docs folder:", docsFolder);
    }
    writeFileSync(fileName, output);
} catch (error: any) {
    console.log("saveDocFile error: ", error.message)
}
    return fileName;
}

 export async function docsRender(res:any, page: string, URLs:acURLs, renderSave = true) {
 let output: string = ""; // render string

 try {
    // Generate the render string
    if (URLs.action  === "server") { 
    res.render("pages/" + page+".ejs",URLs );
    } else {
        const p: string = path.resolve( __dirname, "..", "views", "pages", page+ ".ejs");
        await ejs.renderFile(p, URLs, { cache: false}, function(error: any, str: any) {
            if (error) {throw error ;};
        // set output equal to saved file
output = saveDocFile( URLs.current, str);
            // Now render the Saved Status screen, unless multiple calling for save all
            if (renderSave ) {
const u = newURLs(), file = [output];
const p: string = path.resolve( __dirname, "..", "views", "pages", "docs_save.ejs");
res.render( p, { files: file, ...u, action: "html"});
        }
    
 });
    }    
} catch (error: any) {
    console.log("docsRender error: ", error.message);
    output = error.message;
}
return output;
}

export async function docsRenderAll( res:any) {

    let  fileList: string[]  = [];
    let u = newURLs();
const pages: string[] = [...u.docs, "docs_developer"] ;

for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    u = newURLs();
    u.action = "html";
    navURLs(  p, u);

const o =     await docsRender(res, p,{ ...u, action: "html"} , false)
fileList.push(o);
};

const p: string = path.resolve( __dirname, "..", "views", "pages", "docs_save.ejs");
res.render( p, { files: fileList, ...u, action: "html"});
}






module.exports = {URLs, navURLs, saveDocFile, newURLs, docsRender, docsRenderAll}; 