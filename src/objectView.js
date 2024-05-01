import jet from "@randajan/jet-core";
import { list } from "@randajan/jet-core/eachSync"; 
import { fetchArrayColumns, passArgs, runOrPass } from "./tools";

const toValue = (translate, val)=>jet.isMapable(val) ? toView(translate, val) : translate("value", val);


const toTableCell = (translate, val, col, rkey, ckey)=>translate("tableCell", toValue(translate, val), col, rkey, ckey);

const toTableRow = (translate, vals, cols, rkey)=>translate("tableRow", cols.map((col, ckey)=>toTableCell(translate, jet.get(vals, col), col, rkey, ckey)), rkey);

const toTableCol = (translate, name, key)=>translate("tableCol", name, key);

const toTableRows = (translate, rows, cols)=>translate("tableRows", list(rows, (vals, key)=>toTableRow(translate, vals, cols, key)));

const toTableCols = (translate, cols)=>translate("tableCols", cols.map((name, key)=>toTableCol(translate, name, key)));

const toTable = (translate, rows, cols)=>translate("table", toTableCols(translate, cols), toTableRows(translate, rows, cols));


const toListItem = (translate, item, key)=>translate("listItem", toValue(translate, item), key);

const toListKey = (translate, name, key)=>translate("listKey", name, key);

const toListRow = (translate, item, key)=>translate("listRow", toListKey(translate, key), toListItem(translate, item, key), key);

const toList = (translate, pairs)=>translate("list", list(pairs, (item, key)=>toListRow(translate, item, key)));


const toView = (translate, mapable, validColumnsPercentage=.6, validRowPercentage=.6)=>{
    const cols = Array.jet.is(mapable) ? fetchArrayColumns(mapable, validColumnsPercentage, validRowPercentage) : null;
    return translate("view", cols ? toTable(translate, mapable, cols) : toList(translate, mapable))
}

export const objectView = (mapable, translate, validColumnsPercentage=.6, validRowPercentage=.6)=>{
    if (!jet.isMapable(mapable)) { return; }

    const _translate = Object.jet.is(translate) ? (index, ...args)=>runOrPass(translate[index], ...args) : !jet.isRunnable(translate) ? passArgs : translate;

    return toView(_translate, mapable, validColumnsPercentage, validRowPercentage);
}