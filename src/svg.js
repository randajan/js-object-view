import { ObjectViewHTML } from "./class/ObjectViewHTML";
import { toValue as toAny } from "./class/privateMethods";
import { escAttr, escText, maxNum, toNum } from "./tools";


const makeNode = (kind, width, height, render) => ({ kind, width, height, render });

const isNode = (any) =>
    any && typeof any === "object" && typeof any.render === "function"
    && typeof any.width === "number" && typeof any.height === "number";

const normalizeNode = (gen, any) => {
    if (isNode(any)) { return any; }
    if (any == null) { return gen.toBlank(); }
    return gen.toText(String(any));
};

const renderNode = (node, x, y, opts) => node.render(x, y, opts);

const makeTextNode = (gen, text, opt = {}) => {
    const { fontFamily, fontSize, lineHeight, charWidth, textColor } = gen.opt;
    const str = String(text ?? "");
    const lines = str.split(/\r?\n/);
    let maxLen = 0;
    for (const line of lines) { if (line.length > maxLen) { maxLen = line.length; } }
    const width = maxLen * charWidth;
    const height = lines.length * lineHeight;
    const title = opt.title != null ? String(opt.title) : null;
    const baseWeight = opt.bold ? "bold" : "normal";
    const render = (x, y, opts) => {
        const weight = (opts && opts.bold) ? "bold" : baseWeight;
        const titleTag = title ? `<title>${escText(title)}</title>` : "";
        const tspans = lines.map((line, i) => {
            const dy = i === 0 ? 0 : lineHeight;
            return `<tspan x="${x}" dy="${dy}">${escText(line)}</tspan>`;
        }).join("");
        return `<text x="${x}" y="${y}" dominant-baseline="text-before-edge" style="font-family:${escAttr(fontFamily)}; font-size:${fontSize}px; fill:${escAttr(textColor)}; font-weight:${weight};">${titleTag}${tspans}</text>`;
    };
    return makeNode("text", width, height, render);
};

const makeImageNode = (gen, href, width, height, title) => {
    const w = width || 0;
    const h = height || 0;
    const ttl = title != null ? String(title) : null;
    const render = (x, y) => {
        const titleTag = ttl ? `<title>${escText(ttl)}</title>` : "";
        return `<image href="${escAttr(href)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMinYMin meet">${titleTag}</image>`;
    };
    return makeNode("image", w, h, render);
};

const makeLinkNode = (gen, href, child) => {
    const node = normalizeNode(gen, child);
    const render = (x, y, opts) => `<a href="${escAttr(href)}">${renderNode(node, x, y, opts)}</a>`;
    return makeNode("link", node.width, node.height, render);
};

const makeTableNode = (gen, headerRow, rows) => {
    const blank = gen.toBlank();
    const allRows = [];
    if (headerRow) { allRows.push({ ...headerRow, isHeader:true }); }
    for (const r of rows) { allRows.push(r); }

    const colCount = allRows.reduce((m, r) => Math.max(m, r.cells.length), 0);
    const colWidths = new Array(colCount).fill(0);
    const rowHeights = new Array(allRows.length).fill(0);

    const normRows = allRows.map((row, rIndex) => {
        const cells = [];
        for (let c = 0; c < colCount; c++) {
            const cellRaw = row.cells[c] ?? blank;
            const cellObj = (cellRaw && typeof cellRaw === "object" && "node" in cellRaw)
                ? cellRaw
                : { node: cellRaw, isHeader:false };
            const node = normalizeNode(gen, cellObj.node);
            const cellW = node.width + gen.opt.cellPaddingX * 2;
            const cellH = node.height + gen.opt.cellPaddingY * 2;
            if (cellW > colWidths[c]) { colWidths[c] = cellW; }
            if (cellH > rowHeights[rIndex]) { rowHeights[rIndex] = cellH; }
            cells.push({ node, isHeader: !!cellObj.isHeader, rowIsHeader: !!row.isHeader });
        }
        return { ...row, cells };
    });

    const width = colWidths.reduce((a, b) => a + b, 0);
    const height = rowHeights.reduce((a, b) => a + b, 0);

    const render = (x, y) => {
        let out = `<g class="Table" shape-rendering="crispEdges">`;

        let yPos = y;
        for (let r = 0; r < normRows.length; r++) {
            let xPos = x;
            const row = normRows[r];
            for (let c = 0; c < colCount; c++) {
                const w = colWidths[c];
                const h = rowHeights[r];
                const fill = row.isHeader ? gen.opt.headerFill : gen.opt.cellFill;
                if (fill && fill !== "none") {
                    out += `<rect x="${xPos}" y="${yPos}" width="${w}" height="${h}" fill="${escAttr(fill)}"/>`;
                }
                xPos += w;
            }
            yPos += rowHeights[r];
        }

        if (gen.opt.borderWidth > 0 && gen.opt.borderColor) {
            const stroke = ` stroke="${escAttr(gen.opt.borderColor)}" stroke-width="${gen.opt.borderWidth}"`;
            const xEdges = [x];
            const yEdges = [y];
            for (let i = 0, acc = x; i < colWidths.length; i++) {
                acc += colWidths[i];
                xEdges.push(acc);
            }
            for (let i = 0, acc = y; i < rowHeights.length; i++) {
                acc += rowHeights[i];
                yEdges.push(acc);
            }
            out += `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="none"${stroke}/>`;
            for (let i = 1; i < xEdges.length - 1; i++) {
                const xi = xEdges[i];
                out += `<line x1="${xi}" y1="${y}" x2="${xi}" y2="${y + height}"${stroke}/>`;
            }
            for (let i = 1; i < yEdges.length - 1; i++) {
                const yi = yEdges[i];
                out += `<line x1="${x}" y1="${yi}" x2="${x + width}" y2="${yi}"${stroke}/>`;
            }
        }

        yPos = y;
        for (let r = 0; r < normRows.length; r++) {
            let xPos = x;
            const row = normRows[r];
            for (let c = 0; c < colCount; c++) {
                const cell = row.cells[c];
                const contentX = xPos + gen.opt.cellPaddingX;
                const contentY = yPos + gen.opt.cellPaddingY;
                const isBold = cell.rowIsHeader || cell.isHeader;
                out += renderNode(cell.node, contentX, contentY, isBold ? { bold:true } : null);
                xPos += colWidths[c];
            }
            yPos += rowHeights[r];
        }

        out += `</g>`;
        return out;
    };

    return makeNode("table", width, height, render);
};

