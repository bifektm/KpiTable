

module powerbi.extensibility.visual {

    export class Visual implements IVisual {

        /**
         * VARS
         */
        private target: d3.Selection<HTMLElement>;
        private table: d3.Selection<HTMLElement>;
        private tHead: d3.Selection<HTMLElement>;
        private tBody: d3.Selection<HTMLElement>;
        private div: d3.Selection<HTMLElement>;
        public dataViewModel: strucData.ITableViewModel;
        private selectionManager: ISelectionManager;
        private host: IVisualHost;
        private tableOptions: strucData.IOptions;
        private static config: strucData.IConfig[];
        private width: number;
        private height: number;
        private init: boolean = true;
        private dataview: DataView;
        private selectionIds: any = {};
        private select: boolean = false;
        private rowSelected: number;
        private containerOption: d3.Selection<HTMLElement>;
        private Option: d3.Selection<HTMLElement>;



        /**
         * CONSTRUCTOR OF VISUAL 
         */
        constructor(options: VisualConstructorOptions) {
            this.host = options.host;
            this.target = d3.select(options.element);
            this.selectionManager = options.host.createSelectionManager();
            this.cleanDataModel();
            this.InitconfigHTML();
            console.log("cons");
            Visual.config = [];
        }
        /**
         * init html and events
         */
        private InitconfigHTML() {

            this.div = this.target.append('div')
                .classed('wrapper', true);

            this.div.append('div').classed('edit', true);
            //
            this.Option = this.div.append('div').classed('option', true);
            this.containerOption = this.Option.append('div').classed("header", true).text("Config Columns")
                .append("span").classed('close1', true).html('&times;');
            this.Option.append("div").classed("container", true);
        }

