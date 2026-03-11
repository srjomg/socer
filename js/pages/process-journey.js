import { buildGraph, rawToBeauty } from "../utils/graph-helpers.js";

let cyInstance = null;

function initCytoscape() {
    cyInstance = cytoscape({
        container: document.getElementById('cy'),
        style: [
            {
            selector: 'node',
            style: {
                'shape': 'round-rectangle',
                'background-color': 'data(timeColor)',
                'label': 'data(label)',
                'font-size': '10px',
                'text-valign': 'bottom',
                'width': '20px',
                'height': '20px'    
            }
            },

            {
            selector: 'node[label *= "powershell.exe"], node[label *= "cmd.exe"]',
            style: {
                'shape': 'diamond',
            }
            },

            {
            selector: 'edge',
            style: {
                'width': 2,
                'line-color': '#ccc',
                'curve-style': 'taxi',
                'taxi-direction': 'vertical',
                'target-arrow-shape': 'triangle',
                'target-arrow-color': '#ccc',
                'arrow-scale': 1.2
            }
            }
        ],

        layout: {
            name: 'grid',
            rows: 1
        }
    });

    cyInstance.on("tap", "node", function(event) {
        const raw = event.target.data("raw");
        document.getElementById("details-content").innerHTML = rawToBeauty(raw);
    });
}


export const ProcessJourneyPage = {
    render: () => `
        <!-- Секция для построения графа -->
    <section class="section">

        <div class="container is-fluid">
            <!-- Контейнер для кнопок управления -->
            <div class="field is-grouped is-grouped-multiline">
                <!-- Кнопка загрузки -->
                <div class="control">
                    <div class="file has-name is-primary">
                        <label class="file-label">
                            <input class="file-input" type="file" id="file" accept=".csv">
                            <span class="file-cta">Загрузить CSV</span>
                        </label>
                    </div>
                </div>

                <!-- Кнопка построения -->
                <div class="control">
                    <button class="button is-link" id="build-graph-button">Построить дерево</button>
                </div>

                <!-- Кнопка настроек -->
                <div class="control">
                    <button class="button is-light" id="open-advanced-settings-button">
                        <span>Настройки</span>
                        <span class="icon is-small">⚙️</span>
                    </button>
                </div>
            </div>

            <!-- Блок продвинутых настроек (скрыт) -->
            <div id="advanced-settings" class="box is-hidden mt-3">
                <h3 class="title is-6">Advanced Parser Settings</h3>
                <div class="columns is-multiline">
                    <div class="column is-3">
                        <label class="label is-small">PID Column</label>
                        <input class="input is-small" type="text" id="pid_col" value="object.process.id">
                    </div>
                    <div class="column is-3">
                        <label class="label is-small">PPID Column</label>
                        <input class="input is-small" type="text" id="ppid_col" value="object.process.parent.id">
                    </div>
                    <div class="column is-3">
                        <label class="label is-small">Process Fullpath Column</label>
                        <input class="input is-small" type="text" id="pfullpath_col" value="object.process.fullpath">
                    </div>
                    <div class="column is-3">
                        <label class="label is-small">Parent Process Fullpath Column</label>
                        <input class="input is-small" type="text" id="ppfullpath_col" value="object.process.parent.fullpath">
                    </div>
                    <div class="column is-3">
                        <label class="label is-small">Separator</label>
                        <input class="input is-small" type="text" id="separator" value=",">
                    </div>
                </div>
            </div>

            <!-- Две колонки: граф и данные -->
            <div class="columns is-gapless">

                <!-- Первая колонка с графом -->
                <div class="column is-8">
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">Process Visualizer</p>
                    </header>
                    <div class="card-content p-0">
                        <div id="cy"></div> <!-- Cytoscape -->
                    </div>
                </div>
                </div>

                <!-- Вторая колонка с данными -->
                <div class="column is-4">
                <div class="card details-container">
                    <header class="card-header"><p class="card-header-title">Details</p></header>
                    <div class="card-content">
                        <div id="details-content">
                            <p class="has-text-grey">Выберите узел на графе</p>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </section>
    `,
    init: () => {
        initCytoscape();
        document.getElementById("build-graph-button").addEventListener("click", () => {
            buildGraph(cyInstance);
        });
        document.getElementById("open-advanced-settings-button").addEventListener("click", () => {
            document.getElementById("advanced-settings").classList.toggle("is-hidden");
        });
    }
};