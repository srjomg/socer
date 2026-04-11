import { RESOURCES, ENTITY_TO_RESOURCES } from "../config.js";
import { detectEntity } from "../utils/indicator-parser.js";

function constructUrl(baseUrl, endpoint, entity, preprocess, symbol = "<?>") {
    (typeof preprocess === "function") ? entity = preprocess(entity) : false;

    return baseUrl + endpoint.replace(symbol, entity);
}

function constructResources(entityType, entity) {
    let listikResult = document.getElementById("listik-result-resources")
    listikResult.replaceChildren();

    // ```
    // <div class="columns is-centered">
    //     <div class="column is-10">
    //         <h2 class="title">{title} <a href="{lookupUrl}">[LOOKUP ↗]</a></h2>
    //         <p>Группа: {group}</p>
    //         <p>Принимает: {accepts}</p>
    //         <p>{description}</p>
    //     </div>
    // </div>
    // ```
    // куда можно что-то внедрить - в lookupUrl
    for (let resource of ENTITY_TO_RESOURCES[entityType]) {
        console.log(resource);
        let resourceInfo = RESOURCES[resource];
        
        let group = resourceInfo.group;
        let accepts = resourceInfo.accepts.join(", ");

        let tmp = document.createElement("div");
        tmp.innerHTML = `
            <div class="columns is-centered">
                <div class="column is-10">
                    <h2 class="title"><span>${resourceInfo.title}</span></h2>
                    <p>Группа: ${group}</p>
                    <p>Принимает: ${accepts}</p>
                    <p>${resourceInfo.description}</p>
                </div>
            </div>
        `;

        if (resourceInfo["lookups"] && resourceInfo["lookups"][entityType]) {
            let lookupUrl = constructUrl(
                resourceInfo.baseUrl,
                resourceInfo.lookups[entityType].endpoint,
                entity,
                resourceInfo.lookups[entityType].preprocess
            );
            // <a href="${lookupUrl}"></a>
            let space = document.createElement("span");
            space.textContent = " ";

            let link = document.createElement("a");
            link.href = lookupUrl;
            link.target = "_blank";
            link.textContent = "[LOOKUP ↗]";

            tmp.querySelector("h2").appendChild(space);
            tmp.querySelector("h2").appendChild(link);
        }
        

        listikResult.appendChild(tmp.children[0]);
    }


    return false;
}

function inputHandler(event) {
    const listikEntityInfo = document.getElementById("listik-entity-info");

    const value = event.srcElement.value;
    if (!value) return;

    const detectedEntity = detectEntity(value);
    if (detectedEntity === undefined) {
        listikEntityInfo.textContent = "Мы не определили тип сущности :("
        return;
    }

    listikEntityInfo.textContent = `Сущность похожа на ${detectedEntity}`;

    constructResources(detectedEntity, value);

    console.log(event); // TODELETE
}

export const ListikPage = {
    render: () => `
        <section class="section">
            <div class="container">
                <div class="columns is-centered">
                    <div class="column is-10">
                        <h1 class="title has-text-centered">LISTIK</h1>
                        <input id="listik-input" class="input is-rounded" type="text" placeholder="Type entity here" />
                        <p class="is-wide" id="listik-entity-info"></p>
                    </div>
                </div>
            </div>
            <hr>
            <div class="container">
                <div class="columns">
                    <!--<div class="column container is-2">
                        <p>VirusTotal</p>
                        <p>ThreatFox</p>
                        <p>AbuseIPDB</p>
                    </div>-->
                    <div id="listik-result" class="column container">
                        <div id="listik-result-groups" class="tabs is-toggle is-right">
                            <ul>
                                <li><a><span>Group1</span></a></li>
                                <li><a><span>Group2</span></a></li>
                                <li><a><span>Group3</span></a></li>
                            </ul>
                        </div>
                        <div id="listik-result-resources"></div>
                    </div>
                </div>
            </div>
            </div>
        </section>
    `,
    init: () => {
        document.getElementById("listik-input").addEventListener("change", inputHandler);
    }
};

// <div class="columns is-centered">
//     <div class="column is-10">
//         <h2 class="title">VirusTotal</h2>
//         <p>Текст</p>
//     </div>
// </div>