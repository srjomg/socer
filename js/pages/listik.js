import { RESOURCES, ENTITY_TO_RESOURCE } from "../config.js";
import { detectEntity } from "../utils/indicator-parser.js";

function constructResources(entityType, entity) {
    let listikResult = document.getElementById("listik-result")
    listikResult.replaceChildren();

    for (let resource of ENTITY_TO_RESOURCE[entityType]) {
        let resourceInfo = RESOURCES[resource];

        const divColumns = document.createElement("div");
        divColumns.classList = "columns is-centered";

        const divColumn = document.createElement("div");
        divColumn.classList = "column is-10";

        const h2Title = document.createElement("h2");
        h2Title.textContent = resourceInfo["title"];
        h2Title.classList = "title"

        const pDescription = document.createElement("p");
        pDescription.textContent = resourceInfo["description"];

        const aLink = document.createElement("a");
        aLink.href = (resourceInfo["baseUrl"] + resourceInfo["lookups"][entityType]).replace("<?>", entity);
        aLink.textContent = `${resource} ${entityType} analysis`

        // divContainer.appendChild(divColumns);
        divColumns.appendChild(divColumn);

        divColumn.appendChild(h2Title);
        divColumn.appendChild(pDescription)
        divColumn.appendChild(aLink);

        listikResult.appendChild(divColumns);
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
            <div id="listik-result" class="container">
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