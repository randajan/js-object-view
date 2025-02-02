import { isArr, frameNum, toNum, list, getKey, isMapable, getMapable, isNum, parseURL, isDate } from "../tools";



export class ProcessContext {
    constructor(gen, opt={}) {
        const { validColsRatio, validRowsRatio } = opt;

        Object.defineProperty(this, "gen", {value:gen});
        Object.defineProperty(this, "validColsRatio", {value:frameNum(toNum(validColsRatio, .6), 0, 1)});
        Object.defineProperty(this, "validRowsRatio", {value:frameNum(toNum(validRowsRatio, .6), 0, 1)});
    }

    tableCell(val, col, rkey, ckey) { return this.gen.tableCell(this.value(val), col, rkey, ckey); }

    tableRow(vals, cols, rkey) {
        return this.gen.tableRow(cols.map((col, ckey)=>this.tableCell(getKey(vals, col), col, rkey, ckey)), rkey);
    }

    tableCol(name, key) { return this.gen.tableCol(this.value(name), key); }

    tableRows(rows, cols) { return this.gen.tableRows(list(getMapable(rows).entries(rows), (vals, key)=>this.tableRow(vals, cols, key))); }

    tableCols(cols) { return this.gen.tableCols(cols.map((name, key)=>this.tableCol(name, key))); }

    table(rows, cols) { return this.gen.table(this.tableCols(cols), this.tableRows(rows, cols)); }

    listItem(item, key, map) { return this.gen.listItem(this.value(item), key, map); }

    listKey(name, map) { return map === "Set" ? this.gen.blank() :  this.gen.listKey(this.value(name), map); }

    listRow(item, key, map) {
        return this.gen.listRow(this.listKey(key, map), this.listItem(item, key, map), key, map);
    }

    list(pairs) {
        const m = getMapable(pairs);
        return this.gen.list(list(m.entries(pairs), (item, key)=>this.listRow(item, key, m.name)), m.name);
    }

    value(any) {
        if (any == null) { return this.gen.blank(); }

        if (isMapable(any)) {
            const cols = this.fetchArrayColumns(any);
            return this.gen.view(cols ? this.table(any, cols) : this.list(any));
        }

        if (isDate(any)) { return this.gen.date(any); }
        
        const t = typeof any;
        if (t === "number" || t === "bigint") { return this.gen.number(any); }
        if (t === "boolean") { return this.gen.boolean(any); }
        if (t !== "string") { return this.gen.other(any); }
        const str = this.gen.string(any);
        const url = parseURL(any);
        return url ? this.gen.url(url, str, any) : str;

    }

    fetchArrayColumns(arr) {
        if (!isArr(arr)) { return; }

        const cols = [];
        const stat = new Map();
    
        for (const k in arr) {
            const first = k === "0";
            const any = arr[k];
            const m = getMapable(any);

            if (!m) { return; } // should be return ?

            for (const [k, v] of m.entries(any)) {
                const s = (stat.get(k) || 0);
                if (!s) { // new column
                    let caption = k;
                    if (m.name === "Array" && first) { caption = v; }
                    cols.push(caption);
                }
                stat.set(k, s+1);
            }
        }
    
        let colsOk = 0;
        const rowsReqOk = arr.length * this.validRowsRatio;
        for (const [_, s] of stat.entries()) {
            if (s > rowsReqOk) { colsOk ++; }
        }
    
        if (colsOk > (cols.length * this.validColsRatio)) { return cols; }
    }
    
}