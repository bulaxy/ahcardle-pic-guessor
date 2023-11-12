export const jsonfile = require("./arkhamdb.com.json");

export interface card {
  id: string;
  name: string;
  imagesrc: string;
}

export const cardFilterFunction = (o: {
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
  !o.restrictions &&
  o.subtype_code != "basicweakness" &&
  !o.bonded_to &&
  o.subtype_code != "weakness" 

export const dataObjects: card[] = jsonfile
  .filter(cardFilterFunction)
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

  export const dataTransform = (data:any):card[]=> data.map((o: { code: any; real_name: any; imagesrc: any }) => ({
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

  export const packNameMapper = (packCode:string)=>{
    return jsonfile.find((o:{pack_code:string})=>o.pack_code===packCode).pack_name
  }

  export const packCodeMapper = (packName:string)=>{
   return jsonfile.find((o:{pack_name:string})=>o.pack_name===packName).packCode
  }

  export const packCodes:Set<string> = new Set(jsonfile.map((card) => card.pack_code))
  export const investigatorPackCodes:Set<string> = new Set(jsonfile.filter(cardFilterFunction).map((card) => card.pack_code))

  export const packs:{name:string,code:string}[] = [...packCodes].map((packCode:string)=>({
    name:packNameMapper(packCode),
    code:packCode
  }))