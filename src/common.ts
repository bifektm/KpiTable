declare module COMMON{}
module COMMON {

     
         /**
         * get score
         */
        export function getScore(score: number):number {
            try {
                if (score > 1) {
                    return 2;
                } else if (score >= 0.7) {
                    return 1;
                } else {
                    return 0;
                }
            } catch (Error) { return 1 }

        }

        /**
         * check icon -> styling
         */
       export function isIcon(cell : string):boolean{
           var matcher = new RegExp("<svg");
           return matcher.test(cell);
       }
       /**
        * format number
        */
        export function formatNumber(num:any){
            try{
                return num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
            }catch(Error){
                return num;
            }
        }
}