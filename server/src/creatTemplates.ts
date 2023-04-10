import { promises as fs, readdirSync, readFileSync, existsSync, writeFileSync, mkdirSync , writeFile, lstat} from 'fs'
import path from 'path'
import 'dotenv/config';






const folders: lwLib.FolderLayout = {
    public: path.resolve(__dirname, "..","..","client", "public"),
    media: path.resolve(__dirname, "..","..","client", "public", process.env.MEDIA_FOLDER),
    templates: path.resolve(__dirname, "..","..","client", "public", "templates")
}

const templates: lwLib.TemplateFiles = {
    initialized: false,
    mediaTypes: [],
    media: "",
    info: "",
    post: ""
}
function initTemplateDefault(mode: 'media' | 'info' | 'post'): string {
    let lines: string[] = [''];
    switch (mode) {
        case 'media':
            lines = [
                '# Media Info file.  This file describes the media with the same name. ',
                '# You must copy this template file into media folder and name it the same name as the media file with the .txt extension.',
                '# Media friendly name',
                '[name]=User friendly name',
                '# Custom anchor tag, otherwise one will be genrated from name above.  This way when you share a direct link to this media it has your custom tag (perhaps shorter and more meaningful.',
                '[anchor]=User friendly name',
                '[order]=0',
                '[category]=General, Rock',
                '[length]=2:31',
                '# *****  Ends the tag info section ***',
                '# This is the media description. Each new line will become a paragraph.',
                'Here I tell it as it is. Singing my hear out.',
                'Please give to my foundation you crazy people!!!'
            ];
            break;
        case 'info':
            lines = [
                '#  Catalog info file. Settings and directives to configure catalog',
                '[logo]=',
                '[doc_title]=Browser Doc Title',
                '[cat_title]=Catalog Title',
                "# initial Volume (if soft or loud media) valid numbers 0.1 - 1.0",
"[volume]=0.4", 
                '# Allows users to select categories',
                '[allow_category_filter]=true',
                '# if you only wnat certain categories to be visible',
                '[category_filter]=',
                '        # Menu Link to point to',
                '[menu_link]=http://Helpme.org',
                ',',
                '[menu_text]=Give me blood',
                '# Instructional text prior to media files',
                '[help]=Select media file to play. Next to each play button is the download button.',
                '#  Any text below will be placed in a overviewparagrapgh(s) prior to media cards.',
                '#  html <p> .... </p> will be addded for each paragraph. Paragraphs are new lines.',
                '# You can use html if you are comfortable doing so. ie <strong>, <emp> bold, italic etc.. Even links...',
                'This is a podcast of great ideas and things you would love to use.'
            ];
            break;
        case 'post':
            lines = [
                '#This is the paragraph(s) at the end of the html file#  Simply type in some text or html. ',
                'Check out my repository...',
            ];
    }

    return lines.join("\n");
}


async function lwWriteFile(file:string, output: string, fileStatus: lwLib.templateFileStatus ) {
const myPromise = new Promise((resolve,reject) => {

try {
    if ( ! existsSync( file)) {
writeFile( file, output, (error:any) => {
    if (error) { 
        fileStatus.status ="Error writing file: " + file;fileStatus.error = error.message; 
        throw error 
    }
    fileStatus.status = "descriptor file created ";
    resolve( fileStatus.status);
})
} else {
     fileStatus.status  = "Already exists"; 
     resolve(fileStatus.status);
}
    
} catch (error) {
    console.log(fileStatus.status);
    reject(fileStatus.status);
}
})    
return myPromise;
}




function initializeTemplates() {
    try {
        if (!templates.initialized) {
            if (!existsSync(folders.templates)) mkdirSync(folders.templates);
            const catMedia: string = path.resolve(folders.templates, "media-info.txt");
            if (existsSync(catMedia)) templates.media = readFileSync(catMedia).toString().trim();
            if (templates.media.length === 0) {
                templates.media = initTemplateDefault('media');
                lwWriteFile(catMedia, templates.media, {name: ""});
            }
            const catInfo: string = path.resolve(folders.templates, "catalog-info.txt");
            if (existsSync(catInfo)) templates.info= readFileSync(catInfo).toString().trim();
            if (templates.info.length === 0) {
                templates.info= initTemplateDefault('info');
                lwWriteFile(catInfo, templates.info,{name: ""});
            }
            const catPost: string = path.resolve(folders.templates, "catalog-post.txt");
            if (existsSync(catPost)) templates.post= readFileSync(catPost).toString().trim();
            if (templates.post.length === 0) {
                templates.post= initTemplateDefault('post');
                lwWriteFile(catPost, templates.post,{name: ""});
            }
if (! existsSync(folders.media)) mkdirSync(folders.media);
templates.mediaTypes = process.env.media_types.toLowerCase().split(",");
        if (templates.mediaTypes.length === 0) templates.mediaTypes.push("mp3");
            templates.initialized = true;
        }
    } catch (error:any) {
console.log("InitializeTemplates error: ", error.message)
throw error;
    }
}


async function getMediaFilesList() {
    const mFS:lwLib.templateFileStatus[] = [];

    try {
        const mTypes = templates.mediaTypes;
        
                const mItems = readdirSync( folders.media,);
        for (const ch of mItems) {
            const ext = path.extname(ch).toLowerCase().replace(".", "");
            if (mTypes.includes(ext)) {
mFS.push({name: path.basename(ch,ext)+"txt", media: ch});
            }
        } 

    } catch (error:any) {
console.log("getMediaItems error: ", error.message);        
    }
    return mFS;
} 


export async function copyTemplates( res:any) {
    const  status: lwLib.templateStatus = { folder: process.env.MEDIA_FOLDER, catalog: [], mediaFiles: [], status: "" };
try {
    initializeTemplates();
    status.catalog.push({ name: "catalog-info.txt"})
    status.catalog.push({ name: "catalog-post.txt"})

    status.mediaFiles = await getMediaFilesList()
console.log("Beginning to copy templates.... (Media Files:", status.mediaFiles.length, "");
const myPromises: any[] = []; 
for (const m of status.catalog) {
   const out =   (m.name === "catalog-info.txt")? templates.info : templates.post;
   myPromises.push(lwWriteFile(path.resolve(folders.media, m.name),out,m));
}
const out =   templates.media;
for (const m of status.mediaFiles) {
    myPromises.push(lwWriteFile(path.resolve(folders.media, m.name),out,m));
 }
 status.types = templates.mediaTypes.join(",");
 status.status = status.mediaFiles.length.toString() + " media file(s) found."
const xl = await Promise.all( myPromises);
// console.log(JSON.stringify(xl,null, "   "));;
const p: string = path.resolve( __dirname, "..", "views", "pages", "templates.ejs");
res.render( p,{...status, doc_title: "Templates descriptor Status Summary", cat_title: "Templates Status Summary", logo: "logo.svg", logoAlt: "Your logo goes here .."});

} catch (error:any) {
    console.log("copyTemplates error: ", error.message);
}
}




module.exports = {copyTemplates };