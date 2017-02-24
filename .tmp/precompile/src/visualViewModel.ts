module powerbi.extensibility.visual.PBI_CV_19182E25_A94F_4FFD_9E99_89A73C9944FD  {
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