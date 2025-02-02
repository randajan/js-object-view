# @randajan/js-object-view

[![NPM](https://img.shields.io/npm/v/@randajan/js-object-view.svg)](https://www.npmjs.com/package/@randajan/js-object-view) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

JavaScript library for rendering structured data in HTML format. It supports automatic detection of tabular structures and visualization of deeply nested objects. It is ideal for debugging, admin interfaces, or displaying API responses.

## Installation

You can use the library as an ES module:

```javascript
import { ObjectViewHTML, toHTML } from "./ObjectViewHTML";
```

## Usage

### Basic Example

```javascript
const data = {
    name: "John Doe",
    age: 30,
    hobbies: ["Reading", "Gaming", "Hiking"],
};

const html = toHTML(data);
console.log(html);
```

## Configuration Options

When creating an instance, you can specify options:

```javascript
const options = {
    maxImgHeight: 150, // Maximum height for images in pixels
    maxImgWidth: 250, // Maximum width for images in pixels
    formatDate: d => d.toLocaleString(), // Function to format dates
    formatNumber: n => n.toLocaleString(), // Function to format numbers
    longTextSize: 50, // Maximum length of text before truncation with ellipsis

    // Ratio of rows required for a column to be considered valid within a table
    validColRatio: 0.6,

    // Ratio of valid columns required for an array of objects to be recognized as a table
    validColsRatio: 0.6, 
};

const view = ObjectViewHTML.create(options);
const html = view.generate(data);
```

## Extending / customization
Or if available extension via option is somehow not enough you can create your own generator by extending provided class ObjectViewHTML
Important function is __toValue__ that converts any input into an appropriate representation based on its type. It applies formatting for numbers, booleans, dates, images, URLs, and text while handling unknown types gracefully.

## API

- `toHTML(data, options)`: Returns an HTML representation of the data.
- `ObjectViewHTML.create(options)`: Creates an instance with custom configuration.

## JSX Support

For React and JSX environments, a dedicated module is available: `@randajan/js-object-view/jsx`. It follows the same API structure but provides JSX-compatible components. Instead of `ObjectViewHTML`, use `ObjectViewJSX`, and replace `toHTML` with `toJSX` for rendering inside React components.

```javascript

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

    toBoolean(value) { return <input type="checkbox" checked={value ? true : false} style={{pointerEvents:"none"}}/>; }
    toImg(url, value, maxHeight, maxWidth) {
        return <img alt={url.ref} src={url.href} title={value} style={{"max-height":maxHeight+"px", "max-width":maxWidth+"px"}}/>
    }
    toHref(url, content) { return <a href={url.href} target="_blank">{content}</a>;}

    toText(str) { return <span>{str}</span>; }
    toLongText(str, limit) { return <span title={str}>{str.substring(0, limit)}</span>; }
    toOther(value) { return value; }

}

```

## Support

If you have any questions or suggestions for improvements, feel free to open an issue in the repository.


## License

MIT © [randajan](https://github.com/randajan)
