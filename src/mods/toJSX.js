import React from "react";
import { objectView } from "../objectView";

const config = {
    view:(content)=><div className="View">{content}</div>,
    list:(items)=><table className="List"><tbody>{items}</tbody></table>,
    listRow:(key, item, rowKey)=><tr key={rowKey} className="ListRow">{key}{item}</tr>,
    listKey:(key)=><td className="ListKey" style={{"fontWeight":"bold", "verticalAlign":"top", "padding":"1px 10px"}}>{key}</td>,
    listItem:(item)=><td className="ListItem" style={{"verticalAlign":"top", "padding":"1px 10px"}}>{item}</td>,
    table:(cols, rows)=><table className="Table">{cols}{rows}</table>,
    tableCols:(cols)=><thead className="TableCols"><tr>{cols}</tr></thead>,
    tableCol:(name, colKey)=><th key={colKey} className="TableCol">{name}</th>,
    tableRows:(rows)=><tbody className="TableRows">{rows}</tbody>,
    tableRow:(values, rowKey)=><tr key={rowKey} className="TableRow">{values}</tr>,
    tableCell:(value, col)=><td key={col} className="TableCell" style={{"verticalAslign":"top", "padding":"1px 10px"}}>{value}</td>,
    value:(val)=>{
        if (!String.jet.is(val)) { return val; }
        const text = <span title={val}>{val.length <= 24 ? val : val.substring(0, 21)+"..."}</span>;
        try { 
            const url = new URL(val);
            if (url.href !== val) { return text; }
            const mImg = url.pathname.match(/\.(jpg|jpeg|svg|png)$/);
            return <a href={url.href} target="_blank" >{mImg?.length ? <img alt={url.ref} src={url.href} title={val}/> : text}</a>
        } catch(e) {}
    
        return text;
    }
}

export const objectToJSX = object=>objectView(object, config);
export default objectToJSX;