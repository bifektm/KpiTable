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
    export enum Type{
        ICON,
        ICONTEXT,
        TEXT,
        NOTHING
    }
}