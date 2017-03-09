

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
        public dataViewModel: ITableViewModel;
        private selectionManager: ISelectionManager;
        private host: IVisualHost;
        private settings: ISettings;
        private tableOptions: IOptions;
        private objects: any;
        private config: IConfig[];
        private json:boolean;
   
        /**
         * CONSTRUCTOR OF VISUAL
         */
        constructor(options: VisualConstructorOptions) {
            this.host = options.host;
            this.cleanConfig();
            this.cleanDataModel();
            
            this.target = d3.select(options.element);
            
            this.div = this.target.append('div')       //div to target table
                .classed('wrapper', true);
        }
        //###################### TEMP CONFIG JSON ############################################

        private parseConfig(): boolean {
            let obj;
            let valid :boolean;
            valid = false;
            if(this.tableOptions.columns == "{}"){return valid;}
            try {
                obj = JSON.parse(this.tableOptions.columns);
                
                for (let i = 0; i < obj.length; i++) {
                    this.config.push({
                        columnName:     obj[i].columnName,
                        typeColumn:     obj[i].typeColumn,
                        iconType:       obj[i].iconType,
                        visualValue:    obj[i].visualValue,
                        columnPolarity: obj[i].columnPolarity
                    });     
                }
                (this.config.length > 0) ? valid = true : valid = false;
                return valid;
            } catch (Error) { console.warn("json invalid!"); return valid; }
        }
        //#################################################################################
        /**
         * UPDATE OF VISUAL
         */
        public update(optionsUpdate: VisualUpdateOptions, optionsInit: VisualConstructorOptions) {
            this.host.persistProperties([{
                "removeObject":"color"
            }]);
            this.objects = optionsUpdate.dataViews[0].metadata.objects;
            this.setSettings();
            this.json = this.parseConfig();
            this.cleanDataModel();
            this.parseData(optionsUpdate.dataViews);
            this.drawTable(optionsInit);
            this.updateContainerViewports(optionsUpdate.viewport);
            STYLE.Customize.setZoom(this.target, this.tableOptions.zoom);
            STYLE.Customize.setColor(this.tHead, this.tableOptions.color);
            this.cleanConfig();
        }
        /**
         * clean config
         */
        private cleanConfig() {
            this.config =[];
        }
        /**
         * clear data model
         */
        private cleanDataModel() {
            this.dataViewModel = {
                columns: [],
                values: []
            };
        }
        //temp for json
        private getColumnIdByName(name: string,num:number) {

          for(let i = 0; i < num; i++){
              if(name.toUpperCase() == this.dataViewModel.columns[i].name.toUpperCase()){ return i;}
          }
          this.json = false;
          return -1;
        }
        /**
         * parse data
         */
        @logExceptions()
        private parseData(dataViews: DataView[]) {

            //valid? // division 0
            if (!dataViews
                || !dataViews[0]
                || !dataViews[0].table
                || !dataViews[0].table.rows
                || !dataViews[0].table.columns)
                return;

            let rows = dataViews[0].table.columns;
            let values = dataViews[0].table.rows;
            let conf = this.config;
            let confLength = this.config.length;
            if (rows && values) {

                let rowsLength = rows.length;
                let valuesLenght = values.length;
                var score, item, iconType, type;
                let row: IRows = { row: [], id: 0 };
                
                //set names of collumns
                for (let j = 0; j < rowsLength; j++) {
                    this.dataViewModel.columns.push({
                        name: rows[j].displayName,
                        iconType: IconType.TEXT,
                        type: Type.NOTHING,
                        icon:[]
                    });
                }
                //####################### TEMP ##########################
                
                if (this.json) {
                   var id;
                    for (let c = 0; c < confLength; c++) {
                         id = this.getColumnIdByName(conf[c].columnName,rowsLength);
                         //if(id == -1){break;}
                        if (conf[c].typeColumn.toUpperCase() == "SCORE") {
                            try{
                                this.dataViewModel.columns[id].icon = this.getIcons(conf[c].iconType);
                                this.dataViewModel.columns[id].type = Type.SCORE;
                                switch(conf[c].visualValue.toUpperCase()){
                                    case 'ICON':
                                        this.dataViewModel.columns[id].iconType = IconType.ICON;
                                        break;
                                    case 'ICONTEXT' :
                                        this.dataViewModel.columns[id].iconType = IconType.ICONTEXT;
                                        break;
                                    default : 
                                          this.dataViewModel.columns[id].iconType = IconType.TEXT;
                                           
                                }
                                
                            }catch(Error){}
                            
                        } else {
                            this.dataViewModel.columns[id].type = Type.VARIATION;
                        }
                    }
                }
                
                
               //####################### TEMP ##########################
                //set values of rows
                for (let i = 0; i < valuesLenght; i++) {
                    row.id = <number>i;
                    for (var k = 0; k < rowsLength; k++) {
                        item = values[i][k];
                        if (item != null) { //null itens
                            type = this.dataViewModel.columns[k].type;
                            //type score
                            if (type == Type.SCORE) {
                                iconType = this.dataViewModel.columns[k].iconType;
                                score = COMMON.Core.getScore(+item);
                                if (iconType == IconType.ICON) {

                                    row.row[k] = this.dataViewModel.columns[k].icon[score];

                                } else if (iconType == IconType.ICONTEXT) {
                                    row.row[k] = COMMON.Core.formatNumber(<any>item)
                                        + " " + this.dataViewModel.columns[k].icon[score];
                                } else { //only text
                                    row.row[k] = <any>item;
                                }
                            } else if (type == Type.VARIATION) { //type variation
                                try {
                                    //row.polarity = <number>this.config.polarity[i]; //get polarity
                                    row.row[k] = <any>item;
                                } catch (Error) { 
                                    row.row[k] = <any>item;
                                    //console.error("error json config");
                                 }

                            } else {
                                row.row[k] = <any>item;
                            }
                        }//end id nulls
                    }//end for    
                    this.dataViewModel.values.push(row);
                    row = { row: [], id: 0};
                }//end for 
            }//end if
        }//end method 

        /**
         * draw table to my target
         */
        @logExceptions()
        private drawTable(options: VisualConstructorOptions) {

            if (this.dataViewModel.columns.length < 1) { return; }

            //if exists, remove existing table
            this.target.select('table').remove();
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
                    if (d.type == Type.VARIATION) {
                        return COMMON.Core.getVariation(d.value, d.polarity);
                    }
                })
                .html(function (d) { return COMMON.Core.formatNumber(<any>d.value); });

        }
        /**
         * get my colletion of icons
         */
        private getIcons(name: string): string[] {
            try {
                return ICON.ShapeFactory.getShape(name);
            } catch (Error) {
                return ICON.ShapeFactory.getShape("ARROW");
            }
            
        }
        /**
         * update viewport's
         */
        private updateContainerViewports(viewport: IViewport) {
            if (!viewport) return;
            let width = viewport.width - 0.1;
            let height = viewport.height - 0.1;

            this.table.attr('width', width);
            this.table.attr('height', height);
        }

        /**
         * Enumerates through the objects defined in the capabilities and adds the properties to the format pane
         *
         * @function
         * @param {EnumerateVisualObjectInstancesOptions} options - Map of defined objects
         */
        @logExceptions()
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
                            kpi:_.kpi,
                            icon:_.icon
                        },
                        selector: null
                    });
                    break;
                case 'TableOptions':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            zoom: _.zoom,
                            color:_.color
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
         * DESTROY 
         */
        public destroy() { }

    }
}