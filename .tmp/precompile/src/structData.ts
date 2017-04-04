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
    export interface IColumns{
        name:string;
        iconType: IconType;
        type: Type;
        icon :string[];
        polarityColumn:string;

    }
    export interface IRows{
        row:IValue[]
        id:any;
    }
    
    export interface IValue{
        value:any;
        polarity:any;
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
        fontSize:any;
        color:any;
        colorFont:any;
        rowsFont:any;
        rowsFamily:any;
        rowsColor:any;
        rowsBackground:any;
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
