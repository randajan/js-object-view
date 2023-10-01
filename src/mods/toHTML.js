import { objectView } from "../objectView";

const config = {
    view:(content)=>`<div class="View">${content}</div>`,
    list:(items)=>`<table class="List" style="border-collapse: collapse;"><tbody>${items.join("")}</tbody></table>`,
    listRow:(key, item, rowKey)=>`<tr class="ListRow" data-rowkey="${rowKey}">${key}${item}</tr>`,
    listKey:(key)=>`<td class="ListKey"  style="font-weight:bold; vertical-align:top; padding:2px 10px">${key}</td>`,
    listItem:(item, key)=>`<td class="ListItem" data-key="${key}" style="vertical-align:top; padding:2px 10px; border:1px solid black;">${item}</td>`,
    table:(cols, rows)=>`<table class="Table" style="border-collapse: collapse;">${cols}${rows}</table>`,
    tableCols:(cols)=>`<thead class="TableCols"><tr>${cols.join("")}</tr></thead>`,
    tableCol:(name, colKey)=>`<th class="TableCol" data-colkey="${colKey}">${name}</th>`,
    tableRows:(rows)=>`<tbody class="TableRows">${rows.join("")}</tbody>`,
    tableRow:(values, rowKey)=>`<tr class="TableRow" data-rowkey="${rowKey}">${values.join("")}</tr>`,
    tableCell:(value, col, rowKey, colKey)=>`<td class="TableCell" data-col="${col}" data-key="${rowKey+":"+colKey}" style="vertical-align:top; padding:2px 10px; border:1px solid black;">${value}</td>`,
    value:(val)=>{
        if (!String.jet.is(val)) { return val; }
        const text = `<span title="${val}">${val.length <= 24 ? val : val.substring(0, 21)+"..."}</span>`;
        try { 
            const url = new URL(val);
            if (url.href !== val) { return text; }
            const mImg = url.pathname.match(/\.(jpg|jpeg|svg|png)$/);
            return `<a href=${url.href} target="_blank">${mImg?.length ? `<img alt="${url.ref}" src="${url.href}" title="${val}"/>` : text}</a>`
        } catch(e) {}
    
        return text;
    }
};

export const objectToHTML = object=>objectView(object, config);
export default objectToHTML;