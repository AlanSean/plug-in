export function getFontSize():number;
export interface getAgent{
    trident: boolean 
    presto: boolean 
    webKit: boolean 
    gecko: boolean
    mobile: boolean 
    ios: boolean 
    android: boolean
    iPhone: boolean
    iPad: boolean 
    webApp: boolean
    weixin: boolean 
    qq: boolean 
};
export function clearSessionStorage(item:string|string[]): void;
export function copyText(copyDOM: Node): boolean;