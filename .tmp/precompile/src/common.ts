
declare module COMMON { }

module COMMON {
    
    /**
     * visual core
     */
    export class Core {

        /**
        * get score
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
         */
        public static getPolarity(data: any[], rows: any[]) {
            let polarity = [];

            let i;
            for (i = 0; i < data.length; i++) {
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
         */
        private static getValuesPolarity(id: number, rows: any[]) {
            let values = [];
            for (let i = 0; i < rows.length; i++) {
                values.push(rows[i][id]);
            }
            return values;
        }
    }

}