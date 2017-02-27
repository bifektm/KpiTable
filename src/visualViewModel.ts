module powerbi.extensibility.visual {
    /**
     * table
     */
    export interface IGroupViewModel {
        name: string;
        rows : any[]
    }

    export interface IValueViewModel {
        rows: any[];
        name: string;
        type: Type 

    }

    export interface ITableViewModel {
        categories: IGroupViewModel//indicador group
        values: IValueViewModel[];
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
       typeCell : Type;
       
    }

}