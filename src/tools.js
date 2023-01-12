import jet from "@randajan/jet-core";

export const passArgs = (...args)=>args.length > 1 ? args : args[0];
export const runOrPass = (fce, ...args)=>jet.isRunnable(fce) ? fce(...args) : passArgs(...args);

export const fetchArrayColumns = (arr, validColumnsPercentage=.6, validRowPercentage=.6)=>{
    let _j;
    const cols = [];
    const stat = {};

    for (const k in arr) {
        const first = k === "0";
        const v = arr[k];
        const j = jet(v);
        if (first) { _j = j; }
        if (_j !== j) { return; }
        if (j === "Object") {
            for (const i in v) {
                if (!stat[i]) { cols.push(i); stat[i] = 0; }
                stat[i] ++;
            }
        } else if (j === "Array") {
            for (const i in v) {
                if (!stat[i]) { if (first) { cols.push(v[i]); } stat[i] = 0; }
                if (i >= cols.length) { cols.push(i); }
                stat[i] ++;
            }
        } else { return }
    }

    let _colok = 0;
    const _alok = arr.length * validRowPercentage;
    for (const c in stat) {
        const s = stat[c];
        if (s > _alok) { _colok ++; }
    }

    if (_colok > (cols.length * validColumnsPercentage)) { return cols; }
}