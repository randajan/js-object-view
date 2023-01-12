# @randajan/js-object-view

[![NPM](https://img.shields.io/npm/v/@randajan/js-object-view.svg)](https://www.npmjs.com/package/@randajan/js-object-view) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Goal is to organize key - value pairs of object (json) and organize them for custom view

## Install

```bash
npm install @randajan/js-object-view
```

or

```bash
yarn add @randajan/js-object-view
```


## Main methods
*example of use*
```js

document.getElementById("root").outerHTML = objectView(testJSON, {
    view:(content)=>`<div class="View">${content}</div>`,
    list:(items)=>`<table class="List" style="border-collapse: collapse;"><tbody>${items.join("")}</tbody></table>`,
    listRow:(key, item, rowKey)=>`<tr class="ListRow">${key}${item}</tr>`,
    listKey:(key)=>`<td class="ListKey" style="font-weight:bold; vertical-align:top; padding:2px 10px">${key}</td>`,
    listItem:(item)=>`<td class="ListItem" style="vertical-align:top; padding:2px 10px; border:1px solid black;">${item}</td>`,
    table:(cols, rows)=>`<table class="Table" style="border-collapse: collapse;">${cols}${rows}</table>`,
    tableCols:(cols)=>`<thead class="TableCols"><tr>${cols.join("")}</tr></thead>`,
    tableCol:(name, colKey)=>`<th class="TableCol">${name}</th>`,
    tableRows:(rows)=>`<tbody class="TableRows">${rows.join("")}</tbody>`,
    tableRow:(values, rowKey)=>`<tr class="TableRow">${values.join("")}</tr>`,
    tableCell:(value, col, colKey, rowKey)=>`<td class="TableCell" style="vertical-align:top; padding:2px 10px; border:1px solid black;">${value}</td>`,
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
})

```


## License

MIT © [randajan](https://github.com/randajan)