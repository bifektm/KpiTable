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
                  <select name="cols" size="1" style="width:100%;font-size:10px;center">
                    <option value="score">None</option>
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
                  <label></label>
                  <p class="score">
                  <br><br>
                     <button id="scoreButton">Apply</button>
                  </p>
              </fieldset>
             `
             container.append('div').classed("container",true).html(html);
        }

         /**
         * options
         */
        static configHTML(modalContent: d3.Selection<HTMLElement>,dataViewModel: strucData.ITableViewModel){
            modalContent.select("div[id='config']").remove();
            let bullets = ICON.ShapeFactory.getShape("BULLET");
            let arrow = ICON.ShapeFactory.getShape("ARROW");
            let html =`
            <table class="config" border="0">
            <tr>
                <td>
                    <label>Columns :</label>
                </td>
                <td> 
                    <select name="cols" style="width:200px">
                    ${dataViewModel.columns.map(item =>`<option value="${item.name}">${item.name}</option>`).join('')}
                    </select>
                </td>
                <td rowspan="5" >&nbsp;&nbsp;</td>
                <td>
                    <label>Columns :</label>
                </td>
                
                <td> 
                    <select name="colsV" style="width:200px">
                    ${dataViewModel.columns.map(item =>`<option value="${item.name}">${item.name}</option>`).join('')}
                    </select>
                </td>
             </tr>
               <tr>
                <td >
                    <label>Type Icon :</label>
                </td>
                <td> 
                    <select name="typeIcon" style="width:200px">
                    <option value="icon">Icon</option>
                    <option value="icontext">Icon-Text</option>
                    <option value="text">Text</option>
                    </select>
                </td>
                <td></td>
                <td> 
                   
                </td>
             </tr>
            <tr>
                <td>       
                  <label>Arrow :</label>
                </td>
                <td>
                <input type="radio" name="icon" value="arrow" checked> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${arrow.map(item => ``+item).join('&nbsp;&nbsp; | &nbsp;&nbsp;')}
                </td>
                <td>Other</td>
                <td> 
                    <select name="pol" style="width:200px">
                    ${dataViewModel.polarity.map(item =>`<option value="${item.name}">${item.name}</option>`).join('')}
                    </select>
                </td>
            </tr>
             <tr>
                <td>       
                  <label>Bullet :</label>
                </td>
          
                <td>
                 <input type="radio" name="icon" value="bullet">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${bullets.map(item => ``+item).join('&nbsp;&nbsp; | &nbsp;&nbsp;')}
                </td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                 <td colspan="2" style="text-align:center"><button style="color:white" id="scoreButton">Save</button>  </td>
            <td colspan="2" style="text-align:center"><button style="color:white" id="variationButton">Save</button>  </td>
            </tr>
            </table>
            <br><hr><br>
           `;
  
            modalContent.append("div").attr("id","config").style("font-size","17px").html(html); 
            
        }
    }
}