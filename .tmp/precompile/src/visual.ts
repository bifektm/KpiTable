

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
        public dataViewModel: strucData.ITableViewModel;
        private selectionManager: ISelectionManager;
        private host: IVisualHost;
        private tableOptions: strucData.IOptions;
        private objects: any;
        private config: strucData.IConfig[];
        private columnConfig:string;//temp
        private width:number;
        private height:number;
        private init: boolean = true;


        /**
         * CONSTRUCTOR OF VISUAL
         * @param options 
         */
        constructor(options: VisualConstructorOptions) {
            this.host = options.host;
            this.selectionManager = options.host.createSelectionManager();
            this.config = [];
            this.cleanDataModel();
            this.target = d3.select(options.element);
            this.div = this.target.append('div')       //div to target table
                .classed('wrapper', true);
            this.setSettings();
        }

        /**
         * UPDATE OF VISUAL
         * @param optionsUpdate 
         * @param optionsInit 
         */
        @logExceptions()
        public update(optionsUpdate: VisualUpdateOptions, optionsInit: VisualConstructorOptions) {

            if (this.init || (optionsUpdate.viewport.height == this.height && optionsUpdate.viewport.width == this.width)) {
                this.cleanDataModel();                                                                //clean dataModel                   
                this.objects = optionsUpdate.dataViews[0].metadata.objects;                           //get objects properties
                this.config = COMMON.Core.getConfig(optionsUpdate.dataViews);                         //get config columns
                this.setSettings();                                                                   //set settings to options
                this.parseData(optionsUpdate.dataViews);                                              //set data to my model
                this.drawTable(optionsInit);                                                          //draw table
                this.tableStyling();                                                                  //table style 
            }
            this.height = optionsUpdate.viewport.height;                                              //update height 
            this.width = optionsUpdate.viewport.width;                                                //update width
            if (this.init) { this.init = false; }                                                     //flag  prevent drawTable ever
        }

        /**
         * parse data to dataviewmodel
         * @param dataViews 
         */
        private parseData(dataViews: DataView[]) {

            //valid? // division 0? // exist?
            if (!dataViews
                || !dataViews[0]
                || !dataViews[0].table
                || !dataViews[0].table.rows
                || !dataViews[0].table.columns)
                return;

            let rows = dataViews[0].table.columns;
            let values = dataViews[0].table.rows;

            if (rows && values) {
                let rowsLength = rows.length;
                let valuesLenght = values.length;
                this.setHeadersInDataModel(rows);                          //set headers of collumns
                this.setConfigColumns();                                   //set config columns in dataview model
                this.setValuesInRows(values, valuesLenght, rowsLength);    //set values of rows
                
            }

        }

        /**
         * //set headers of collumns
         * @param rows 
         * @param rowsLength 
         */
        private setHeadersInDataModel(rows: any[]) {
            let data = [];
            let remove = false

            _.each(rows, item => {
                
                if (item.roles["config"] || item.roles["polarity"]) {
                    remove = true;
                } 
                this.dataViewModel.columns.push({
                    name: item.displayName,
                    iconType: strucData.IconType.TEXT,
                    type: strucData.Type.NOTHING,
                    icon: [],
                    polarityColumn: "",
                    polarityPositionId: null,
                    columnRemove:remove
                });
                !remove;
            });
        }
        /**
       * set config columns in dataview model
       * @param rowsLength 
       */
        private setConfigColumns() {
            let config = this.config;
            var id;
            if (config != null) {

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
                        this.dataViewModel.columns[id].polarityPositionId = _.findIndex(this.dataViewModel.columns, { name: item.columnPolarity });

                    } else { }
                });
            }
        }

        //set values of rows
        private setValuesInRows(values: any[], valuesLenght: number, rowsLength: number) {
            let score, item, iconType, type, polarityColId;
            let row: strucData.IRows = { row: [], id: 0, polarity: null };

            for (let i = 0; i < valuesLenght; i++) { //rows
                row.id = this.host.createSelectionIdBuilder()
                        .withMeasure(values[i][0])
                        .createSelectionId();

                for (var k = 0; k < rowsLength; k++) { //columns


                    item = values[i][k];

                    type = this.dataViewModel.columns[k].type; // get type of column (Score/variation)

                    if (type == strucData.Type.SCORE) { //SCORE
                        iconType = this.dataViewModel.columns[k].iconType;
                        score = COMMON.Core.getScore(+item);
                        if (iconType == strucData.IconType.ICON) {

                            row.row[k] = this.dataViewModel.columns[k].icon[score];

                        } else if (iconType == strucData.IconType.ICONTEXT) {
                            row.row[k] = COMMON.Core.formatNumber(<any>item)
                                + " " + this.dataViewModel.columns[k].icon[score];
                        } else {
                            if (!this.dataViewModel.columns[k].columnRemove) {
                                row.row[k] = <any>item;
                            } 

                        }
                    } else if (type == strucData.Type.VARIATION) { //type variation
                        polarityColId = this.dataViewModel.columns[k].polarityPositionId;
                        row.polarity = values[i][polarityColId];
                        row.row[k] = <any>item;

                    } else {
                        if (!this.dataViewModel.columns[k].columnRemove) {
                            row.row[k] = <any>item
                        }
                    }

                }//end for

                this.dataViewModel.values.push(row);
                row = { row: [], id: 0, polarity: null };
                  
                
            }//end for 
            
        }

        /**
         * draw table to my target
         * @param options 
         */
        private drawTable(options: VisualConstructorOptions) {

            if (this.dataViewModel.columns.length < 1) { return; }

            //if exists, remove existing table
            this.target.select('table').remove();
            // get columns and values
            var columns = this.dataViewModel.columns.filter(function(col){
                if(!col.columnRemove) return col;
            }).map(function(col){return col;});
            
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


            var cells = rows.selectAll('td')
                .data(function (row) {
                    return columns.map(
                        function (column, i) {
                            return { column: column, value: row.row[i], type: column.type, polarity: row.polarity };
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
                    
                    if (d.type == strucData.Type.VARIATION) {
                        return COMMON.Core.getVariation(d.value, d.polarity);
                    }
                })
                .html(function (d) { 
                    return COMMON.Core.formatNumber(<any>d.value); 
                });

            rows.on('click', function (d) {

                this.selectionManager.clear();
                rows.attr("bgcolor", "#fff");
                //d3.select(this).attr("bgcolor","red");

                // console.log(JSON.stringify(d["row"][0]));

                //console.log(d.id);

                // Find the selectionId and select it

                this.selectionManager.select(d.id).then((ids: ISelectionId[]) => {
                    ids.forEach(function (id) {
                        // console.log("foo: "+JSON.stringify(id));
                    });
                });

                // This call applys the previously selected selectionId
                this.selectionManager.applySelectionFilter();

            }.bind(this));

        }

        /**
         * Enumerates through the objects defined in the capabilities and adds the properties to the format pane
         * @param  options - Map of defined objects
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {

            let objectName = options.objectName;
            let objectEnumeration: VisualObjectInstance[] = [];
            var _ = this.tableOptions;

            switch (objectName) {
                case 'kPIMeasures':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            collumns: _.columns,
                            kpi: _.kpi,
                            icon: _.icon
                        },
                        selector: null
                    });
                    break;
                case 'TableOptions':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            zoom: _.zoom,
                            color: _.color
                        },
                        selector: null
                    });
                    break;

            };

            return objectEnumeration;
        }

        /**
         * set settings in options
         */
        //_.color.solid.color
        private setSettings() {

            this.tableOptions = {
                zoom: getValue(this.objects, "TableOptions", "zoom", 20),
                kpi: getValue(this.objects, "kPIMeasures", "kpi", 0),
                columns: getValue(this.objects, "kPIMeasures", "collumns", "{}"),
                icon: getValue(this.objects, "kPIMeasures", "icon", "text"),
                color: getValue(this.objects, "TableOptions", "color", "#015c55")
            };
            // console.log(JSON.stringify(this.tableOptions));  

        }
        /**
        * styling table
        */
        private tableStyling() {
            STYLE.Customize.setZoom(this.target, this.tableOptions.zoom);
            STYLE.Customize.setColor(this.tHead, this.tableOptions.color);
        }
        /**
      * clear data model
      */
        private cleanDataModel() {
            this.dataViewModel = {
                columns: [],
                values: []
            };
            this.config = [];
            this.columnConfig = "";
        }
        /**
         * DESTROY 
         */
        public destroy() { }

    }
}