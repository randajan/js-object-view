export const isStr = any=>typeof any === "string";
export const isFce = any=>typeof any === "function";
export const isArr = any=>Array.isArray(any);
export const isDate = any=>any instanceof Date;
export const isObj = any=>(any != null && any.constructor === Object);

export const parseURL = any=>{ try { return new URL(any); } catch(e) { } }

export const isNum = any=>typeof any === "number" && !isNaN(any);
export const toNum = (any, def=0)=>isNum(any) ? any : def;
export const maxNum = (...n)=>Math.max(...n.filter(isNum));
export const minNum = (...n)=>Math.min(...n.filter(isNum));
export const frameNum = (any, min, max)=>maxNum(min, minNum(max, any));

const _mapables = [];

export const defineMapable = ({ name, check, entries, get })=>{
    if (!isFce(check)) { throw new Error("check should be a function"); }
    if (!isFce(entries)) { throw new Error("entries should be a function"); }
    if (!isFce(get)) { throw new Error("get should bet a function"); }

    _mapables.push({name, check, entries, get});
}

defineMapable({ name:"Array", check:isArr, entries:a=>a.entries(), get:(a, k)=>a[k] });
defineMapable({ name:"Map", check:a=>a instanceof Map, entries:a=>a.entries(), get:(a, k)=>a.get(k) });
defineMapable({ name:"Set", check:a=>a instanceof Set, entries:a=>a.entries(), get:(a, k)=>a.has(k) });
defineMapable({ name:"Object", check:isObj, entries:Object.entries, get:(a, k)=>a[k] });

export const getMapable = any=>{
    if (any == null) { return; }
    for (const m of _mapables) {
        if (m.check(any)) { return m; }
    }
}

export const isMapable = any=>!!getMapable(any);
export const getKey = (any, key)=>getMapable(any)?.get(any, key);
export const getEntries = any=>getMapable(any)?.entries(any);

export const list = (entries, exe)=>{
    const res = [];
    for (const [key, val] of entries) {
        const r = exe(val, key);
        if (r !== undefined) { res.push(r); }
    }
    return res;
}