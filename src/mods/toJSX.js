import React from "react";
import { createViewGenerator } from "../";

const elements = {
    blank:_=>null,
    view:(content)=><div className="View">{content}</div>,
    list:(items)=><table className="List"><tbody>{items}</tbody></table>,
    listRow:(key, item, rowKey)=><tr key={rowKey} className="ListRow">{key}{item}</tr>,
    listKey:(key)=><td className="ListKey" style={{"fontWeight":"bold", "verticalAlign":"top", "padding":"1px 10px"}}>{key}</td>,
    listItem:(item)=><td className="ListItem" style={{"verticalAlign":"top", "padding":"1px 10px"}}>{item}</td>,
    table:(cols, rows)=><table className="Table">{cols}{rows}</table>,
    tableCols:(cols)=><thead className="TableCols"><tr>{cols}</tr></thead>,
    tableCol:(col, colKey)=><th key={colKey} className="TableCol">{col}</th>,
    tableRows:(rows)=><tbody className="TableRows">{rows}</tbody>,
    tableRow:(values, rowKey)=><tr key={rowKey} className="TableRow">{values}</tr>,
    tableCell:(value, col)=><td key={col} className="TableCell" style={{"verticalAslign":"top", "padding":"1px 10px"}}>{value}</td>,
    number:(value)=>value.toLocaleString(),
    date:(date)=>date.toLocaleString(),
    boolean:(value)=><input type="checkbox" checked={value ? true : false} style="pointer-events:none"/>,
    url:(url, str, value)=>{
        const mImg = url.pathname.match(/\.(jpg|jpeg|svg|png|gif|webp)$/);
        return <a href={url.href} target="_blank" >{mImg?.length ? <img alt={url.ref} src={url.href} title={value}/> : str}</a>
    },
    string:(str)=><span title={str}>{str.length <= 24 ? str : str.substring(0, 21)+"..."}</span>,
    other:(value)=>value
}

export const objectToJSX = createViewGenerator(elements);
export default objectToJSX;