import { initRouter } from "./router.js";

if (typeof cytoscapeDagre !== "undefined") {
    cytoscape.use(cytoscapeDagre);
}

document.addEventListener("DOMContentLoaded", () => {
    initRouter();
});