import { IEnum } from "../Interfaces/IEnum";


export function FromEnumToArrOfObject(enumObj: { [key: string]: string | number }): IEnum[] {
  return Object.keys(enumObj)
    .filter(key => isNaN(Number(key))) // Filter numeric keys (to get enum values)
    .map(key => ({
     Text: key,
     Value: enumObj[key]
    }));
}