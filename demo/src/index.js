import toSVG from "../../dist/esm/svg.mjs";
import testJSON from "./testJson";


window.onload = _=>{
    
    document.getElementById("root").outerHTML = toSVG(testJSON, {longTextSize:32, maxImgHeight:300, maxImgWidth:500});

}