const renderSVG = (gen, node) => {
    const pad = gen.opt.viewPadding;
    const width = node.width + pad * 2;
    const height = node.height + pad * 2;
    const bg = (gen.opt.background && gen.opt.background !== "none")
        ? `<rect x="0" y="0" width="${width}" height="${height}" fill="${escAttr(gen.opt.background)}"/>`
        : "";
    const content = renderNode(node, pad, pad);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${bg}<g class="View">${content}</g></svg>`;
};

export class ObjectViewSVG extends ObjectViewHTML {

    constructor(opt = {}) {
        super(opt);
        const fontSize = maxNum(1, toNum(opt.fontSize, 12));
        const lineHeight = maxNum(1, toNum(opt.lineHeight, 1.2)) * fontSize;
        const charWidth = maxNum(1, toNum(opt.charWidth, toNum(opt.charWidthRatio, 0.6) * fontSize));
        this.opt = Object.freeze({
            ...this.opt,
            fontFamily: opt.fontFamily || "monospace",
            fontSize,
            lineHeight,
            charWidth,
            cellPaddingX: maxNum(0, toNum(opt.cellPaddingX, 6)),
            cellPaddingY: maxNum(0, toNum(opt.cellPaddingY, 4)),
            borderWidth: maxNum(0, toNum(opt.borderWidth, 1)),
            borderColor: opt.borderColor || "#000",
            headerFill: opt.headerFill === undefined ? "#f0f0f0" : opt.headerFill,
            cellFill: opt.cellFill === undefined ? "none" : opt.cellFill,
            textColor: opt.textColor || "#000",
            viewPadding: maxNum(0, toNum(opt.viewPadding, 2)),
            background: opt.background || "none"
        });
    }

    toView(content) { return content; }

    toList(items) { return makeTableNode(this, null, items); }
    toListRow(key, item, rowKey) { return { cells:[ { node:key, isHeader:true }, item ], rowKey }; }
    toListKey(key) { return key; }
    toListItem(item) { return item; }

    toTable(cols, rows) { return makeTableNode(this, cols, rows); }
    toTableCols(cols) { return { cells:cols, isHeader:true }; }
    toTableCol(col, colKey) { return col; }
    toTableRows(rows) { return rows; }
    toTableRow(values, rowKey) { return { cells:values, rowKey }; }
    toTableCell(value, col, rowKey, colKey) { return value; }

    toBlank() { return makeTextNode(this, ""); }
    toNumber(value) { return makeTextNode(this, this.opt.formatNumber(value)); }
    toDate(date) { return makeTextNode(this, this.opt.formatDate(date)); }
    toBoolean(value) { return makeTextNode(this, value ? "true" : "false"); }

    toImg(url, value, maxHeight, maxWidth) {
        return makeImageNode(this, url.href, maxWidth, maxHeight, value);
    }
    toHref(url, content) { return makeLinkNode(this, url.href, content); }

    toText(str) { return makeTextNode(this, str); }
    toLongText(str, limit) { return makeTextNode(this, str.substring(0, limit) + "...", { title:str }); }

    toValue(any) { return normalizeNode(this, super.toValue(any)); }

    generate(any) { return renderSVG(this, toAny(this, any)); }

}

export const toSVG = (any, opt)=>ObjectViewSVG.generate(any, opt);
export default toSVG;
