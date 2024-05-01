import slib, { argv } from "@randajan/simple-lib";


slib(argv.isBuild, {
    lib:{
        loader:{
            ".js":"jsx"
        },
        entries:[ "./index.js", "./mods/toJSX.js", "./mods/toHTML.js"]
    },
    
})