        /**
         * UPDATE OF VISUAL  
         */
        @logExceptions()
        public update(optionsUpdate: VisualUpdateOptions) {
            console.log("update");

            this.events(optionsUpdate.viewMode);
            if (this.init || (optionsUpdate.viewport.height == this.height && optionsUpdate.viewport.width == this.width)) {
                if (optionsUpdate.dataViews[0]) {
                    this.dataview = optionsUpdate.dataViews[0];
                    if (Visual.config.length == 0) {
                        try {
                            if (COMMON.Core.getConfig(optionsUpdate.dataViews).length == 0) {
                                Visual.config = JSON.parse(getValue(this.dataview.metadata.objects, "TableOptions", "config", "[]"));
                            } else {
                                Visual.config = COMMON.Core.getConfig(optionsUpdate.dataViews);
                            }
                        } catch (Error) {
                            Visual.config = [];
                        }
                    }
                    this.parseData();
                    this.tableStyling();
                    STYLE.Customize.setHTML(this.Option, this.dataViewModel);
                    this.configPopup(optionsUpdate);
                }
            }

            this.height = optionsUpdate.viewport.height;                                              //update height 
            this.width = optionsUpdate.viewport.width;                                                //update width
            if (this.init) { this.init = false; }
            //flag  prevent drawTable ever
            this.cleanDataModel();
            if (this.select) {                                                                          //select manager
                d3.selectAll(".fixed_headers tr").classed("select-table", true);
                d3.select(".select-table" + (this.rowSelected)).style("font-weight", "bold").classed("select-table", false);
            }
            d3.select("select[name='typeCol']").on("change", this.changeType);
            d3.select("select[name='cols']").on("change", this.setConfigEvents);

        }
        private events(mode: number) {
            if (mode == 0) {
                this.Option.style("display", "none");
                d3.select('.edit').style("display", "none");
                this.div.on("mouseout", null);
                this.div.on("mouseover", null);
            } else {
                this.div.on("mouseover", function () {
                    d3.select('.edit').style("display", "block");
                });
                this.div.on("mouseout", function () {
                    d3.select('.edit').style("display", "none");
                });
            }
            d3.select('.close1').on('click', function () {
                this.Option.style("display", "none");

            }.bind(this));
            d3.select(".edit").on('click', function () {
                this.Option.style("display", "block");
            }.bind(this));

            //  d3.select("select[name='typeCol']").on("change", this.changeType);


        }
        private changeType() {
            let typeCol;
            d3.select("select[name='typeCol']")
                .selectAll("option")
                .filter(function (d, i) {
                    if (this.selected) {
                        typeCol = this.value;
                        return this.value;
                    }
                });

            if (typeCol == "score") {
                d3.select("select[name='polarity']").property("disabled", true);
                d3.select("select[name='typeIcon']").property("disabled", false);
                d3.select("input[id='bullet']").property("disabled", false);
                d3.select("input[id='arrow']").property("disabled", false);
            } else if (typeCol == "variation") {
                d3.select("select[name='polarity']").property("disabled", false);
                d3.select("select[name='typeIcon']").property("disabled", true);
                d3.selectAll("input[id='bullet']").property("disabled", true);
                d3.select("input[id='arrow']").property("disabled", true);
            } else {
                d3.select("select[name='polarity']").property("disabled", true);
                d3.select("select[name='typeIcon']").property("disabled", true);
                d3.selectAll("input[id='bullet']").property("disabled", true);
                d3.select("input[id='arrow']").property("disabled", true);
            }
        }
        private setConfigEvents() {
            let col, setting;
            d3.select("select[name='cols']")
                .selectAll("option")
                .filter(function (d, i) {
                    if (this.selected) {
                        col = this.value;
                        return this.value;
                    }
                });
            setting = _.findWhere(Visual.config, { columnName: col });
            if (setting != undefined) {
                d3.select("select[name='typeCol']").property("value", setting.typeColumn.toLowerCase());
            }

        }
        /**
         * popup configs
         */
        private configPopup(optionsUpdate: VisualUpdateOptions) {
            let colOther, iconType, colName, typeCol;

            d3.select("button[id='configButton']").on('click', function () {

                d3.select("select[name='cols'] ")
                    .selectAll("option")
                    .filter(function (d, i) {
                        if (this.selected) {
                            colName = this.value;
                            return this.value;
                        }
                    });

                d3.select("select[name='typeCol']")
                    .selectAll("option")
                    .filter(function (d, i) {
                        if (this.selected) {
                            typeCol = this.value;
                            return this.value;
                        }
                    });

                let icon = d3.select("input[name='icon']:checked").property("value");
                let id = _.findIndex(Visual.config, { columnName: colName });

                if (typeCol == "variation") {
                    if (id != -1) { Visual.config.splice(id, 1) };

                    d3.select("select[name='polarity']").selectAll("option")
                        .filter(function (d, i) {
                            if (this.selected) {
                                colOther = this.value;
                                return this.value;
                            }
                        });
                    Visual.config.push({
                        columnName: colName,
                        typeColumn: "VARIATION",
                        iconType: "",
                        visualValue: "",
                        columnPolarity: colOther
                    });

                } else if (typeCol == "score") {
                    if (id != -1) { Visual.config.splice(id, 1) };

                    d3.select("select[name='typeIcon']").selectAll("option")
                        .filter(function (d, i) {
                            if (this.selected) {
                                iconType = this.value;
                                return this.value;
                            }
                        });
                    Visual.config.push({
                        columnName: colName,
                        typeColumn: "SCORE",
                        iconType: icon,
                        visualValue: iconType,
                        columnPolarity: ""
                    });

                } else { if (id != -1) { Visual.config.splice(id, 1) }; }


                this.enumerateObjectInstances({ objectName: "TableOptions" });
                this.update(optionsUpdate);

            }.bind(this));
        }
        /**
         * parse data to dataviewmodel 
         */
        private parseData() {

            //valid?  // exist?
            if (!this.dataview
                || !this.dataview.categorical
                || !this.dataview.categorical.categories
            )
                return;

            this.setHeaders();                                  //set headers of collumns
            this.setConfigColumns();                            //set config columns in dataview model
            this.setRows();                                     //set values of rows
            this.drawTable();                                   //draw table
        }

