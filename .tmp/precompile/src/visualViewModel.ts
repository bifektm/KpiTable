module powerbi.extensibility.visual.PBI_CV_19182E25_A94F_4FFD_9E99_89A73C9944FD  {
    /**
     * table
     */
    export interface IGroupViewModel {
        name: string;
        rows : IRowCategory[]
        
    }

    export interface IValueViewModel {
        rows: any[];
        name: string;
        type: Type 
       
    }
    export interface IRowCategory{
        row :any
        selectionId: ISelectionId; //id tr
        kpis : IKPI;
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
       typeCol : Type;
       
    }
    
    export interface IKPI{
        polarity?: number;
        min?: number;
        med?:number;
        max?:number;
    }

}