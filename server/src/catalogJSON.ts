import { promises as fs, readFile, readFileSync, existsSync , writeFileSync} from 'fs'
import path from 'path'
import 'dotenv/config';

const catalogFile: string = path.resolve(__dirname, "..", "..", "client", "public", process.env.MEDIA_FOLDER, "catalog.json");

type Application = {
  created: Date | null
    name: string
    developer: string
    website: string
  }
  

  
function initCatalog(): lwLib.Catalog {
    const cat: lwLib.Catalog = {
      application: {
        name: "Audio-Catalog",
        created: new Date(),
        developer: "Lewis Wood",
        website: "http://blindheroes.org",
      },
      allow_category_filter: true,
      overview: "",
      help: "Select the Play button or Download to download the media.",
      logo: "logo.svg",
      logoAlt: "logo for Audio Acatalog",
      volume: 0.4,
      mediaList: []
    }
    return cat;
  }
  
  function writeCatalog( cat: lwLib.Catalog) {
    try {
      sortMedia(cat);
      let str = JSON.stringify(cat,null ,"  " );

       console.log(str);
      writeFileSync(catalogFile,str )
    } catch (error: any) {
      console.error( "Error writing to catalog", error.message)
    }
  }

  function readCatalog():lwLib.Catalog {
    let cat = initCatalog();
    cat.application.created = null;
    cat.application.created = null;

    try {
      if (existsSync( catalogFile)) {
        let buffer = readFileSync( catalogFile);

if (buffer.length > 0) { 
  // cat = (buffer.toJSON() as unknown) as Catalog;
  const str = buffer.toString();
  const cat  = JSON.parse( str) as lwLib.Catalog;
  if (! cat.logo) cat.logo = "logo.svg";
  return sortMedia( cat);
}
      } 
    } catch (error:any) {
      console.error("Reading catalog: ", error.message);
    }
    return cat;
  }


function sortMedia( cat: lwLib.Catalog): lwLib.Catalog {
  const mediaFiles = cat.mediaList;
  cat.mediaList =  mediaFiles.sort((a,b) => {
if (a.order < b.order) return -1
else if (a.order === b.order) return 0
else return 1;
  });
  cat.mediaList.map( (mi) => {
    if (!  mi.anchor) {
const n = mi.name.toLowerCase().split(" ").join("-").substr(0,30);
mi.anchor = n;
    }
  }) 
  return cat;
}


  
  
  export { initCatalog,  writeCatalog, readCatalog, sortMedia}