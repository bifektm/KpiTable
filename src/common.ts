
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
         * get indicator values
         * @param data 
         */
        public static getIndicator(data: any[]) {
            let indicator = [];
            data.forEach(item => {
                if (item.source.roles["rows"] == true) {
                    indicator = item.values;
                    return indicator;
                }

            });
            return indicator;
        }
        /**
         * get polarity values
         * @param data 
         */
        public static getPolarity(data: any[]) {
            let polarity = [];
            data.forEach(item => {
                if (item.source.roles["polarity"] == true) {
                    polarity = item.values;
                    return polarity;
                }

            });
            return polarity;
        }
        //################# JSON #######################
        /**
         * get config data
         * @param data 
         * @param rows 
         */
        public static getConfig(data: any[]){
           let conf=[];
            let array = data[0].categorical.categories;
            array.forEach(item =>{
                  if (item.source.roles["config"] == true) {
                    conf = this.getDataConf(item.values);
                    return conf;
                }

            });
            return conf;

        }
        /**
         *  Parse JSON config
         * @param id 
         * @param rows 
         */
        private static getDataConf(rows:any[]){
            let values = [];
            let obj;
            let valid = null;
            
             try {
                obj = JSON.parse(rows[0]);
               
                 obj.forEach(item => {
                     values.push({
                        columnName:     item.columnName,
                        typeColumn:     item.typeColumn,
                        iconType:       item.iconType,
                        visualValue:    item.visualValue,
                        columnPolarity: item.columnPolarity
                    }); 
                 });    
                (values.length < 1 ) ? values = [] : values;
                return values;
            } catch (Error) { throw new Error("json invalid!");}
        }

    }

}