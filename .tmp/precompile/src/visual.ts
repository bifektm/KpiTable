
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
        private rows : d3.Selection<HTMLElement>;
        public dataViewModel: ITableViewModel;
        private selectionManager: ISelectionManager;
        private host: IVisualHost;
        private settings : ISettings;
    
        /**
         * CONSTRUCTOR OF VISUAL
         */
        constructor(options: VisualConstructorOptions) {
            this.host = options.host;
            this.selectionManager = options.host.createSelectionManager();
            //init settings
            this.settings = {
                typeCol:Type.ICON,
                fontSize : "16px",
                iconType: this.getIcons("BULLET")//ARROW
            }
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
            this.parseObjects(optionsUpdate.dataViews);
            this.parseData(optionsUpdate.dataViews);
            this.drawTable(optionsInit);
            this.cleanDataModel();
            //this.updateContainerViewports(optionsUpdate.viewport);
        }

        /**
         * clear data model
         */
        private cleanDataModel(){
            this.dataViewModel = {
                categories: { name: "", rows: [] },
                values: []
            };
        }
        /**
         * parse objects of options
         */
        //TODO
        private parseObjects(dataViews: DataView[]){
            let objects = dataViews[0].metadata.objects;
        }
        /**
         * parse data
         */
        private parseData(dataViews: DataView[]) {

            //valid? // division 0
            if (!dataViews
                || !dataViews[0]
                || !dataViews[0].categorical
                || !dataViews[0].categorical.categories
                || !dataViews[0].categorical.values)
                return;

            let indicador = dataViews[0].categorical.categories;
            let vals = dataViews[0].categorical.values;
            let polarity = dataViews[1].categorical.values;
            let min = dataViews[2].categorical.values;
            let med = dataViews[3].categorical.values;
            let max = dataViews[4].categorical.values;
           if (indicador && vals) {

                let indicaLength = indicador[0].values.length;
                let valsLenght = vals.length;
                let countCollumn = valsLenght / indicaLength;
                var score,item,type,groupId,valuesId;
              // console.log(JSON.stringify(indicador));
                //set name indicador
                this.dataViewModel.categories.name = indicador[0].source.displayName;
                //set names of collumns
                for (let j = 0; j < countCollumn; j++) {

                    this.dataViewModel.values.push({
                        name: vals[j].source.displayName,
                        type: Type.NOTHING,
                        rows: []
                    });
                }
                //TODO SETTINGS
               this.dataViewModel.values[2].type = Type.ICON;
               //#################################################
                //set values of indicador
                for (let i = 0; i < indicaLength; i++) {
           console.log(JSON.stringify(med[i]));
                    this.dataViewModel.categories.rows.push({
                        row:indicador[0].values[i].toString(),
                        kpis:{
                            polarity: +polarity[i].values[i],
                            min: +min[i].values[i],
                            med: +med[i].values[i],
                            max: +max[i].values[i]
                        },
                        selectionId:  this.host.createSelectionIdBuilder()
                            .withCategory(indicador[0], i)
                            .createSelectionId()

                    });

                    //set kpis
                    for (var k = 0; k < valsLenght ; k++) {

                        item = vals[k].values[i];
                       
                        if ( item != null) { //null itens

                            groupId = this.getIdGroup(vals[k].source.groupName);
                            valuesId = this.getIdValues(vals[k].source.displayName, countCollumn);
                            type = this.dataViewModel.values[valuesId].type; 

                             if(type == Type.ICON){
                                 score =  COMMON.getScore(+item);
                                 this.dataViewModel.values[valuesId]
                                     .rows[groupId] = <any>this.settings.iconType[score].toString();
                             }else if(type == Type.ICONTEXT){
                                 score =  COMMON.getScore(+item);
                                  this.dataViewModel.values[valuesId]
                                     .rows[groupId] =  <any>item.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') 
                                     + " " + <any>this.settings.iconType[score].toString();
                             }else{
                                 this.dataViewModel.values[valuesId]
                                     .rows[groupId] = <number>item.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                                   
                             }
                          
                        }//end id nulls
                        

                    }//end for values*/

                }//end for indicador

            }//end if

        }//end method 

         /**
         * get id grouped
         */
        private getIdValues(compare: any, count: number): number {

            for (let i = 0; i < count; i++) {
                if (this.dataViewModel.values[i].name == compare.toString()) {
                    return i;
                }
            }

        }
        /**
         * get id grouped
         */
        private getIdGroup(compare: any): number {
           let count = this.dataViewModel.categories.rows.length;
            for (let i = 0; i < count; i++) {
                if (this.dataViewModel.categories.rows[i].row == compare.toString()) {
                    return i;
                }
            }
        }
        //get columns to draw
        private getColumnsToDraw(){
            var column =[];
            column[0] = this.dataViewModel.categories.name;
             for(let entry of this.dataViewModel.values){
                 column.push(entry.name);
             }
             return column;
        }
        /**
         * get values to draw TODO
         */
        private getValuesToDraw(){
            
            var rows = [];
            let count:number;
            let countColumns:number;
            count = this.dataViewModel.categories.rows.length;
            countColumns = this.dataViewModel.values.length;
            var indicador = this.dataViewModel.categories.rows;
            var values = this.dataViewModel.values;
            
            let j:number;
            var object = {};
            var temp = [];

           for(let i=0;i<count;i++){
               for(j = 0; j < countColumns; j++){
                   
                   object[this.dataViewModel.categories.name] = indicador[i].row.toString();
                   object[values[j].name] = values[j].rows[i]; 
                   object["selectionId"] = indicador[i].selectionId;
               }

               rows[i] = object;
               
               object = {}; 
           }
          
             return rows;
        }
        /**
         * draw table to my target
         */
        @logExceptions()
        private drawTable(options: VisualConstructorOptions) {

            if(this.dataViewModel.categories.rows.length < 1){return;}

           //if exists, remove existing table
            this.target.select('table').remove();
           // get columns and values
            var columns = this.getColumnsToDraw();      
            var values = this.getValuesToDraw();

            //init table
             this.table = this.div.append('table')
                          .classed("fixed_headers",true);
                        

            this.tHead = this.table.append('thead');
           

             this.tHead.selectAll('th').data(columns)
                       .enter()
                       .insert('th')
                       .html(function (column){return column;});
             this.tBody = this.table.append('tbody');
             
            this.rows = this.tBody.selectAll("tr")
                        .data(values)
                        .enter()
                        .append("tr")
                        .attr("id",function(d,i){
                            //console.log(JSON.stringify(d));
                            return d.selectionId.selector.data[0].key;
                        });
                        
                       

            var cells = this.rows.selectAll('td')
            .data(function(row){return d3.permute(row,columns) })
            .enter()
            .append('td')
            .style("text-align",function(d){
                console.log(COMMON.isIcon(<string>d));
                  if(COMMON.isIcon(<string>d)){
                      return "center";
                  }
            })
            .html(function (d){return <any>d;});
                          
               /*var cells = this.rows.selectAll('td')
                .data(function(row){
                    return columns.map(function(column){
                         return {column:column,value:row[column]}
                    });
                        
                })
                .enter()
                .append('td')
                .html(function(d){return d.value}); */

            this.rows.on('click', function(d) {
              
             //console.log(JSON.stringify(d));
                this.selectionManager.select(d3.select(this).attr('id')).then((ids: ISelectionId[]) => {
                   
                    this.rows.attr({
                        'style': ids.length > 0 ? "color:red" : "color:red"
                    });

                    d3.select(this).attr({
                        'style': "color:red"
                    });
                });

                (<Event>d3.event).stopPropagation();
            });
              
            this.selectionManager.clear().then(() => {
                //called when clearing the selection has been completed successfully
            });             
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
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let objectName = options.objectName;
            let objectEnumeration: VisualObjectInstance[] = [];

            switch (objectName) {
                case 'table':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            FontSize: {
                                fontSize: true
                            }
                        },
                        selector: null
                    });
                    break;
                case 'kPIMesures':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            typeMesure: true
                        },
                        selector: null
                    });
                    break;
                

            };
              let propertToChange: VisualObjectInstancesToPersist = {
                    replace: objectEnumeration
                }
                this.host.persistProperties(propertToChange);
            return objectEnumeration;
        }
        /**
         * DESTROY 
         */
        public destroy() { }

    }
}