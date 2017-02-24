declare module ICON { }

module ICON {

   /**
    * interface shpaes
    */
    interface IShape {
        getIcon(): string[];
   }

    /**
    * class factory to get correct instance of icons -> pattern factory
    */
    export class ShapeFactory {


        /**
         * @param  {string} shape
         */
        static getShape(shape: string) {
            if (shape == null) {
                throw new Error("null string object");
            }
            if (shape.toUpperCase() == "bullet") {
                return new Bullet().getIcon();
            }
            if (shape.toUpperCase() == "arrow") {
                return new Arrow().getIcon();
            }
            return [];
        }
    }

 /**
  * shapes
  */
    class Bullet implements IShape {
        private ICON_BULLET_RED = "";
        private ICON_BULLET_YELLOW = "";
        private ICON_BULLET_GREEN = "";
        
       public getIcon(): string[] {
            return [this.ICON_BULLET_RED,this.ICON_BULLET_YELLOW,this.ICON_BULLET_GREEN];
        }

    }
    class Arrow implements IShape{
        private ICON_TREND_UP = '<svg width="14" height="14" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><path d="M7.6.75H4.39V0h4.5v4.5h-.75V1.266L.526 8.888 0 8.36 7.6.75z" fill="#3CB371" fill-rule="evenodd"/></svg>';
        private ICON_TREND_STEADY = '<svg width="14" height="14" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><path d="M7.756 3.8l-2.27-2.27.53-.53 3.182 3.182-3.182 3.182-.53-.53 2.286-2.287L0 4.555V3.81l6.756-.01z" fill="#000" fill-rule="evenodd"/></svg>';
        private ICON_TREND_DOWN = '<svg width="14" height="14" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><path d="M8.89 4.388v4.5h-4.5v-.75h3.215L0 .528.527 0 8.14 7.605V4.388h.75" fill="#B22222" fill-rule="evenodd"/></svg>';
        public getIcon():string[]{
          return [this.ICON_TREND_DOWN,this.ICON_TREND_STEADY,this.ICON_TREND_DOWN];
        }
    }


}
