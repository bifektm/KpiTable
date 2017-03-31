

module powerbi.extensibility.visual.PBI_CV_19182E25_A94F_4FFD_9E99_89A73C9944FD  {

    export class Visual implements IVisual {

        /**
         * VARS
         */
        private target: d3.Selection<HTMLElement>;
        private table: d3.Selection<HTMLElement>;
        private tHead: d3.Selection<HTMLElement>;
        private tBody: d3.Selection<HTMLElement>;
        private div: d3.Selection<HTMLElement>;
        private modal: d3.Selection<HTMLElement>;
        private modalContent: d3.Selection<HTMLElement>;
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

            //
            this.modal = this.div.append('div').classed('modal', true);
            this.modalContent = this.modal.append("div").classed("modal-content", true);
            this.modalContent.append("div").classed('bar', true).text("Config Columns")
                .append("span").classed('close', true).html('&times;');
            this.modalContent.append("div").attr("id", "config").html('<br>');
            this.modalContent.append("div").html("SCORE").style("float", "left").style("width", "50%");
            this.modalContent.append("div").html("VARIATION");
            Visual.config = [];
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
                    console.log(Visual.config.length);
                    if(Visual.config.length ==0){
                         Visual.config = JSON.parse(getValue(this.dataview.metadata.objects, "kPIMeasures", "config", "[]"));
                    }
                       
                   
                    // Visual.config = COMMON.Core.getConfig(optionsUpdate.dataViews);                
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
                d3.select(".select-table" + (this.rowSelected)).style("background-color", "white");
            }
            
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




        }
        /**
         * popup configs
         */
        private configPopup(optionsUpdate: VisualUpdateOptions) {
            let colOther, iconType, colName;


            d3.select("button[id='scoreButton']").on('click', function () {

                console.log("click");
                let icon = d3.select("input[name='icon']:checked").property("value");
                d3.select("select[name='typeIcon']").selectAll("option")
                    .filter(function (d, i) {
                        if (this.selected) {
                            iconType = this.value;
                            return this.value;
                        }
                    });
                d3.select("select[name='cols'] ")
                    .selectAll("option")
                    .filter(function (d, i) {
                        if (this.selected) {
                            colName = this.value;
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

                console.log(JSON.stringify(Visual.config));

                    this.parseData();

                    this.tableStyling();

            }.bind(this));
            /*   d3.select("button[id='variationButton']").on('click', function () {
   
                   d3.select("select[name='colsV']").selectAll("option")
                       .filter(function (d, i) {
                           if (this.selected) {
                               colOther = this.value;
                               return this.value;
                           }
                       });
                   d3.select("select[name='pol'] ")
                       .selectAll("option")
                       .filter(function (d, i) {
                           if (this.selected) {
                               colName = this.value;
                               return this.value;
                           }
                       });
                   Visual.config.push({
                       columnName: colOther,
                       typeColumn: "VARIATION",
                       iconType: "",
                       visualValue: "",
                       columnPolarity: colName
                   });
               });*/

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
            let row = this.dataview.categorical.categories[0];
            //insert header row
            this.dataViewModel.columns.push({
                name: row.source.displayName,
                iconType: strucData.IconType.TEXT,
                type: strucData.Type.NOTHING,
                icon: [],
                polarityColumn: ""
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
            let row = { id: null, polarity: 1, row: [] };
            let i = 0, j = 0;

            if (!data) {
                indicator.forEach(item => {
                    row = { id: null, polarity: 1, row: [] };
                    row.row.push(item);
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
                    if (polarity.length < 1) { //TODO
                        polarity = [{ name: "", values: [] }];
                    }
                    row = { id: null, polarity: polarity[0].values[j], row: [] };
                    row.row.push(indicator[j]);
                    row.id = j;
                    this.selectionIds[indicator[j]] = this.host.createSelectionIdBuilder()
                        .withCategory(this.dataview.categorical.categories[0], j)
                        .createSelectionId();

                }

                type = this.dataViewModel.columns[(i % colsLenght) + 1].type;
                row.row.push(
                    this.setConfigRows(type, item.values[j], (i % colsLenght) + 1)
                );
                if (i % colsLenght == colsLenght - 1) {

                    this.dataViewModel.values.push(row);
                    j++;
                }
                i++;
            });
        }
        private setConfigRows(type: any, value: any, k: number) {

            let score, iconType;
            if (type == strucData.Type.SCORE) { //SCORE
                iconType = this.dataViewModel.columns[k].iconType;
                score = COMMON.Core.getScore(+value);

                if (iconType == strucData.IconType.ICON) {

                    value = this.dataViewModel.columns[k].icon[score];

                } else if (iconType == strucData.IconType.ICONTEXT) {

                    value = COMMON.Core.formatNumber(<any>value)
                        + " " + this.dataViewModel.columns[k].icon[score];
                } else {
                    return value;
                }
            } else if (type == strucData.Type.VARIATION) { //type variation
                return value;
            } else {
                return value;
            }
            return value;
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
                            return { column: column, value: row.row[i], type: column.type, polarity: row.polarity, id: row.id };
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
                this.selectionManager.select(this.selectionIds[d.row[0]]).then((ids: ISelectionId[]) => {
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

            let objectName = options.objectName;
            let objectEnumeration: VisualObjectInstance[] = [];
            let objectEnumeration1: VisualObjectInstance[] = [];
            // var metadataColumns: DataViewMetadataColumn[] = this.dataview.metadata.columns;
            var _ = this.tableOptions;

            switch (objectName) {
                case 'kPIMeasures':

                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            config: JSON.stringify(Visual.config)
                        },
                        selector: null
                    });

                    break;
                /*case 'TableOptions':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            fontSize: _.fontSize,
                            color: _.color
                        },
                        selector: null
                    });
                    break;*/

            };
            /*let foo: VisualObjectInstance = {

                objectName: "kPIMeasures",
                properties: {
                    config: JSON.stringify(Visual.config)
                },
                selector: null
            }

            objectEnumeration1.push(foo);

            let propertToChange: VisualObjectInstancesToPersist = {
                merge: objectEnumeration1
            }
            this.host.persistProperties(objectEnumeration1);*/

            console.log("now" + JSON.stringify(objectEnumeration));

            //console.log(objectEnumeration[0].objectName['kPIMeasures1'].properties['config1']);



            return objectEnumeration;
        }

        /**
        * styling table
        */
        private tableStyling() {

            this.tableOptions = {
                fontSize: getValue(this.dataview.metadata.objects, "TableOptions", "fontSize", 20),
                config: "[]",//getValue(this.dataview.metadata.objects, "kPIMeasures", "config", JSON.stringify(Visual.config)),
                color: getValue<Fill>(this.dataview.metadata.objects, "TableOptions", "color", { solid: { color: "#178BCA" } }).solid.color
            };
            STYLE.Customize.setZoom(this.target, this.tableOptions.fontSize);
            STYLE.Customize.setColor(this.tHead, this.tableOptions.color);
            //console.log("vvv"+this.tableOptions.config);
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