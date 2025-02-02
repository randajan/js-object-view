import toHTML from "../../dist";
import testJSON from "./testJson";


window.onload = _=>{
    
    document.getElementById("root").outerHTML = toHTML(testJSON, {longTextSize:32, maxImgHeight:300, maxImgWidth:500});

}

