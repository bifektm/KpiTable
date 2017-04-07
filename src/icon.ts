declare module ICON { }

module ICON {

   /**
    * interface shapes
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
            if (shape.toUpperCase() == "BULLET") {
                return new Bullet().getIcon();
            }
            if (shape.toUpperCase() == "ARROW") {
                return new BulletWhite().getIcon();
            }
            return new BulletWhite().getIcon();
        }
    }

 
   //########################## SHAPES ##########################
  

  /**
   * class bullet
   */
    class Bullet implements IShape {
        private ICON_BULLET_RED = '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="#B22222" d="M7.5 0c.693 0 1.358.09 1.996.266s1.236.428 1.793.754 1.063.716 1.52 1.172.845.962 1.17 1.52.578 1.155.755 1.793S15 6.807 15 7.5s-.09 1.358-.266        1.996-.428.236-.754 1.793-.716 1.063-1.172 1.52-.962.845-1.52 1.17-1.155.578-1.793.755S8.193 15 7.5 15s-1.358-.09-1.996-.266-1.236-.428-1.793-.754-1.063-.716-1.52-1.172-.845-.962-1.17-1.52S.44 10.133.264 9.495 0 8.193 0 7.5s.09-1.358.266-1.996.428-1.236.754-1.793.716-1.063 1.172-1.52.962-.845 1.52-1.17S4.867.44 5.505.264 6.807 0 7.5 0z"/><path fill="#FFF" d="M7 4h1v5H7zM7 10h1v1H7z"/></svg>';
        private ICON_BULLET_YELLOW = '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="#EE7600" d="M7.5 0L15 15H0L7.5 0z"/><path fill="#FFFFFF" d="M7 6h1v5H7zM7 12h1v1H7z"/></svg>';
        private ICON_BULLET_GREEN = '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="#3CB371" d="M7.5 0c.688 0 1.353.09 1.992.267s1.238.43 1.794.754 1.063.716 1.52 1.173.847.963 1.172 1.52.576 1.155.754 1.794S15 6.812 15 7.5s-.09 1.353-.267 1.992-.43 1.238-.754 1.794-.716 1.063-1.173 1.52-.963.847-1.52 1.172-1.155.576-1.794.754S8.188 15 7.5 15s-1.353-.09-1.992-.267-1.238-.43-1.794-.754-1.063-.716-1.52-1.173-.847-.963-1.172-1.52-.576-1.154-.754-1.79S0 8.192 0 7.5c0-.688.09-1.353.267-1.992s.43-1.238.754-1.794.716-1.063 1.173-1.52.963-.847 1.52-1.172S4.867.446 5.503.268 6.808 0 7.5 0z"/><path fill="#FFF" d="M10.92 4.358l.66.66-5.486 5.485L3.42 7.83l.66-.66 2.014 2.015"/></svg>';
        public getIcon(): string[] {
            return [this.ICON_BULLET_RED,this.ICON_BULLET_YELLOW,this.ICON_BULLET_GREEN];
        }

    }
    /**
     * class BulletWhite
     */
    class BulletWhite implements IShape{
        private ICON_TREND_DOWN ='<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="#808080" d="M7.5 0c.688 0 1.353.09 1.992.267s1.238.43 1.794.754 1.063.716 1.52 1.173.847.963 1.172 1.52.576 1.155.754 1.794S15 6.812 15 7.5s-.09 1.353-.267 1.992-.43 1.238-.754 1.794-.716 1.063-1.173 1.52-.963.847-1.52 1.172-1.155.576-1.794.754S8.188 15 7.5 15s-1.353-.09-1.992-.267-1.238-.43-1.794-.754-1.063-.716-1.52-1.173-.847-.963-1.172-1.52-.576-1.154-.754-1.79S0 8.192 0 7.5c0-.688.09-1.353.267-1.992s.43-1.238.754-1.794.716-1.063 1.173-1.52.963-.847 1.52-1.172S4.867.446 5.503.268 6.808 0 7.5 0z"/><path fill="#FFF" d="M10.92 4.358l.66.66-5.486 5.485L3.42 7.83l.66-.66 2.014 2.015"/></svg>';
        private ICON_TREND_STEADY = '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="#808080" d="M7.5 0L15 15H0L7.5 0z"/><path fill="#FFFFFF" d="M7 6h1v5H7zM7 12h1v1H7z"/></svg>';
        private ICON_TREND_UP = '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="#808080" d="M7.5 0c.693 0 1.358.09 1.996.266s1.236.428 1.793.754 1.063.716 1.52 1.172.845.962 1.17 1.52.578 1.155.755 1.793S15 6.807 15 7.5s-.09 1.358-.266        1.996-.428.236-.754 1.793-.716 1.063-1.172 1.52-.962.845-1.52 1.17-1.155.578-1.793.755S8.193 15 7.5 15s-1.358-.09-1.996-.266-1.236-.428-1.793-.754-1.063-.716-1.52-1.172-.845-.962-1.17-1.52S.44 10.133.264 9.495 0 8.193 0 7.5s.09-1.358.266-1.996.428-1.236.754-1.793.716-1.063 1.172-1.52.962-.845 1.52-1.17S4.867.44 5.505.264 6.807 0 7.5 0z"/><path fill="#FFF" d="M7 4h1v5H7zM7 10h1v1H7z"/></svg>';
        
        
        public getIcon():string[]{
          return [this.ICON_TREND_UP,this.ICON_TREND_STEADY,this.ICON_TREND_DOWN];
        }
    }


}
