declare module COMMON{}
module COMMON {
        
        /**
         * visual core
         */
        export class Core {

             /**
             * get score
             */
            static getScore(score: number): number {
                try {
                    if (score > 1) {
                        return 2;
                    } else if (score >= 0.7) {
                        return 2;
                    } else {
                        return 0;
                    }
                } catch (Error) { return 1 }

            }
            /**
             * get color variation
             */
            static getVariation(variation:number,polarity:number):string{
                if(variation > 0){
                    if(polarity == 0){return "red";}
                    else{return "green";}
                }else{ 
                    if(polarity == 0){return "green";}
                    else{return "red";}
                }
            }
            /**
             * format number
             */
            static formatNumber(num: any) {
                try {
                    return num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
                } catch (Error) {
                    return num;
                }
            }
    } 

}