
declare module COMMON { }

module COMMON {
    
    /**
     * visual core
     */
    export class Core {

        /**
         * get score type
         * @param score 
         */
        public static getScore(score: number): number {
            try {
                if (score > 1) {
                    return 2;
                } else if (score >= 0.7) {
                    return 2;
                } else {
                    return 0;
                }
            } catch (Error) { return 1; } 

        }
        /**
         * get color variation
         * @param variation 
         * @param polarity 
         */
        public static getVariation(variation: number, polarity: number): string {
            if (variation > 0) {
                if (polarity == 0) { return "red"; }
                else { return "green"; }
            } else {
                if (polarity == 0) { return "green"; }
                else { return "red"; }
            }
        }
        /**
         * format number
         * @param num 
         */
        public static formatNumber(num: any) {
            try {
                return num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
            } catch (Error) {
                return num;
            }
        }
        /**
         * get polaritys
         * @param data 
         * @param rows 
         */
        public static getPolarity(data: any[], rows: any[]) {
            let polarity = [];

            for (let i = 0; i < data.length; i++) {
                if (data[i].roles["polarity"] == true) {
                    polarity.push({
                        columnName: data[i].displayName,
                        polarity: this.getValuesPolarity(i, rows)
                    });
                }

            }
            return polarity;
        }
        /**
         * get values polarity 
         * @param id 
         * @param rows 
         */
        private static getValuesPolarity(id: number, rows: any[]) {
            let values = [];
            for (let i = 0; i < rows.length; i++) {
                values.push(rows[i][id]);
            }
            return values;
        }
        /**
         * get name column config
         * @param data 
         * @param rows 
         */
        public static getNameColumnConfig(data: any[]){
            let name = null;

            for (let i = 0; i < data.length; i++) {
                if (data[i].roles["config"] == true) {
                    return data[i].displayName;
                }

            }
            return name;
        }
        /**
         * get config data
         * @param data 
         * @param rows 
         */
        public static getConfig(data: any[], rows: any[]){
           let conf=null;

            for (let i = 0; i < data.length; i++) {
                if (data[i].roles["config"] == true) {
                    conf = this.getDataConf(i,rows);
                    return conf;
                }

            }
            return conf;

        }
        /**
         *  Parse JSON config
         * @param id 
         * @param rows 
         */
        private static getDataConf(id: number,rows:any[]){
            let values = [];
            let obj;
            let valid = null;
            
             try {
                obj = JSON.parse(rows[0][id]);
               
                 obj.forEach(item => {
                     values.push({
                        columnName:     item.columnName,
                        typeColumn:     item.typeColumn,
                        iconType:       item.iconType,
                        visualValue:    item.visualValue,
                        columnPolarity: item.columnPolarity
                    }); 
                 });


               /* for (let i = 0; i < obj.length; i++) {
                        values.push({
                        columnName:     obj[i].columnName,
                        typeColumn:     obj[i].typeColumn,
                        iconType:       obj[i].iconType,
                        visualValue:    obj[i].visualValue,
                        columnPolarity: obj[i].columnPolarity
                    }); 
                    
                }*/
                 
                (values.length < 1 ) ? values = null : values;
                return values;
            } catch (Error) { console.warn("json invalid!"); return null; }
        }
    
    }

}