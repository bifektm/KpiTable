

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
        private polarity;
        private columnConfig;//temp
        private removeColumnnId=[];
   
        /**
         * CONSTRUCTOR OF VISUAL
         * @param options 
         */
        constructor(options: VisualConstructorOptions) {
            this.host = options.host;
            this.selectionManager = options.host.createSelectionManager();
            this.config =[];
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
             this.cleanDataModel();                                    //clean dataModel
             var data = optionsUpdate.dataViews;                       //get dataViews
             this.polarity = this.getData(data);                       //get polarity
             this.objects = this.getObjects(optionsUpdate.dataViews);  //get objects properties
             this.config = this.getConfig(data);                       //get config columns
             this.columnConfig = this.getNameConfig(data)              //get column config             
             this.setSettings();                                       //set settings to options
             this.parseData(optionsUpdate.dataViews);                  //set data to my model
             this.drawTable(optionsInit);                              //draw table
             this.updateContainerViewports(optionsUpdate.viewport);    //update viewport
             this.tableStyling();                                      //table style 
             console.log(JSON.stringify(this.polarity));                                     
        }
        /**
         * get columns config
         * @param data 
         */
         private getConfig(data: any[]) {

             return COMMON.Core.getConfig(data[0].metadata.columns, data[0].table.rows);

         }
        /**
         * styling table
         */
        private tableStyling() {

            STYLE.Customize.setZoom(this.target, this.tableOptions.zoom);
            STYLE.Customize.setColor(this.tHead, this.tableOptions.color);

        }
        /**
         * get column config
         * @param data 
         */
        private getNameConfig(data: any[]){
            try{
                return <string>COMMON.Core.getNameColumnConfig(data[0].metadata.columns);
            }catch(Error){
                return "";
            }
            
        }
        /**
         * @param dataViews 
         */
        private getData(data: any[]){
            try{
                 return COMMON.Core.getPolarity(data[0].metadata.columns,<any>data[0].table.rows);
                 
             }catch(Error){return null;}
        }
       /** 
        * @param dataViews 
        */
        private getObjects(dataViews: any[]){
             try{
                 return dataViews[0].metadata.objects;
             }catch(Error){return null;}
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
            this.columnConfig = [];
        }
        /**
         * get column id in model by name
         * @param name 
         * @param num 
         */
        private getColumnIdByName(name: string,num:number) {

          for(let i = 0; i < num; i++){
              if(name.toUpperCase() == this.dataViewModel.columns[i].name.toUpperCase()){ return i;}
          }
          return -1;
        }
        /**
         * check existing polarity
         * @param name 
         */
        private checkPolarity(name:string){
            let exist = false;
            if(this.polarity == null){return exist;}
            for(let i = 0; i < this.polarity.length; i++){
                if(this.polarity[i].columnName == name){
                    return true;
                }
            }
            return exist;
        }
       
       /**
        * set config columns in dataview model
        * @param rowsLength 
        */
        private setConfigColumns() {
            let config = this.config;
            var id;
            if (config != null) {
                let confLength = this.config.length;
                
                for (let c = 0; c < confLength; c++) {
                    id = this.getColumnIdByName(config[c].columnName, this.dataViewModel.columns.length);
                    
                    if (config[c].typeColumn.toUpperCase() == "SCORE") {
                        try {
                            this.dataViewModel.columns[id].icon = this.getIcons(config[c].iconType);
                            this.dataViewModel.columns[id].type = strucData.Type.SCORE;
                            switch (config[c].visualValue.toUpperCase()) {
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

                        } catch (Error) {console.warn("column name no match") ;}

                    } else {
                        this.dataViewModel.columns[id].type = strucData.Type.VARIATION;
                    }
                }
            }
        }
        /**
         * //set headers of collumns
         * @param rows 
         * @param rowsLength 
         */
        private setHeadersInDataModel(rows:any[],rowsLength){
           
                for (let j = 0; j < rowsLength; j++) {
                     
                   if(this.checkPolarity(rows[j].displayName) || this.columnConfig == rows[j].displayName){
                       this.removeColumnnId.push(j);
                       continue;
                    }
                       this.dataViewModel.columns.push({
                            name: rows[j].displayName,
                            iconType: strucData.IconType.TEXT,
                            type: strucData.Type.NOTHING,
                            icon: []
                        });                       
                }
                
        }
        /**
         * get polarity id by column name
         * @param columnName 
         */
        private getPolarityIDByName(columnName : string){
          
            for(let i = 0 ; i < this.polarity.length; i++){
                if(this.polarity[i].columnName == columnName){
                    return i;
                }
            }
        }
        //set values of rows
        private setValuesInRows(values: any[], valuesLenght: number, rowsLength: number) {
            let score, item, iconType, type, polarityColId;
            let row: strucData.IRows = { row: [], id: 0 , polarity:1};
            for (let i = 0; i < valuesLenght; i++) { //rows
                row.id = <number>i;
                
                for (var k = 0; k < rowsLength; k++) { //columns
                    
                    if(this.removeColumnnId.indexOf(k) != -1){continue;}
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
                            row.row[k] = <any>item;
                        }
                    } else if (type == strucData.Type.VARIATION) { //type variation
                        try {  
                            polarityColId = this.getPolarityIDByName(this.getColumnPolarityInConfig(this.dataViewModel.columns[k].name));
                            row.polarity = <any>this.polarity[polarityColId].polarity[i]; //get polarity
                            row.row[k] = <any>item;
                        } catch (Error) {
                            row.row[k] = <any>item;
                            
                        }

                    } else {
                        row.row[k] = <any>item;
                    }

                }//end for    
                this.dataViewModel.values.push(row);
                row = { row: [], id: 0 , polarity:1};
            }//end for 

        }
        /**
         * get column polarity in config by name
         * @param columnName 
         */
        private getColumnPolarityInConfig(columnName:string){
         for(let i = 0; i< this.config.length;i++){
             if(columnName == this.config[i].columnName){
                 return this.config[i].columnPolarity;
             }
         }
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
                this.setHeadersInDataModel(rows,rowsLength);             //set headers of collumns
                this.setConfigColumns();                                 //set config columns in dataview model
                this.setValuesInRows(values,valuesLenght,rowsLength);    //set values of rows
            }
                
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
                    if (d.type == strucData.Type.VARIATION) {
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
             viewport.width - 0.1;
             viewport.height - 0.1;
        }

        /**
         * Enumerates through the objects defined in the capabilities and adds the properties to the format pane
         * @function
         * @param {EnumerateVisualObjectInstancesOptions} options - Map of defined objects
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