        /**
         * set headers of collumns 
         */
        private setHeaders() {

            let data = this.dataview.categorical.values;
            let rows = this.dataview.categorical.categories;
            //insert header row
            rows.forEach(item => {
                if (item.source.roles["rows"]) {
                    this.dataViewModel.columns.push({
                        name: item.source.displayName,
                        iconType: strucData.IconType.TEXT,
                        type: strucData.Type.NOTHING,
                        icon: [],
                        polarityColumn: ""
                    });
                }

            });


            if (!data) { return; }
            //insert header values
            data.forEach(item => {
                if (_.findIndex(this.dataViewModel.columns, { name: item.source.displayName }) < 0) {

                    this.dataViewModel.columns.push({
                        name: item.source.displayName,
                        iconType: strucData.IconType.TEXT,
                        type: strucData.Type.NOTHING,
                        icon: [],
                        polarityColumn: ""
                    });
                }
            });

        }
        /**
         * get values 
         */
        private setRows() {
            let data = this.dataview.categorical.values;
            let indicator = COMMON.Core.getIndicator(this.dataview.categorical.categories);
            let polarity = COMMON.Core.getPolarity(this.dataview.categorical.categories);
            this.dataViewModel.polarity = polarity;
            let colsLenght = this.dataViewModel.columns.length - 1;//4
            let type;
            let row = { id: null, row: [] };
            let i = 0, j = 0, pol, other;

            if (!data) {
                indicator.forEach(item => {
                    row = { id: null, row: [] };
                    row.row.push({ value: item, polarity: 1 });
                    row.id = j;
                    this.selectionIds[item] = this.host.createSelectionIdBuilder()
                        .withCategory(this.dataview.categorical.categories[0], j)
                        .createSelectionId();
                    this.dataViewModel.values.push(row);
                    j++;
                });
                return;
            }
            j = 0;
            let rowsLength = data.length / colsLenght;//8
            data.forEach(item => {

                if (i % colsLenght == 0) {
                    if (polarity.length < 1) {
                        polarity = [{ name: "", values: [] }];
                    }

                    row = { id: null, row: [] };
                    row.row.push({ value: indicator[j], polarity: 1 });
                    row.id = j;
                    this.selectionIds[indicator[j]] = this.host.createSelectionIdBuilder()
                        .withCategory(this.dataview.categorical.categories[0], j)
                        .createSelectionId();

                }
                pol = _.findIndex(this.dataViewModel.polarity, { name: this.dataViewModel.columns[(i % colsLenght) + 1].polarityColumn });
                type = this.dataViewModel.columns[(i % colsLenght) + 1].type;
                if (pol != -1) {

                    other = polarity[pol].values[j];
                }
                row.row.push(
                    this.setConfigRows(type, item.values[j], (i % colsLenght) + 1, other)
                );
                if (i % colsLenght == colsLenght - 1) {
                    this.dataViewModel.values.push(row);
                    j++;
                }
                i++;
            });

        }
        /**
         * config valid value
         */
        private setConfigRows(type: any, value: any, k: number, pol: any) {

            let score, iconType;
            let row = { value: null, polarity: 1 };
            if (type == strucData.Type.SCORE) { //SCORE
                iconType = this.dataViewModel.columns[k].iconType;
                score = COMMON.Core.getScore(+value);

                if (iconType == strucData.IconType.ICON) {

                    row.value = this.dataViewModel.columns[k].icon[score];

                } else if (iconType == strucData.IconType.ICONTEXT) {

                    row.value = COMMON.Core.formatNumber(<any>value)
                        + " " + this.dataViewModel.columns[k].icon[score];
                } else {
                    row.value = value;
                }
            } else if (type == strucData.Type.VARIATION) { //type variation
                row.value = value;
                row.polarity = pol;
            } else {
                row.value = value;
            }
            return row;
        }
        /**
       * set config columns in dataview model 
       */
        private setConfigColumns() {
            let config = Visual.config;
            var id;

            if (config.length > 0) {

                _.each(config, item => {

                    id = _.findIndex(this.dataViewModel.columns, { name: item.columnName });
                    if (id == -1) { return; }
                    if (item.typeColumn.toUpperCase() == "SCORE") {
                        try {
                            this.dataViewModel.columns[id].icon = ICON.ShapeFactory.getShape(item.iconType);
                            this.dataViewModel.columns[id].type = strucData.Type.SCORE;

                            switch (item.visualValue.toUpperCase()) {
                                case 'ICON':
                                    this.dataViewModel.columns[id].iconType = strucData.IconType.ICON;
                                    break;
                                case 'ICONTEXT':
                                    this.dataViewModel.columns[id].iconType = strucData.IconType.ICONTEXT;
                                    break;
                                default:
                                    this.dataViewModel.columns[id].iconType = strucData.IconType.TEXT;
                                    break;
                            }

                        } catch (Error) { throw new Error("type column name no match"); }

                    } else if (item.typeColumn.toUpperCase() == "VARIATION") {
                        this.dataViewModel.columns[id].type = strucData.Type.VARIATION;
                        this.dataViewModel.columns[id].polarityColumn = item.columnPolarity;


                    } else { }
                });
            }


        }
        /**
         * draw table to my target 
         */
        private drawTable() {
            console.log("table");
            if (this.dataViewModel.columns.length < 1) { return; }

            //if exists, remove existing table
            this.target.select("table[class='fixed_headers']").remove();

            // get columns and values
            var columns = this.dataViewModel.columns;
            var values = this.dataViewModel.values;

            //init table
            this.table = this.div.append('table')
                .classed("fixed_headers", true);


            this.tHead = this.table.append('thead');


            this.tHead.selectAll('th').data(columns)
                .enter()
                .insert('th')
                .html(function (column) { return column.name; });
            this.tBody = this.table.append('tbody');

            var rows = this.tBody.selectAll("tr")
                .data(values)
                .enter()
                .append("tr")
                .attr("class", function (d, i) {
                    return "select-table" + i;
                });

            var cells = rows.selectAll('td')
                .data(function (row) {
                    return columns.map(
                        function (column, i) {
                            return { column: column, value: row.row[i].value, type: column.type, polarity: row.row[i].polarity, id: row.id };
                        });
                })
                .enter()
                .append('td')
                .style("text-align", function (d) {
                    if (STYLE.Customize.isIcon(d.value)) {
                        return "center";
                    }
                })
                .style('color', function (d) {

                    if (d.type == strucData.Type.VARIATION && d.polarity != undefined) {
                        return COMMON.Core.getVariation(d.value, d.polarity);
                    }
                })
                .html(function (d) {
                    return COMMON.Core.formatNumber(<any>d.value);
                });

            rows.on('click', function (d) {
                this.selectionManager.select(this.selectionIds[d.row[0].value]).then((ids: ISelectionId[]) => {
                    if (ids.length > 0) {
                        this.select = true;
                        this.rowSelected = d.id;
                    } else {
                        this.rowSelected = -1;
                        this.select = false;
                    }
                });

                this.selectionManager.applySelectionFilter();

            }.bind(this));

        }

