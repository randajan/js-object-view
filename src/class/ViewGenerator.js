import { isFce, isObj } from "../tools";
import { ProcessContext } from "./ProcessContext";

const _partsReq = ['view', 'list', 'listRow', 'listKey', 'listItem', 'table', 'tableCols', 'tableCol', 'tableRows', 'tableRow', 'tableCell', "number", "boolean", "date", "url", "string", "other"];

export class ViewGenerator {

    constructor(elements) {
        if (!isObj(elements)) { throw new Error("elements must be an object"); }

        const miss = [..._partsReq].filter(partName=>!isFce(elements[partName]));
        if (miss.length) { throw new Error(`elements missing function: '${miss.join("', '")}'`); }

        Object.assign(this, elements);
    }

    generate(any, opt={}) {
        const ctx = new ProcessContext(this, opt);
        return ctx.value(any);
    }

}


export const createViewGenerator = (elements)=>{
    const gen = new ViewGenerator(elements);
    return gen.generate.bind(gen);
}
