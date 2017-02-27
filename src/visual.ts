
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
        private dataViewModel: ITableViewModel;
        private icons : string[];
        /**
         * CONSTRUCTOR OF VISUAL
         */
        constructor(options: VisualConstructorOptions) {

            this.cleanDataModel();
            this.icons = this.getIcons("ARROW");//ARROW
            
            this.target = d3.select(options.element);
            //div to target table
            this.div = this.target.append('div')
                .classed('wrapper',true);               
               
        }
        /**
         * UPDATE OF VISUAL
         */
        public update(optionsUpdate: VisualUpdateOptions, optionsInit: VisualConstructorOptions) {
            
            this.parseData(optionsUpdate.dataViews);

            this.drawTable(optionsInit);
            //this.updateContainerViewports(optionsUpdate.viewport);
            this.cleanDataModel();
        }
        private cleanDataModel(){
            this.dataViewModel = {
                categories: { name: "", rows: [] },
                values: []
            };
        }
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

           // if (indicador && vals) {

                let indicaLength = indicador[0].values.length;
                let valsLenght = vals.length;
                let countCollumn = valsLenght / indicaLength;
                var score;
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
                //set values of indicador
                for (let i = 0; i < indicaLength; i++) {

                    this.dataViewModel.categories.rows.push(
                        indicador[0].values[i].toString()
                    );


                    //set kpis
                    for (var k = 0; k < valsLenght; k++) {

                        if (vals[k].values[i] != null) {
                            //////////////set icon/////
                            
                             if(k==valsLenght-1){
                                 score =  this.getScore(+vals[k].values[i],+vals[k].values[i]);
                                 debugger
                                 this.dataViewModel.values[this.getIdValues(vals[k].source.displayName, countCollumn)]
                                     .rows[this.getIdGroup(vals[k].source.groupName)] = <any>this.icons[score].toString();
                                     debugger
                             }else{////////////////////////////
                                 this.dataViewModel.values[this.getIdValues(vals[k].source.displayName, countCollumn)]
                                     .rows[this.getIdGroup(vals[k].source.groupName)] = <any>vals[k].values[i];
                             }
                            
                            
                        }

                    }//end for values*/

                }//end for indicador

          //  }//end if

        }
      private getScore(real: number, buject: number) {
           
           let score: number;
           score = (1 + (real - buject) / Math.abs(buject)) * 100;
           return 1;
           // > 100 – Verde; >= 70 - Amarelo; < 70 – Vermelho
         /*  if (score > 100) {
               return 2;
           } else if (score >= 70) {
               return 1;
           } else {
               return 0;
           }*/

       }

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
            return this.dataViewModel.categories.rows.indexOf(compare.toString());
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
            var temp;

           for(let i=0;i<count;i++){
               for(j = 0; j < countColumns; j++){
                   object[this.dataViewModel.categories.name] = indicador[i].toString();
                   temp = values[j].rows[i];
                   if(temp[0]!="<"){
                      temp = temp.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                   }
                   object[values[j].name] = temp;//.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'); 
               }
               rows[i] = object;
               object = {};
           }
             return rows;
        }
        /**
         * draw table to my target
         */
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
             var rows = this.tBody.selectAll("tr")
                        .data(values)
                        .enter()
                        .append("tr");  
             var cells = rows.selectAll('td')
                .data(function(row){
                    return columns.map(function(column){
                         return {column:column,value:row[column]}
                    });
                })
                .enter()
                .append('td')
                .html(function(d){return d.value});                
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
         * DESTROY 
         */
        public destroy() { }

    }
}