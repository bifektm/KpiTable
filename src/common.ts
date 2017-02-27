declare module COMMON{}
module COMMON {

     
         /**
         * get score
         */
        export function getScore(score: number) {
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
       
}