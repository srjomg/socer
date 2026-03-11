import { ProcessJourneyPage } from "./pages/process-journey.js";
import { _debug } from "./dev.js";

function handleRoute(route) {
    let app = document.getElementById("app");

    if ( ["process-journey", "process_journey","journey", "pj"].includes(route) ) {
        app.innerHTML = ProcessJourneyPage.render();
        ProcessJourneyPage.init();
    }
    else if ( ["toolbox", "tb"].includes(route) ) {
        app.innerHTML = "<p>Toolbox</p>"
    }
    else if (route === "") {
        app.innerHTML = "<p>Main page</p>"
    }
    else {
        app.innerHTML = "<p>404 Not Found</p>"
    }
}


function getLocationHash() {
    return window.location.hash.slice(1);
}


export function initRouter() {
    _debug("InitRouter()");
    handleRoute( getLocationHash() );
    window.addEventListener("hashchange", () => {
        handleRoute( getLocationHash() );   
    });
}