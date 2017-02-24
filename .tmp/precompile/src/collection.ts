declare module Collection { }

module Collection {

    export interface IDictionary<T> {
        Add(key: string, value: T); //add item
        ContainsKey(key: string): boolean; // contain key
        Count(): number; //number of itens
        Item(key: string): T; // get item 
        Keys(): string[]; //get itns
        Remove(key: string): T;//Remove item
        Values(): T[];// get itens
    }

    export  class Dictionary<T>  {
        public  items: { [index: string]: T } = {};

        private count: number = 0;

        public ContainsKey(key: string): boolean {
            return this.items.hasOwnProperty(key);
        }

        public Count(): number {
            return this.count;
        }

        public Add(key: string, value: T) {
            this.items[key] = value;
            this.count++;
        }

        public Remove(key: string): T {
            var val = this.items[key];
            delete this.items[key];
            this.count--;
            return val;
        }

        public Item(key: string): T {
            return this.items[key];
        }

        public Keys(): string[] {
            var keySet: string[] = [];

            for (var prop in this.items) {
                if (this.items.hasOwnProperty(prop)) {
                    keySet.push(prop);
                }
            }

            return keySet;
        }

        public Values(): T[] {
            var values: T[] = [];

            for (var prop in this.items) {
                if (this.items.hasOwnProperty(prop)) {
                    values.push(this.items[prop]);
                }
            }

            return values;
        }

        public stringFy() :string{
            return JSON.stringify(this.Values() +":"+this.Keys());
        }
    }

}