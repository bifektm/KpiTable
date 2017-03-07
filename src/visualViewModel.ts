module powerbi.extensibility.visual {
    /**
     * table
     */
    export interface ITableViewModel {
        columns: IColumns[]
        values: IRows[];
    }
    export interface IRows{
        row:string[]
        id:number
    }
    export interface IColumns{
        name:string;
        type: Type
    }
    /**
     * type score
     */
    export enum Type{
        ICON,
        ICONTEXT,
        TEXT,
        NOTHING
    }
    /**
     * settings
     */
    export interface ISettings{
       typeCol : Type;
       fontSize : any;
       iconType : string[];
       polarity : number[];
    }
    /**
     * prop
     */
    export interface IOptions{
        min:any;
    }
}