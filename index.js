import slib, { argv } from "@randajan/simple-lib";


slib(argv.isBuild, {
    lib:{
        minify:false,
        loader:{
            ".js":"jsx"
        },
        entries:[ "./index.js", "./jsx.js", "./svg.js"],
        standalone:"objectView"
    },
    
})
