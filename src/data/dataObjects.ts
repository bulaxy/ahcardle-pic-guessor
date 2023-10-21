const jsonfile = require("./arkhamdb.com.json");

export interface cardList {
    id: string;
    name: string;
    imagesrc: string
  }

export const dataObjects: cardList[] = jsonfile.filter((o: { type_code: string; imagesrc: any; duplicate_of: any; pack_code: string; restrictions: any; subtype_code: string; bonded_to: any; })=> ['skill', 'asset', 'event'].includes(o.type_code)&& o.imagesrc && !o.duplicate_of && o.pack_code !='rcore'&& !o.restrictions && o.subtype_code!='basicweakness' && !o.bonded_to && o.subtype_code!='weakness'&& o.pack_code != 'fhvp').map((o: { code: any; real_name: any; imagesrc: any; })=>({
    id:o.code,
    name: o.real_name,
    imagesrc: o.imagesrc
}))
