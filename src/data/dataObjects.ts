const jsonfile = require("./arkhamdb.com.json");

export interface card {
  id: string;
  name: string;
  imagesrc: string;
}

const filterFunction = (o: {
  type_code: string;
  imagesrc: string;
  duplicate_of: any;
  pack_code: string;
  restrictions: any;
  subtype_code: string;
  bonded_to: any;
}) =>
  ["skill", "asset", "event"].includes(o.type_code) &&
  o.imagesrc &&
  !o.duplicate_of &&
  o.pack_code != "rcore" &&
  !o.restrictions &&
  o.subtype_code != "basicweakness" &&
  !o.bonded_to &&
  o.subtype_code != "weakness" &&
  o.pack_code != "fhvp";

export const dataObjects: card[] = jsonfile
  .filter(filterFunction)
  .map((o: { code: any; real_name: any; imagesrc: any }) => ({
    id: o.code,
    name: o.real_name,
    imagesrc: o.imagesrc,
  }))
  .filter((card:card,i,array:card[])=>{
    const sameNameList:card[] = array.filter((item:card)=>item.name===card.name)
    if(sameNameList.length>1){
      return sameNameList[0].id === card.id
    }else{
      return true
    }
  })  