import sapp from "@randajan/simple-lib";


sapp(process.env.NODE_ENV !== "dev", {
    external:["@randajan/jet-core"]
})