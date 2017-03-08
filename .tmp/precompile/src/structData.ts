module powerbi.extensibility.visual.PBI_CV_19182E25_A94F_4FFD_9E99_89A73C9944FD  {
    /**
     * table
     */
    export interface ITableViewModel {
        columns: IColumns[]
        values: IRows[];
    }
    export interface IRows{
        row:string[]
        id:number;
        polarity:number;
    }
    export interface IColumns{
        name:string;
        iconType: IconType;
        type: Type;
    }
    /**
     * type of column
     */
    export enum Type{
       SCORE,
       VARIATION,
       NOTHING
    }
    /**
     * type score
     */
    export enum IconType{
        ICON,
        ICONTEXT,
        TEXT
    }
    /**
     * settings
     */
    export interface ISettings{
       iconType : string[];
       polarity : number[];
    }
    /**
     * prop
     */
    export interface IOptions{
        zoom:any;
        kpi:any;
        columns:any;
        icon:any;
        color:any;
    }
    //TEMP parse json
    export interface IConfig{
        columns:ICol[];
        polarity:any[]
    }
    export interface ICol{
        colId:number;
        typeColumn:string;
        iconType:string;
    }
}