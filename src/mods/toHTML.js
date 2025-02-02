import { createViewGenerator } from "../";

const elements = {
    blank:_=>"",
    view:(content)=>`<div class="View">${content}</div>`,
    list:(items, mapType)=>`<table class="List" style="border-collapse: collapse;" data-maptype="${mapType}"><tbody>${items.join("")}</tbody></table>`,
    listRow:(key, item, rowKey)=>`<tr class="ListRow" data-rowkey="${rowKey}">${key}${item}</tr>`,
    listKey:(key)=>`<td class="ListKey"  style="font-weight:bold; vertical-align:top; padding:2px 10px">${key}</td>`,
    listItem:(item, key)=>`<td class="ListItem" data-key="${key}" style="vertical-align:top; padding:2px 10px; border:1px solid black;">${item}</td>`,
    table:(cols, rows)=>`<table class="Table" style="border-collapse: collapse;">${cols}${rows}</table>`,
    tableCols:(cols)=>`<thead class="TableCols"><tr>${cols.join("")}</tr></thead>`,
    tableCol:(col, colKey)=>`<th class="TableCol" data-colkey="${colKey}">${col}</th>`,
    tableRows:(rows)=>`<tbody class="TableRows">${rows.join("")}</tbody>`,
    tableRow:(values, rowKey)=>`<tr class="TableRow" data-rowkey="${rowKey}">${values.join("")}</tr>`,
    tableCell:(value, col, rowKey, colKey)=>`<td class="TableCell" data-col="${col}" data-key="${rowKey+":"+colKey}" style="vertical-align:top; padding:2px 10px; border:1px solid black;">${value}</td>`,
    number:(value)=>value.toLocaleString(),
    date:(date)=>date.toLocaleString(),
    boolean:(value)=>`<input type="checkbox" ${value ? "checked" : ""} style="pointer-events:none">`,
    url:(url, str, value)=>{
        const mImg = url.pathname.match(/\.(jpg|jpeg|svg|png|gif|webp)$/);
        return `<a href=${url.href} target="_blank">${mImg?.length ? `<img alt="${url.ref}" src="${url.href}" title="${value}"/>` : str}</a>`
    },
    string:(str)=>`<span title="${str}">${str.length <= 24 ? str : str.substring(0, 21)+"..."}</span>`,
    other:(value)=>value
};

export const objectToHTML = createViewGenerator(elements);
export default objectToHTML;