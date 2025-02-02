import objectView from "../../dist/mods/toHTML";
import testJSON from "./testJson";


window.onload = _=>{
    
    document.getElementById("root").outerHTML = objectView(testJSON)

}

