import { promises as fs, readFile, readFileSync } from 'fs'



/*
   Module will parse a tags with a description field and return results.
*/

type TagItem = {
key: string
value: string
}
type TagDesc = {
    tags: TagItem[]
    description: string
}


//  Reads a tag file with [name]=value tags per line 
//   # lines are comments, remaining lines are description
function readTagDesc(fileName:string ):TagDesc   {
const tagDesc: TagDesc  = { tags: [], description:  ""} 
// Read file instantly, since only ran locally
           const buf=readFileSync(fileName )
       if (buf.length > 0) { 
    let tags  = buf.toString().split("\n");
    let fields: string[] = [];
    // eliminate blank lines
    tags.forEach((v) => { 
        if (( v.trim().length > 1) && (  ! v.startsWith("#"))) fields.push(v.trim()); })
    tags = []; // Now pull tags out
    let doParse: boolean = (fields.length > 1);
    const regEx = /^\[[a-z,_]+\]=/i
    
    
    while ( doParse) {
    doParse = regEx.test(fields[0])
    if (doParse === true) {
      tags.push(fields[0]);
      fields = fields.slice(1);
      doParse = (fields.length > 1)
    }
    }
    tagDesc.description = "<p 'ta-justify'>" + ((fields.length > 1)? fields.join("</p><p>") : fields[0]) + "</p>"; 
    // Key value array for tags 
    let tagItems: string[][] = [];
    for ( let i = 0; i < tags.length; i++) {
        const t: string[] = tags[i].substr(1).split("]=");
        const ti: TagItem = { key: t[0], value: t[1]};
        if (ti.value.trim().length > 0) tagDesc.tags.push( ti );
    
    }
    }
    
    return tagDesc;
    }
    


    export { readTagDesc}
