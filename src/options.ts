declare module STYLE { }
module STYLE {

    export class Customize {

        /**
         * check icon -> styling
         */
        static isIcon(cell: string): boolean {
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
                    tHead.selectAll('th').style("background-color", "#015c55");
                } else {
                    tHead.selectAll('th').style("background-color", color);
                }
            }
        }
        /**
         * set color font
         */
        static setColorFont(tHead: d3.Selection<HTMLElement>, color: any) {
            if (tHead) {
                if (color == undefined || color == null) {
                    tHead.selectAll('th').style("color", "white");
                } else {
                    tHead.selectAll('th').style("color", color);
                }
            }
        }
        /**
        * set size font rows
        */
        static setSizerFont(tBody: d3.Selection<HTMLElement>, num: any) {
            if (tBody) {
                if (num == undefined || num == null) {
                    tBody.selectAll('td').style("font-Size", 16 + "px");
                    d3.selectAll('svg').attr("width", 16).attr("height", 16);
                } else {
                    tBody.selectAll('td').style("font-Size", num + "px");
                    d3.selectAll('svg').attr("width", num).attr("height", num);
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
        static setRowBackground(tBody: d3.Selection<HTMLElement>, color: any) {
            if (tBody) {
                if (color == undefined || color == null) {
                    tBody.selectAll('td').style("background-color", "black");
                } else {
                    tBody.selectAll('td').style("background-color", color);
                }
            }
        }
        /**
         * event score
         */
        private static eventScore() {
            d3.select("select[name='typeIcon']").on("change", function (d, i) {
                let bullets = ICON.ShapeFactory.getShape("BULLET");
                d3.select(".preview").selectAll("*").remove();
                d3.select(".preview").append("label").text("Preview :");
                if (this.value == "icon") {
                    d3.select(".preview").append("span").html(bullets.map(item => `` + item).join('&nbsp;&nbsp;&nbsp;&nbsp;'));
                } else if (this.value == "icontext") {
                    d3.select(".preview").append("span").html(bullets.map(item => `55&nbsp;&nbsp;` + item).join('&nbsp;&nbsp;&nbsp;&nbsp;'));
                } else {
                    d3.select(".preview").selectAll("*").remove();
                }
            });
        }
        /**
         * maping config columns
         * @param dataViewModel 
         */
        static changeType(dataViewModel: any) {
            let typeCol;
            d3.select("select[name='typeCol']")
                .selectAll("option")
                .filter(function (d, i) {
                    if (this.selected) {
                        typeCol = this.value;
                        return this.value;
                    }
                });
            d3.select(".custtom").selectAll("*").remove();
            d3.select(".preview").selectAll("*").remove();
            if (typeCol == "score") {

                d3.select(".custtom").append("label").text("Type Icon :");
                d3.select(".custtom").append("select").property("name", "typeIcon")
                    .style("width", "100%").style("font-size", "10px");
                d3.select(".custtom select").append('option').property("value", "icon").text("Icon");
                d3.select(".custtom select").append('option').property("value", "icontext").text("Icon-text");
                this.eventScore();

            } else if (typeCol == "variation") {
                let arrow = ICON.ShapeFactory.getShape("ARROW");
                d3.select(".custtom").append("label").text("Other :");
                d3.select(".custtom").append("select").property("name", "polarity")
                    .style("width", "100%").style("font-size", "10px");

                d3.select("select[name='polarity']").html(`${dataViewModel.polarity.map(item => `<option value="${item.name}">${item.name}</option>`).join('')}`);
                d3.select("select[name='polarity']").append('option').property("value", "1").text("Ascending");
                d3.select("select[name='polarity']").append('option').property("value", "0").text("Descending");
                d3.select(".preview").selectAll("*").remove();
                d3.select(".preview").append("label").text("Preview :");
                d3.select(".preview").append("span").html(arrow.map(item => `55&nbsp;&nbsp;` + item).join('&nbsp;&nbsp;&nbsp;&nbsp;'));
            } else if(typeCol == "comparison"){
                let arrow = ICON.ShapeFactory.getShape("ARROW");
                d3.select(".custtom").append("label").text("Compare to :");
                d3.select(".custtom").append("select").property("name", "compare")
                    .style("width", "100%").style("font-size", "10px");
                d3.select("select[name='compare']").html(`${dataViewModel.columns.filter(function (d, i) { return i != 0; }).map(item => `<option value="${item.name}">${item.name}</option>`).join('')}`);
                d3.select(".preview").selectAll("*").remove();
                d3.select(".preview").append("label").text("Preview :");
                d3.select(".preview").append("span").html(arrow.map(item => `55&nbsp;&nbsp;` + item).join('&nbsp;&nbsp;&nbsp;&nbsp;'));    
            }else {
                d3.select(".custtom").selectAll("*").remove();
                d3.select(".preview").selectAll("*").remove();

            }

        }
        /**
         * set avaiable configs
         * @param dataViewModel 
         * @param config 
         */
        static setConfigEvents(dataViewModel: any, config: any) {
            let colName, setting;
            d3.select(".custtom").selectAll("*").remove();
            d3.select(".preview").selectAll("*").remove();
            d3.select("select[name='typeCol']").property("value", "none");
            d3.select("select[name='cols'] ")
                .selectAll("option")
                .filter(function (d, i) {
                    if (this.selected) {
                        colName = this.value;
                        return this.value;
                    }
                });

            setting = _.findWhere(config, { columnName: colName });
            d3.select(".config").remove();
            //preview config
            if (setting != undefined) {
                d3.select("fieldset .conf").append("span").classed("config", true).text("*");
                d3.select("select[name='typeCol']").property("value", setting.typeColumn.toLowerCase());

                if (setting.typeColumn.toLowerCase() == "score") {
                    let bullets = ICON.ShapeFactory.getShape("BULLET");
                    d3.select(".custtom").append("label").text("Type Icon :");
                    d3.select(".custtom").append("select").property("name", "typeIcon")
                        .style("width", "100%").style("font-size", "10px");

                    d3.select(".custtom select").append('option').property("value", "icon").text("Icon");
                    d3.select(".custtom select").append('option').property("value", "icontext").text("Icon-text");
                    d3.select("select[name='typeIcon']").property("value", setting.visualValue.toLowerCase());
                    d3.select(".preview").selectAll("*").remove();
                    d3.select(".preview").append("label").text("Preview :");

                    if (setting.visualValue.toLowerCase() == "icon") {

                        d3.select(".preview").append("span").html(bullets.map(item => `` + item).join('&nbsp;&nbsp;&nbsp;&nbsp;'));
                    } else if (setting.visualValue.toLowerCase() == "icontext") {

                        d3.select(".preview").append("span").html(bullets.map(item => `55&nbsp;&nbsp;` + item).join('&nbsp;&nbsp;&nbsp;&nbsp;'));
                    } else {
                        d3.select(".preview").selectAll("*").remove();
                    }
                    this.eventScore();
                } else if (setting.typeColumn.toLowerCase() == "variation") {
                    let bulletWhite = ICON.ShapeFactory.getShape("BulletWhite");
                    d3.select(".custtom").append("label").text("Other :");
                    d3.select(".custtom").append("select").property("name", "polarity")
                        .style("width", "100%").style("font-size", "10px").append('option').property("value", "").text("");
                    d3.select("select[name='polarity']").html(`${dataViewModel.polarity.map(item => `<option value="${item.name}">${item.name}</option>`).join('')}`);
                    d3.select("select[name='polarity']").append('option').property("value", "1").text("Ascending");
                    d3.select("select[name='polarity']").append('option').property("value", "0").text("Descending");
                    d3.select("select[name='polarity']").property("value", setting.columnPolarity); 
                    d3.select(".preview").selectAll("*").remove();
                    d3.select(".preview").append("label").text("Preview :");
                    d3.select(".preview").append("span").html(bulletWhite.map(item => `55&nbsp;&nbsp;` + item).join('&nbsp;&nbsp;&nbsp;&nbsp;'));
                } else { }

            }
        }
        /**
         * events
         * @param mode 
         * @param Option 
         * @param div 
         */
        static events(mode: number, Option: d3.Selection<HTMLElement>, div: d3.Selection<HTMLElement>) {
            if (mode == 0) {
                Option.style("display", "none");
                d3.select('.edit').style("display", "none");
                div.on("mouseout", null);
                div.on("mouseover", null);
            } else {
                div.on("mouseover", function () {
                    d3.select('.edit').style("display", "block");
                });
                div.on("mouseout", function () {
                    d3.select('.edit').style("display", "none");
                });
            }
            d3.select('.close1').on('click', function () {
                Option.style("display", "none");

            }.bind(this));
            d3.select(".edit").on('click', function () {
                Option.style("display", "block");
            }.bind(this));
        }
        /**
         * options
         * @param container 
         * @param dataViewModel 
         */
        static setHTML(container: d3.Selection<HTMLElement>, dataViewModel: strucData.ITableViewModel) {
            let html;
            container.select(".container").remove();
            html = `
              <fieldset>
                  <p>
                  <label class="conf">Columns:</label>
                  <select name="cols" size="1" class="dropdown">
                    ${dataViewModel.columns.filter(function (d, i) { return i != 0; }).map(item => `<option value="${item.name}">${item.name}</option>`).join('')}
              </select>
                  </p>
                  <p>
                  <label>Type:</label>
                  <select name="typeCol" size="1" class="dropdown">
                    <option value="none">None</option>
                    <option value="score">Score</option>
                    <option value="variation">Variation</option>
                    <option value="comparison">Comparison</option>
                  </select>
                  </p>
                  <p class="custtom"></p>
                 <p class="preview"></p>
                  
              </fieldset>
              <button  id="resetButton" class="button">Reset</button>
              <button  id="configButton" class="button">Apply</button>
             `
            container.append('div').classed("container", true).html(html);
        }
    }
}