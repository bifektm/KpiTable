module powerbi.extensibility.visual.PBI_CV_19182E25_A94F_4FFD_9E99_89A73C9944FD  {
    /**
     * table
     */
    export interface ITableViewModel {
        columns: IColumns[]
        values: IRows[];
        polarity:IPolarity[];
    }
    export interface IRows{
        row:string[]
        id:number;
    }
    export interface IColumns{
        name:string;
        iconType: IconType;
        type: Type;
        icon :string[];
    }
    /**
     * polarity
     */
    export interface IPolarity{
        columnName:string;
        polarity:any[];
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
        columnName:string;
        typeColumn:string;
        iconType:string;
        visualValue:string;
        columnPolarity:string;
        
    }
    
}