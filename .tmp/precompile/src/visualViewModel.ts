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