        /**
         * Enumerates through the objects defined in the capabilities and adds the properties to the format pane
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            if (this.init) { return; }
            let objectName = options.objectName;
            let objectEnumeration: VisualObjectInstance[] = [];
            let objectEnumeration1: VisualObjectInstance[] = [];

            var _ = this.tableOptions;

            switch (objectName) {

                case 'TableOptions':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            fontSize: _.fontSize,
                            color: _.color,
                            config: "",
                            colorFont: _.colorFont
                        },
                        selector: null
                    });
                    break;
                case 'RowsFormatting':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            sizeFont: _.rowsFont,
                            fontFamily: _.rowsFamily,
                            rowcolor:_.rowsColor,
                            rowBackground:_.rowsBackground
                        },
                        selector: null
                    });
                    break;

            };
            let config: VisualObjectInstance = {

                objectName: "TableOptions",
                properties: {
                    config: JSON.stringify(Visual.config),
                    color: _.color,
                    fontSize: _.fontSize,
                    colorFont: _.colorFont
                },
                selector: null
            }
            objectEnumeration1.push(config);

            let propertToChange: VisualObjectInstancesToPersist = {
                merge: objectEnumeration1
            }
            this.host.persistProperties(objectEnumeration1);
            return objectEnumeration;
        }

        /**
        * styling table
        */
        private tableStyling() {

            this.tableOptions = {
                fontSize: getValue(this.dataview.metadata.objects, "TableOptions", "fontSize", 19),
                color: getValue<Fill>(this.dataview.metadata.objects, "TableOptions", "color", { solid: { color: "#178BCA" } }).solid.color,
                colorFont: getValue<Fill>(this.dataview.metadata.objects, "TableOptions", "colorFont", { solid: { color: "white" } }).solid.color,
                rowsFont: getValue(this.dataview.metadata.objects, "RowsFormatting", "sizeFont", 19),
                rowsFamily: getValue(this.dataview.metadata.objects, "RowsFormatting", "fontFamily", "Segoe UI Light"),
                rowsColor: getValue<Fill>(this.dataview.metadata.objects, "RowsFormatting", "rowcolor", { solid: { color: "black" } }).solid.color,
                rowsBackground :getValue<Fill>(this.dataview.metadata.objects, "RowsFormatting", "rowBackground", { solid: { color: "white" } }).solid.color
            };
            STYLE.Customize.setFontsize(this.tHead, this.tableOptions.fontSize);
            STYLE.Customize.setColor(this.tHead, this.tableOptions.color);
            STYLE.Customize.setColorFont(this.tHead, this.tableOptions.colorFont);
            STYLE.Customize.setSizerFont(this.tBody, this.tableOptions.rowsFont);
            STYLE.Customize.setFamily(this.tBody, this.tableOptions.rowsFamily);
            STYLE.Customize.setRowColor(this.tBody, this.tableOptions.rowsColor);
            STYLE.Customize.setRowBackground(this.tBody, this.tableOptions.rowsBackground);
        }
        /**
      * clear data model
      */
        private cleanDataModel() {
            this.dataViewModel = {
                columns: [],
                values: [],
                polarity: []
            };
        }
        /**
         * DESTROY 
         */
        public destroy() { console.log("destroy"); }

    }
}