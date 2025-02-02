var objectView = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.js
  var src_exports = {};
  __export(src_exports, {
    ObjectViewHTML: () => ObjectViewHTML,
    default: () => src_default,
    defineMapable: () => defineMapable,
    toHTML: () => toHTML
  });

  // src/tools.js
  var isFce = (any) => typeof any === "function";
  var isArr = (any) => Array.isArray(any);
  var isDate = (any) => any instanceof Date;
  var isObj = (any) => any != null && any.constructor === Object;
  var isImg = (url) => /\.(jpg|jpeg|png|gif|webp|bmp|svg|ico|apng|avif)$/.test(url.pathname);
  var toFce = (any, customDef = false, defVal) => isFce(any) ? any : isFce(customDef) ? customDef : customDef ? () => def : () => {
  };
  var parseURL = (any) => {
    try {
      return new URL(any);
    } catch (e) {
    }
  };
  var isNum = (any) => typeof any === "number" && !isNaN(any);
  var toNum = (any, def2 = 0) => isNum(any) ? any : def2;
  var maxNum = (...n) => Math.max(...n.filter(isNum));
  var minNum = (...n) => Math.min(...n.filter(isNum));
  var frameNum = (any, min, max) => maxNum(min, minNum(max, any));
  var _mapables = [];
  var defineMapable = ({ name, check, entries, get }) => {
    if (!isFce(check)) {
      throw new Error("check should be a function");
    }
    if (!isFce(entries)) {
      throw new Error("entries should be a function");
    }
    if (!isFce(get)) {
      throw new Error("get should bet a function");
    }
    _mapables.push({ name, check, entries, get });
  };
  defineMapable({ name: "Array", check: isArr, entries: (a) => a.entries(), get: (a, k) => a[k] });
  defineMapable({ name: "Map", check: (a) => a instanceof Map, entries: (a) => a.entries(), get: (a, k) => a.get(k) });
  defineMapable({ name: "Set", check: (a) => a instanceof Set, entries: (a) => a.entries(), get: (a, k) => a.has(k) });
  defineMapable({ name: "Object", check: isObj, entries: Object.entries, get: (a, k) => a[k] });
  var getMapable = (any) => {
    if (any == null) {
      return;
    }
    for (const m of _mapables) {
      if (m.check(any)) {
        return m;
      }
    }
  };
  var isMapable = (any) => !!getMapable(any);
  var getKey = (any, key) => getMapable(any)?.get(any, key);
  var list = (entries, exe) => {
    const res = [];
    for (const [key, val] of entries) {
      const r = exe(val, key);
      if (r !== void 0) {
        res.push(r);
      }
    }
    return res;
  };

  // src/class/privateMethods.js
  var toTableCell = (gen, val, col, rkey, ckey) => gen.toTableCell(toValue(gen, val), col, rkey, ckey);
  var toTableRow = (gen, vals, cols, rkey) => gen.toTableRow(cols.map((col, ckey) => toTableCell(gen, getKey(vals, col), col, rkey, ckey)), rkey);
  var toTableCol = (gen, name, key) => gen.toTableCol(toValue(gen, name), key);
  var toTableRows = (gen, rows, cols) => gen.toTableRows(list(getMapable(rows).entries(rows), (vals, key) => toTableRow(gen, vals, cols, key)));
  var toTableCols = (gen, cols) => gen.toTableCols(cols.map((name, key) => toTableCol(gen, name, key)));
  var toTable = (gen, rows, cols) => gen.toTable(toTableCols(gen, cols), toTableRows(gen, rows, cols));
  var toListItem = (gen, item, key, map) => gen.toListItem(toValue(gen, item), key, map);
  var toListKey = (gen, name, map) => map === "Set" ? gen.toBlank() : gen.toListKey(toValue(gen, name), map);
  var toListRow = (gen, item, key, map) => gen.toListRow(toListKey(gen, key, map), toListItem(gen, item, key, map), key, map);
  var toList = (gen, pairs) => {
    const m = getMapable(pairs);
    return gen.toList(list(m.entries(pairs), (item, key) => toListRow(gen, item, key, m.name)), m.name);
  };
  var fetchArrayColumns = (gen, arr) => {
    if (!isArr(arr)) {
      return;
    }
    const cols = [];
    const stat = /* @__PURE__ */ new Map();
    for (const k in arr) {
      const first = k === "0";
      const any = arr[k];
      const m = getMapable(any);
      if (!m) {
        return;
      }
      for (const [k2, v] of m.entries(any)) {
        const s = stat.get(k2) || 0;
        if (!s) {
          let caption = k2;
          if (m.name === "Array" && first) {
            caption = v;
          }
          cols.push(caption);
        }
        stat.set(k2, s + 1);
      }
    }
    let colsOk = 0;
    const rowsReqOk = arr.length * gen.opt.validColRatio;
    for (const [_, s] of stat.entries()) {
      if (s > rowsReqOk) {
        colsOk++;
      }
    }
    if (colsOk > cols.length * gen.opt.validColsRatio) {
      return cols;
    }
  };
  var toValue = (gen, any) => {
    if (any == null) {
      return gen.toBlank();
    }
    if (!isMapable(any)) {
      return gen.toValue(any);
    }
    const cols = fetchArrayColumns(gen, any);
    return gen.toView(cols ? toTable(gen, any, cols) : toList(gen, any));
  };

  // src/class/ObjectViewHTML.js
  var ObjectViewHTML = class {
    static create(opt) {
      return new this(opt);
    }
    static generate(any, opt) {
      return this.create(opt).generate(any);
    }
    constructor(opt = {}) {
      this.opt = Object.freeze({
        maxImgHeight: maxNum(0, toNum(opt.maxImgHeight, 100)),
        maxImgWidth: maxNum(0, toNum(opt.maxImgWidth, 200)),
        formatDate: toFce(opt.formatDate, (d) => d.toLocaleString()),
        formatNumber: toFce(opt.formatNumber, (n) => n.toLocaleString()),
        longTextSize: maxNum(0, toNum(opt.longTextSize, 32)),
        toUnknown: toFce(opt.toUnknown),
        isImg: toFce(opt.isImage, isImg),
        validColsRatio: frameNum(toNum(opt.validColsRatio, 0.6), 0, 1),
        validColRatio: frameNum(toNum(opt.validColRatio, 0.6), 0, 1)
      });
    }
    toView(content) {
      return `<div class="View">${content}</div>`;
    }
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
      if (isDate(any)) {
        return this.toDate(any);
      }
      const { toUnknown, isImg: isImg2, longTextSize, maxImgHeight, maxImgWidth } = this.opt;
      const t = typeof any;
      if (t === "number" || t === "bigint") {
        return this.toNumber(any);
      }
      if (t === "boolean") {
        return this.toBoolean(any);
      }
      if (t !== "string" && !t.hasOwnProperty("toString")) {
        return toUnknown(any);
      }
      any = String(any);
      const url = parseURL(any);
      if (url && isImg2(url)) {
        return this.toHref(url, this.toImg(url, any, maxImgHeight, maxImgWidth));
      }
      const text = any.length >= longTextSize ? this.toLongText(any, longTextSize) : this.toText(any);
      return url ? this.toHref(url, text) : text;
    }
    toBlank() {
      return "";
    }
    toNumber(value) {
      return this.opt.formatNumber(value);
    }
    toDate(date) {
      return this.opt.formatDate(date);
    }
    toBoolean(value) {
      return `<input type="checkbox" ${value ? "checked" : ""} style="pointer-events:none">`;
    }
    toImg(url, value, maxHeight, maxWidth) {
      return `<img alt="${url.ref}" src="${url.href}" title="${value}" style="max-height:${maxHeight}px; max-width:${maxWidth}px"/>`;
    }
    toHref(url, content) {
      return `<a href=${url.href} target="_blank">${content}</a>`;
    }
    toText(str) {
      return `<span>${str}</span>`;
    }
    toLongText(str, limit) {
      return `<span title="${str}">${str.substring(0, limit) + "..."}</span>`;
    }
    generate(any) {
      return toValue(this, any);
    }
  };
  var toHTML = (any, opt) => ObjectViewHTML.generate(any, opt);

  // src/index.js
  var src_default = toHTML;
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=objectView.js.map
