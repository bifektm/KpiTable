

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
        private modal :d3.Selection<HTMLElement>;
        private modalContent :d3.Selection<HTMLElement>;
        private configBody:d3.Selection<HTMLElement>;
        public dataViewModel: strucData.ITableViewModel;
        private selectionManager: ISelectionManager;
        private host: IVisualHost;
        private tableOptions: strucData.IOptions;
        private objects: any;
        private config: strucData.IConfig[];
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
            this.cleanDataModel();
            this.target = d3.select(options.element);
            this.div = this.target.append('div')       
                .classed('wrapper', true);
            this.setSettings();
            this.modal = this.div.append('div').classed('modal',true); 
            this.modalContent = this.modal.append("div").classed("modal-content",true);
            //*this.close = this.modalContent.append("span").classed('close',true).html('&times;');
            this.modalContent.append("div").classed('bar',true).text("Config Columns");
            this.configBody = this.modalContent.append("div").attr("id","config").html('<br>');
            this.InitconfigHTML();
        }
        private InitconfigHTML(){
            this.modalContent.append("span").html("<br>SCORE<br><br>");
        }
        /**
         * populate columns
         */
        private configHTML(){
            this.modalContent.select("div[id='config']").remove();
            let html =`
            <label>Columns</label>
            <select name="cols" style="width:300px">
             ${this.dataViewModel.columns.map(item =>`<option value="${item.name}">${item.name}</option>`).join('')}
             </select>`;
             html+=`
              &nbsp;&nbsp;&nbsp;&nbsp;<label>Icons</label>
               <select name="icons" style="width:300px">
               <option value="arrow">Arrow</option>
               <option value="bullet">Bullet</option>
               </select><br><br><hr><br>
             `;
             
            this.modalContent.append("div").attr("id","config").style("font-size","17px").html(html); 
            
        }
        /**
         * UPDATE OF VISUAL
         * @param optionsUpdate 
         * @param optionsInit 
         */
        @logExceptions()
        public update(optionsUpdate: VisualUpdateOptions, optionsInit: VisualConstructorOptions) {
         
            if (this.init || (optionsUpdate.viewport.height == this.height && optionsUpdate.viewport.width == this.width)) {
                if(optionsUpdate.dataViews[0]){
                    this.objects = optionsUpdate.dataViews[0].metadata.objects;                      //get objects properties
                    this.config = COMMON.Core.getConfig(optionsUpdate.dataViews);                    //get config columns                                                                          
                    this.parseData(optionsUpdate.dataViews);                                         //set data to my model
                    this.drawTable(optionsInit);                                                     //draw table
                    this.tableStyling();                                                             //table style
                    this.configHTML();
                    this.cleanDataModel();                                                           //clean data model      
                }                                                                                                                
            }
            this.setSettings();                                                                       //set settings to options
            this.openConfig();                                                                        //open config options   
            this.height = optionsUpdate.viewport.height;                                              //update height 
            this.width = optionsUpdate.viewport.width;                                                //update width
            if (this.init) { this.init = false; }                                                     //flag  prevent drawTable ever
        }

        /**
         * parse data to dataviewmodel
         * @param dataViews 
         */
        private parseData(dataViews: DataView[]) {

            //valid?  // exist?
            if (!dataViews
                || !dataViews[0]
                || !dataViews[0].categorical
                || !dataViews[0].categorical.categories
                )
                return;

            this.setHeaders(dataViews);                                  //set headers of collumns
            this.setConfigColumns();                                     //set config columns in dataview model
            this.setRows(dataViews);                                     //set values of rows
        }

        /**
         * //set headers of collumns
         * @param rows 
         * @param rowsLength 
         */
        private setHeaders(view: any[]) { 

            let data = view[0].categorical.values;
            let row = view[0].categorical.categories[0];
            //insert header row
            this.dataViewModel.columns.push({
                            name: row.source.displayName,
                            iconType: strucData.IconType.TEXT,
                            type: strucData.Type.NOTHING,
                            icon: [],
                            polarityColumn: ""
                        });
             if(!data){return;}
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
         * @param view 
         */
        private setRows(view: any[]) {
            let data = view[0].categorical.values;
            let indicator = COMMON.Core.getIndicator(view[0].categorical.categories);
            let polarity = COMMON.Core.getPolarity(view[0].categorical.categories);
            let colsLenght = this.dataViewModel.columns.length - 1;//4
            let type;
            let row = { id: null, polarity: 1, row: [] };
            let i = 0, j = 0;
            
            if(!data){ 
                indicator.forEach(item =>{
                row = { id: null, polarity: 1, row: [] };
                row.row.push(item);
                this.dataViewModel.values.push(row);
            });
             return;
            }
            let rowsLength = data.length / colsLenght;//8
            data.forEach(item => {

                if (i % colsLenght == 0) {
                    row = { id: null, polarity: polarity[j], row: [] };
                    row.row.push(indicator[j]);
                    row.id = j;
                }
                type = this.dataViewModel.columns[(i % colsLenght)+1].type;
                row.row.push(
                    this.setConfigRows(type, item.values[j], (i % colsLenght)+1)
                );
                if (i % colsLenght == colsLenght - 1) {
                  
                    this.dataViewModel.values.push(row);
                    j++;
                }
                i++;
            });
        }
        private setConfigRows(type:any,value:any,k:number){
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

                    // polarityColId = this.dataViewModel.columns[k].polarityPositionId;
                        //row.polarity = values[i][polarityColId];
                        return value;

                    } else {
                            return value;     
                    }
               return value;     
        }
        /**
       * set config columns in dataview model
       * @param rowsLength 
       */
        private setConfigColumns() {
            let config = this.config;
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
                       // this.dataViewModel.columns[id].polarityPositionId = _.findIndex(this.dataViewModel.columns, { name: item.columnPolarity });

                    } else { }
                });
            }
        }
        /**
         * draw table to my target
         * @param options 
         */
        private drawTable(options: VisualConstructorOptions) {
             console.log("table");
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
                    
                    if (d.type == strucData.Type.VARIATION && d.polarity != undefined) {
                        return COMMON.Core.getVariation(d.value, d.polarity);
                    }
                })
                .html(function (d) { 
                    return COMMON.Core.formatNumber(<any>d.value); 
                });

          /*  rows.on('click', function (d) {

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

            }.bind(this));*/

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
                            config:_.config
                        },
                        selector: null
                    });
                    
                    break;
                case 'TableOptions':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            zoom: _.zoom,
                            color:  _.color 
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
                config: getValue(this.objects, "kPIMeasures", "config", false),
                color: getValue(this.objects, "TableOptions", "color", "#015c55")
            };
             
            d3.select('span').on('click', function (){
               this.modal.style("display","none");
            }.bind(this));
           
        
        }
        /**
         * open modal config
         */
        private openConfig(){
            if(this.tableOptions.config){
               this.modal.style("display","block");
            }else{
                this.modal.style("display","none");
            }
            
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
        }
        /**
         * DESTROY 
         */
        public destroy() { }

    }
}