declare module strucData{}
module strucData {
    /**
     * table
     */
    export interface ITableViewModel {
        columns: IColumns[]
        values: IRows[];
        polarity:any[];
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
