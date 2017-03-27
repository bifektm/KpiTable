declare module strucData{}
module strucData {
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
        id:any;
        polarity:any;
    }
    export interface IColumns{
        name:string;
        iconType: IconType;
        type: Type;
        icon :string[];
        polarityColumn:string;

    }
    export interface IPolarity{
        name:string;
        values:any[];
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
        config:any;
        color:any;
    }
    //configs
    export interface IConfig{
        columnName:string;
        typeColumn:string;
        iconType:string;
        visualValue:string;
        columnPolarity:string;
        
    }
    
}
