declare module STYLE{}
module STYLE {

    export class Customize{

        /**
         * check icon -> styling
         */
       static isIcon(cell : string):boolean{
           var matcher = new RegExp("<svg");
           return matcher.test(cell);
       }
       /**
        * zoom of visual
        */
       static setFontsize(tHead: d3.Selection<HTMLElement>, num: any) {
           tHead.selectAll('th').style("font-Size", num + "px");
       }
       /**
        * set color headings
        */
       static setColor(tHead: d3.Selection<HTMLElement>, color: any) {
           if (tHead) {
               if (color == undefined || color == null) {
                    tHead.selectAll('th').style("background-color","#015c55");
               } else {
                    tHead.selectAll('th').style("background-color",color);
               }
           }
       }
       /**
        * set color font
        */
        static setColorFont(tHead: d3.Selection<HTMLElement>, color: any) {
           if (tHead) {
               if (color == undefined || color == null) {
                    tHead.selectAll('th').style("color","white");
               } else {
                    tHead.selectAll('th').style("color",color);
               }
           }
       }
        /**
        * set size font rows
        */
        static setSizerFont(tBody: d3.Selection<HTMLElement>, num: any) {
           if (tBody) {
               if (num == undefined || num == null) {
                    tBody.selectAll('td').style("font-Size", num + "px");
               } else {
                    tBody.selectAll('td').style("font-Size", num + "px");
               }
           }
       }
        /**
        * set size font rows
        */
        static setFamily(tBody: d3.Selection<HTMLElement>, font: any) {
           if (tBody) {
               if (font == undefined || font == null) {
                    tBody.selectAll('td').style("font-family", font);
               } else {
                    tBody.selectAll('td').style("font-family", font);
               }
           }
       }
        /**
        * set color font row
        */
        static setRowColor(tBody: d3.Selection<HTMLElement>, color: any) {
           if (tBody) {
               if (color == undefined || color == null) {
                    tBody.selectAll('td').style("color","black");
               } else {
                    tBody.selectAll('td').style("color",color);
               }
           }
       }
       /**
        * set color font row
        */
        static setRowBackground(tBody: d3.Selection<HTMLElement>, color: any) {
           if (tBody) {
               if (color == undefined || color == null) {
                    tBody.selectAll('td').style("background-color","black");
               } else {
                    tBody.selectAll('td').style("background-color",color);
               }
           }
       }
       /**
        * options
        * @param container 
        * @param dataViewModel 
        */
        static setHTML(container:d3.Selection<HTMLElement>,dataViewModel: strucData.ITableViewModel){
             let bullets = ICON.ShapeFactory.getShape("BULLET");
             let arrow = ICON.ShapeFactory.getShape("ARROW");
             let html;
             container.select(".container").remove();
             html=`
              <fieldset>
                  <p>
                  <label>Columns:</label>
                  <select name="cols" size="1" style="width:100%;font-size:10px;center">
                    ${dataViewModel.columns.map(item =>`<option value="${item.name}">${item.name}</option>`).join('')}
              </select>
                  </p>
                  <p>
                  <label>Type:</label>
                  <select name="typeCol" size="1" style="width:100%;font-size:10px;center">
                    <option value="none">None</option>
                    <option value="score">Score</option>
                    <option value="variation">Variation</option>
                  </select>
                  </p>
                  <p class="custtom">
                 
                 </p>
                   
                 <p class="preview">
                 <label>Preview</label>
                 
                 </p>
              </fieldset>
              <button  id="configButton" class="button">Apply</button>
             `
             container.append('div').classed("container",true).html(html);
        }
    }
}