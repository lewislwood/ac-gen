import { errorMonitor } from 'events';
import { promises as fs, StatOptions, Stats, readFile, readFileSync, existsSync } from 'fs'
import path from 'path'
import 'dotenv/config';
import { readTagDesc } from "./tag-desc"
import { initCatalog,   writeCatalog, sortMedia}  from "./catalogJSON";
import process from 'process';


const mediaFolder = path.resolve(__dirname, "..","..", "client", "public", process.env.MEDIA_FOLDER);
const media_types: string[]  =process.env.media_types.split(","); 




type mediaFile = {
  name: string
  ext: string | null
  fileDate: Date
  size: number
}

type mediaDesc = {
  description: string
  order: number
  category: string
  name?: string
  anchor?: string
  length?: string
}

// Keyed array of media items with associated files., used to orgaize
let mediaFilesList: { [key: string]: mediaFile[] } = {};

let catalog: lwLib.Catalog = initCatalog();



export async function importFiles() {
  catalog = initCatalog();
  getCatalogInfo();

  mediaFilesList = {};

  const fileList = await searchFiles(mediaFolder, false, ["mp3", "txt"])
    .then((data) => {
      const mKeys = Object.keys(mediaFilesList).sort();

      for (let i = 0; i < mKeys.length; i++) {
        const mFiles: mediaFile[] = mediaFilesList[mKeys[i]];
        addMediaItemToList(mFiles, mKeys[i]);
      }


// writeCatalog(catalog);

      return  sortMedia(catalog);
    })
  return fileList;


  //   return { "name": "Lewis L. Wood", "dir": mediaFolder,
  // "files": files}
}

export async function searchFiles(folderName: string, recursive = true, extensions?: string[]) {
  const folderChildren = await fs.readdir(folderName)

  console.log("searching....");
  const mPrefix = mediaFolder.length + 1, files: string[] = [];
  for (const child of folderChildren) {
    const childPath = path.resolve( folderName,child);
    const childStats = await fs.lstat(childPath)
    if ((childStats.isDirectory()) && (recursive)) {
      await searchFiles(childPath, recursive, extensions)
    }
    if (childStats.isFile()) {

      const extension = child.split('.').pop() || ''
      const skipFile = extensions?.length
        ? !extensions.includes(extension)
        : false
      if (skipFile) continue
      const fullPathToFile = path.resolve(childPath)
      addMediaFileToList(childStats, fullPathToFile.substr(mPrefix));
      // paths = [...paths, fullPathToFile]
    }
  }
  return mediaFilesList
}
const addMediaFileToList = (fileStats: Stats, fileName: string) => {
  const e: string | undefined = fileName.split(".").pop();
  const mf: mediaFile = {
    name: fileName,
    ext: (e === undefined) ? null : e,
    size: fileStats.size,
    fileDate: fileStats.mtime

  }
  // exclude these catalog files special
  const ex: string[] = ['catalog-info.txt', 'catalog-post.txt' ];
if (ex.includes(mf.name.toLowerCase())) { return ;}


  const key = (e === undefined) ? mf.name : mf.name.replace("." + e, "");
  let fileList: mediaFile[] | undefined = mediaFilesList[key];
  if (fileList === undefined) {
    fileList = [mf]
  } else { fileList.push(mf); }
  mediaFilesList[key] = fileList;

}
// Add media item to a list 
const addMediaItemToList = (files: mediaFile[], keyName: string) => {
  let mp3: mediaFile | null = null, txt: mediaFile | null = null;

  for (let i = 0; i < files.length; i++) {
    const m: mediaFile = files[i];
    if (m.ext === "mp3") { mp3 = m }
    else { txt = m }
  }
  // Handle media description File if it has one.
  const md: mediaDesc = (txt != null) ? readMediaDesc(txt) : { order: -1, category: "General", description: "No Description provided" };

  try {
    if (mp3 === null) return;
    const mI: lwLib.MediaItem = {
      file: mp3.name,
      name: (md.name === undefined) ? keyName : md.name,
      length: (md.length === undefined) ? null : md.length,
      type: (mp3.ext === null) ? "mp3" : mp3.ext,
      size: mp3.size,
      Modified: mp3?.fileDate,
      order: md.order,
      category: md.category,
      description: md.description
    }
    catalog.mediaList.push(mI);
  } catch (error: any) {
    console.log("Media Description Error: ", error.message)
  }
}
// Reads and translates txt description into its components
const readMediaDesc = (file: mediaFile) => {
  let ord: number = catalog.mediaList.length, cat: string = "General", desc: string = "";
  const md: mediaDesc = {
    order: ord,
    category: cat,
    description: file.name
  }
  const tagDesc = readTagDesc(path.resolve(mediaFolder, file.name));
  md.description = tagDesc.description;
  tagDesc.tags.forEach((ti) => {
    switch (ti.key) {
      case "name":
        md.name = ti.value;
        break;
        case "anchor":
        md.anchor= ti.value;
        break;
      case "order":
        md.order = parseInt(ti.value);
        break;
      case "category":
        md.category = ti.value;
        break;
      case "length":
        md.length = ti.value;
        break;
      default:
        console.log(file.name, ": Key: ", ti.key, "not found for tag Item");
    }
  })
  return md;
}

// getCatalog Info to describe and control HTML generation later.
function getCatalogInfo() {
  const infoFile: string = path.resolve(mediaFolder, "catalog-info.txt")
  const postFile: string = path.resolve(mediaFolder, "catalog-post.txt")
  try {
    if (existsSync(infoFile)) {
      const tagDesc = readTagDesc(infoFile);
catalog.overview = tagDesc.description;
tagDesc.tags.forEach((ti) => {
  const k = ti.key.trim().toLowerCase().replace(/\_/g, "");
  switch (k) {
    case "logo":
      catalog.logo = ti.value;
      break;
      case "doctitle":
        catalog.doc_title = ti.value;
        break;
        case "cattitle":
          catalog.cat_title = ti.value;
          break;
          case "volume":
            catalog.volume =  parseFloat(ti.value);
            break;
          case "allowcategoryfilter":
            catalog.allow_category_filter = ( ti.value.toLowerCase() === "true");
            break;
            case "categoryfilter":
              catalog.category_filter = ti.value;
              break;
              case "menulink":
                catalog.menu_link = ti.value;
                break;
                case "menutext":
                  catalog.menu_text = ti.value;
                  break;
                  case "help":
                    catalog.help = ti.value;
                    break;
    default:
      console.log("Catalog-info invalid tag: ", ti.key);
  }
})

    }
  } catch (error: any) {
    console.log("getCatalogInfo error: ", error.message)
  }
  try {
    if (existsSync(postFile)) {
      const tagDesc = readTagDesc(postFile);
catalog.post_description = tagDesc.description;
    }
  } catch (error: any) {
    console.log("getCatalogInfo-post error: ", error.message)
  }


}





