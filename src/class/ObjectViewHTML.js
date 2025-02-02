import { frameNum, isDate, isFce, isImg, maxNum, parseURL, toFce, toNum } from "../tools";
import { toValue } from "./privateMethods";


export class ObjectViewHTML {

    static create(opt) { return new this(opt); }
    static generate(any, opt) { return this.create(opt).generate(any); }

    constructor(opt={}) {
        this.opt = Object.freeze({
            maxImgHeight:maxNum(0, toNum(opt.maxImgHeight, 100)),
            maxImgWidth:maxNum(0, toNum(opt.maxImgWidth, 200)),
            formatDate:toFce(opt.formatDate, d=>d.toLocaleString()),
            formatNumber:toFce(opt.formatNumber, n=>n.toLocaleString()),
            longTextSize:maxNum(0, toNum(opt.longTextSize, 32)),
            toUnknown:toFce(opt.toUnknown),
            isImg:toFce(opt.isImage, isImg),
            validColsRatio:frameNum(toNum(opt.validColsRatio, .6), 0, 1),
            validColRatio:frameNum(toNum(opt.validColRatio, .6), 0, 1)
        });
    }

    toView(content) { return `<div class="View">${content}</div>`; }

    toList(items, mapType) {
        return `<table class="List" style="border-collapse: collapse;" data-maptype="${mapType}"><tbody>${items.join("")}</tbody></table>`;
    }

    toListRow(key, item, rowKey) {
        return `<tr class="ListRow" data-rowkey="${rowKey}">${key}${item}</tr>`;
    }

    toListKey(key) {
        return `<td class="ListKey" style="font-weight:bold; vertical-align:top; padding:2px 10px">${key}</td>`;
    }

    toListItem(item, key) {
        return `<td class="ListItem" data-key="${key}" style="vertical-align:top; padding:2px 10px; border:1px solid black;">${item}</td>`;
    }

    toTable(cols, rows) {
        return `<table class="Table" style="border-collapse: collapse;">${cols}${rows}</table>`;
    }

    toTableCols(cols) {
        return `<thead class="TableCols"><tr>${cols.join("")}</tr></thead>`;
    }

    toTableCol(col, colKey) {
        return `<th class="TableCol" data-colkey="${colKey}">${col}</th>`;
    }

    toTableRows(rows) {
        return `<tbody class="TableRows">${rows.join("")}</tbody>`;
    }

    toTableRow(values, rowKey) {
        return `<tr class="TableRow" data-rowkey="${rowKey}">${values.join("")}</tr>`;
    }

    toTableCell(value, col, rowKey, colKey) {
        return `<td class="TableCell" data-col="${col}" data-key="${rowKey}:${colKey}" style="vertical-align:top; padding:2px 10px; border:1px solid black;">${value}</td>`;
    }

    toValue(any) {
        if (isDate(any)) { return this.toDate(any); }

        const { toUnknown, isImg, longTextSize, maxImgHeight, maxImgWidth } = this.opt;
        
        const t = typeof any;
        if (t === "number" || t === "bigint") { return this.toNumber(any); }
        if (t === "boolean") { return this.toBoolean(any); }
        if (t !== "string" && !t.hasOwnProperty("toString")) { return toUnknown(any); }

        any = String(any);
        const url = parseURL(any);

        if (url && isImg(url)) { return this.toHref(url, this.toImg(url, any, maxImgHeight, maxImgWidth)); }

        const text = any.length >= longTextSize ? this.toLongText(any, longTextSize) : this.toText(any);
        
        return url ? this.toHref(url, text) : text;
    }

    toBlank() { return ""; }
    toNumber(value) { return this.opt.formatNumber(value); }
    toDate(date) { return this.opt.formatDate(date); }

    toBoolean(value) { return `<input type="checkbox" ${value ? "checked" : ""} style="pointer-events:none">`; }

    toImg(url, value, maxHeight, maxWidth) {
        return `<img alt="${url.ref}" src="${url.href}" title="${value}" style="max-height:${maxHeight}px; max-width:${maxWidth}px"/>`;
    }
    toHref(url, content) { return `<a href=${url.href} target="_blank">${content}</a>`;}

    toText(str) { return `<span>${str}</span>`; }
    toLongText(str, limit) { return `<span title="${str}">${str.substring(0, limit) + "..."}</span>`; }

    generate(any) { return toValue(this, any); }

}

export const toHTML = (any, opt)=>ObjectViewHTML.generate(any, opt);