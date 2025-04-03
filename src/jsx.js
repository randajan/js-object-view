import React from "react";
import { ObjectViewHTML } from "./class/ObjectViewHTML";

export class ObjectViewJSX extends ObjectViewHTML {

    toView(content) { return <div className="View">{content}</div>; }
    toList(items) { return <table className="List"><tbody>{items}</tbody></table>; }
    toListRow(key, item, rowKey) { return <tr key={rowKey} className="ListRow">{key}{item}</tr>; }
    toListKey(key) { return <td className="ListKey" style={{"fontWeight":"bold", "verticalAlign":"top", "padding":"1px 10px"}}>{key}</td>; }
    toListItem(item) { return <td className="ListItem" style={{"verticalAlign":"top", "padding":"1px 10px"}}>{item}</td>; }

    toTable(cols, rows) { return <table className="Table">{cols}{rows}</table>; }
    toTableCols(cols) { return <thead className="TableCols"><tr>{cols}</tr></thead>; }
    toTableCol(col, colKey) { return <th key={colKey} className="TableCol">{col}</th>; }
    toTableRows(rows) { return <tbody className="TableRows">{rows}</tbody>; }
    toTableRow(values, rowKey) { return <tr key={rowKey} className="TableRow">{values}</tr>; }
    toTableCell(value, col) { return <td key={col} className="TableCell" style={{"verticalAlign":"top", "padding":"1px 10px"}}>{value}</td>; }

    toBlank() { return null; }

    toBoolean(value) { return <input type="checkbox" checked={value ? true : false} style={{pointerEvents:"none"}} readOnly/>; }
    toImg(url, value, maxHeight, maxWidth) {
        return <img alt={url.ref} src={url.href} title={value} style={{"max-height":maxHeight+"px", "max-width":maxWidth+"px"}}/>
    }
    toHref(url, content) { return <a href={url.href} target="_blank">{content}</a>;}

    toText(str) { return <span>{str}</span>; }
    toLongText(str, limit) { return <span title={str}>{str.substring(0, limit)}</span>; }
    toOther(value) { return value; }

}

export const toJSX = (any, opt)=>ObjectViewJSX.generate(any, opt);
export default toJSX;