import 'dotenv/config';
declare function initCatalog(): lwLib.Catalog;
declare function writeCatalog(cat: lwLib.Catalog): void;
declare function readCatalog(): lwLib.Catalog;
declare function sortMedia(cat: lwLib.Catalog): lwLib.Catalog;
export { initCatalog, writeCatalog, readCatalog, sortMedia };
