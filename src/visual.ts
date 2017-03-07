
module powerbi.extensibility.visual {
  import PBI = powerbi;

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
        private settings : ISettings;
        private tableOptions : IOptions;
        private objects : any;
    
        /**
         * CONSTRUCTOR OF VISUAL
         */
        constructor(options: VisualConstructorOptions) {
            this.host = options.host;
        
            //this.selectionManager = options.host.createSelectionManager();
            //init settings
            this.settings = {
                typeCol:Type.TEXT,
                fontSize : "16px",
                iconType: this.getIcons("BULLET"),//ARROW
                polarity:[]
            }
            /*this.tableOptions = {
                typeMeasure:getValue(this.objects,"typeMeasure","KPI",[]),
                Min : getValue<number>(this.objects,"Min","text",10)
            }*/
            this.cleanDataModel();

            this.target = d3.select(options.element);
            //div to target table
            this.div = this.target.append('div')
                .classed('wrapper',true);     
        }
        /**
         * UPDATE OF VISUAL
         */
        public update(optionsUpdate: VisualUpdateOptions, optionsInit: VisualConstructorOptions) {
             
               this.cleanDataModel();
               this.parseData(optionsUpdate.dataViews);
               this.drawTable(optionsInit);
               this.updateContainerViewports(optionsUpdate.viewport);
               this.objects = optionsUpdate.dataViews[0].metadata.objects;
               this.setSettings();
               //TODO
               this.target.select('div').style("font-Size",this.tableOptions.min+"px");

        }

        /**
         * clear data model
         */
        private cleanDataModel(){
            this.dataViewModel = {
                columns: [] ,
                values: []
            };
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
            var polarity;
            // let polarity = dataViews[1].categorical.values;

            if (rows && values) {

                let rowsLength = rows.length;
                let valuesLenght = values.length;
                var score, item, type;
                let row: IRows = { row: [], id: 0 };
                //let col : IColumns = {name:"",type : null};console.log(JSON.stringify(rows[j].roles));
                //set names of collumns
                for (let j = 0; j < rowsLength; j++) {
                  //TODO  if (rows[j].roles["polarity"]) { polarity = j; continue; }

                    this.dataViewModel.columns.push({
                        name: rows[j].displayName,
                        type: this.settings.typeCol
                    }

                    );
                }
                //#################################################
                //set values of rows
                for (let i = 0; i < valuesLenght; i++) {

                    row.id = <number>i;

                    for (var k = 0; k < rowsLength; k++) {
                        
                       //TODO if (k == polarity) { this.settings.polarity.push(+values[i][k]);continue; }
                        item = values[i][k];

                        if (item != null) { //null itens

                            type = this.dataViewModel.columns[k].type;

                            if (type == Type.ICON) {
                                score = COMMON.getScore(+item);
                                row.row[k] = <any>this.settings.iconType[score].toString();

                            } else if (type == Type.ICONTEXT) {
                                score = COMMON.getScore(+item);
                                row.row[k] = COMMON.formatNumber(<any>item)
                                    + " " + <any>this.settings.iconType[score].toString();
                            } else {
                                row.row[k] = COMMON.formatNumber(<any>item);

                            }

                        }//end id nulls


                    }//end for 
                    this.dataViewModel.values.push(row);
                    row = { row: [], id: 0 };
                }//end for 

            }//end if

        }//end method 

        /**
         * draw table to my target
         */
        @logExceptions()
        private drawTable(options: VisualConstructorOptions) {

            if(this.dataViewModel.columns.length < 1){return;}

           //if exists, remove existing table
            this.target.select('table').remove();
           // get columns and values
            var columns = this.dataViewModel.columns;     
            var values = this.dataViewModel.values;

            //init table
             this.table = this.div.append('table')
                          .classed("fixed_headers",true);
                        

            this.tHead = this.table.append('thead');
           

             this.tHead.selectAll('th').data(columns)
                       .enter()
                       .insert('th')
                       .html(function (column){return column.name;});
             this.tBody = this.table.append('tbody');
             
             var rows = this.tBody.selectAll("tr")
                        .data(values)
                        .enter()
                        .append("tr")
                        
                     
           var cells = rows.selectAll('td')
            .data(function(row){
                    return columns.map(
                        function(column,i) {
                            return {column: column, value: row.row[i]};
                });
            })
            .enter()
            .append('td')
            .style("text-align",function(d){
                  if(COMMON.isIcon(d.value)){
                      return "center";
                  }
            })
            .html(function (d){return <any>d.value;});
            
        }
        /**
         * get my colletion of icons
         */
        private getIcons(name: string):string[] {

           return ICON.ShapeFactory.getShape(name);            
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
            var objectEnumerations = new objectEnumerations();
            let objectEnumeration: VisualObjectInstance[] = [];
            var _ =this.tableOptions;
            
            switch (objectName) {
                case 'kPIMeasures':
                     objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            collumns: _.columns,
                            kpi:_.kpi,
                            icon: _.icon,
                            
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
        @logExceptions()
        private setSettings() {

                this.tableOptions = {
                    min: getValue(this.objects,"kPIMeasures","zoom",20),
                    kpi: getValue(this.objects,"kPIMeasures","kpi",0),
                    columns:getValue(this.objects,"kPIMeasures","collumns",{value:"1",displayName:"xxxx"}),
                    icon: getValue(this.objects,"kPIMeasures","icon","text")
                };            
           console.log(JSON.stringify(this.tableOptions));             
        }  
        /**
         * DESTROY 
         */
        public destroy() { }

    }
}