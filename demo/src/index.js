import toHTML from "../../dist/esm/index.mjs";
import testJSON from "./testJson";


window.onload = _=>{
    
    document.getElementById("root").outerHTML = toHTML(testJSON, {longTextSize:32, maxImgHeight:300, maxImgWidth:500});

}

