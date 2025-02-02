import { isArr, list, getKey, isMapable, getMapable } from "../tools";


const toTableCell = (gen, val, col, rkey, ckey)=>gen.toTableCell(toValue(gen, val), col, rkey, ckey);

const toTableRow = (gen, vals, cols, rkey)=>gen.toTableRow(cols.map((col, ckey)=>toTableCell(gen, getKey(vals, col), col, rkey, ckey)), rkey);

const toTableCol = (gen, name, key)=>gen.toTableCol(toValue(gen, name), key);

const toTableRows = (gen, rows, cols)=>gen.toTableRows(list(getMapable(rows).entries(rows), (vals, key)=>toTableRow(gen, vals, cols, key)));

const toTableCols = (gen, cols)=>gen.toTableCols(cols.map((name, key)=>toTableCol(gen, name, key)));

const toTable = (gen, rows, cols)=>gen.toTable(toTableCols(gen, cols), toTableRows(gen, rows, cols));

const toListItem = (gen, item, key, map)=>gen.toListItem(toValue(gen, item), key, map);

const toListKey = (gen, name, map)=>map === "Set" ? gen.toBlank() :  gen.toListKey(toValue(gen, name), map);

const toListRow = (gen, item, key, map)=>gen.toListRow(toListKey(gen, key, map), toListItem(gen, item, key, map), key, map);

const toList = (gen, pairs)=>{
    const m = getMapable(pairs);
    return gen.toList(list(m.entries(pairs), (item, key)=>toListRow(gen, item, key, m.name)), m.name);
}

const fetchArrayColumns = (gen, arr)=>{
    if (!isArr(arr)) { return; }

    const cols = [];
    const stat = new Map();

    for (const k in arr) {
        const first = k === "0";
        const any = arr[k];
        const m = getMapable(any);

        if (!m) { return; }

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
    const rowsReqOk = arr.length * gen.opt.validColRatio;
    for (const [_, s] of stat.entries()) {
        if (s > rowsReqOk) { colsOk ++; }
    }

    if (colsOk > (cols.length * gen.opt.validColsRatio)) { return cols; }
}

export const toValue = (gen, any)=>{
    if (any == null) { return gen.toBlank(); }
    if (!isMapable(any)) { return gen.toValue(any); }

    const cols = fetchArrayColumns(gen, any);
    return gen.toView(cols ? toTable(gen, any, cols) : toList(gen, any));

}