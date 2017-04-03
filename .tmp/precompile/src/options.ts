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
       static setZoom(target: d3.Selection<HTMLElement>, num: any) {
           target.select('div').style("font-Size", num + "px");
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
                  <p class="score">
                  <label>Type Icon :</label>
                   <select name="typeIcon" size="1" style="width:100%;font-size:10px;center">
                    <option value="icon">Icon</option>
                    <option value="icontext">Icon-Text</option>
                    <option value="text">Text</option>
                    </select>
                  </p>
                   <p class="polarity">
                  <label>Other :</label>
                   <select name="polarity" size="1" style="width:100%;font-size:10px;center">
                    ${dataViewModel.polarity.map(item =>`<option value="${item.name}">${item.name}</option>`).join('')}
                    </select>
                  </p>
                  <p class="score">
                  <label><input type="radio" name="icon" value="bullet" checked></label>
                   ${bullets.map(item => ``+item).join('&nbsp;&nbsp;  &nbsp;&nbsp;')}
                  </p>
                  <p class="score">
                  <label><input type="radio" name="icon" value="arrow" ></label>
                   ${arrow.map(item => ``+item).join('&nbsp;&nbsp;  &nbsp;&nbsp;')}
                  </p> 
              </fieldset>
              <button id="configButton" class="button">Apply</button>
             `
             container.append('div').classed("container",true).html(html);
        }
    }
}