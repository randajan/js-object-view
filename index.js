import slib from "@randajan/simple-lib";


slib(process.env.NODE_ENV !== "dev", {
    lib:{
        loader:{
            ".js":"jsx"
        },
        entries:[ "./index.js", "./mods/toJSX.js", "./mods/toHTML.js"]
    },
    
})