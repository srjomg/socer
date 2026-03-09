function zip(arrays) {
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
}

const CONFIG = {
    columns: {
        pid: "object.process.id",
        ppid: "object.process.parent.id",
        pfullpath: "object.process.fullpath",
        ppfullpath: "object.process.parent.fullpath",
        cmdline: "object.process.cmdline",
        time: "time"
    },
    separator: ",",
    startColor: "#FF4136",
    endColor: "#0074D9"
};

function toggleSettings() {
    const settingsBlock = document.getElementById("advanced-settings");
    settingsBlock.classList.toggle("is-hidden");
}


function parseSettings() {
    return {
        pid: document.getElementById("pid_col").value || CONFIG.columns.pid,
        ppid: document.getElementById("ppid_col").value || CONFIG.columns.ppid,
        pfullpath: document.getElementById("pfullpath_col").value || CONFIG.columns.pfullpath,
        ppfullpath: document.getElementById("ppfullpath_col").value || CONFIG.columns.ppfullpath,
        time: CONFIG.columns.time,
        separator: document.getElementById("separator").value || CONFIG.separator
    };
}

function parseCsvFromFile() {
    const settings = parseSettings();

    return new Promise((resolve) => {
        const input = document.getElementById("file");
        if (input.files.length > 0) {
            const reader = new FileReader();

            reader.onload = function(event) {
                const content = event.target.result;
                let result = Papa.parse(content, {
                    "delimiter": settings.separator
                });
                resolve(result);
            };

            reader.readAsText(input.files[0]);
        } else {
            resolve(null);
        }
    });
}

function parseTestCsv() {
    return fetch("./static/test.csv")
        .then(response => {
            if (!response.ok) throw new Error("Файл не найден");
            return response.text();
        })
        .then(csvText => {
            return Papa.parse(csvText, {
                delimiter: settings.separator,
                skipEmptyLines: true
            });
        })
        .catch(err => {
            console.error("Ошибка загрузки теста:", err);
            return null;
        });
}

function getShortName(fullpath, pid) {
    if (!fullpath) return pid;
    return fullpath.split("\\").pop().split("/").pop();
}

function lineToObject(header, line) {
    return Object.fromEntries(zip([
        header,
        line
    ]));
}

function rawToBeauty(raw) {
    let html = "<div class='content is-small'>";

    for ( let [key, val] of Object.entries(raw) ) {
        if (!val) continue;

        html += `
            <div class="mb-2">
                <span class="details-key">${key}</span>
                <pre>${val}</pre>
            </div>`;
    }

    html += "</div>";

    return html;
}

function runLayout() {
    const layoutName = document.getElementById("layout-select").value;
    let options = { name: layoutName };

    if (layoutName === "dagre") {
        options = {
            ...options,
            rankDir: "TB",
            rankSep: 50,
            nodeSep: 50,
            animate: true,
            animationDuration: 500
        };
    } else if (layoutName === "fcose") {
        options = {
            ...options,
            quality: 'proof',
            animate: true,
            animationDuration: 1000,
            fit: true,
            padding: 30,
            gravity: 0.2,
            nodeRepulsion: 8000,
            idealEdgeLength: 200,
            edgeElasticity: 0.45,
            nestingFactor: 0.1,
            nodeSeparation: 100,
            tile: true,
            tilingPaddingVertical: 40,
            tilingPaddingHorizontal: 40,
        };
    }

    cy.layout(options).run();
}

function buildGraph(test = false) {
    const settings = parseSettings();

    let d;
    if (!test) {
        d = parseCsvFromFile();
    } else {
        d = parseTestCsv();
    }

    d.then(data => {
        if (!data || !data.data) return;

        const rows = data.data;

        cy.elements().remove();

        let timestamps = rows.slice(1)
            .map(r => new Date(lineToObject(rows[0], r)[settings.time]).getTime())
            .filter(t => !isNaN(t));
        
        const minT = Math.min(...timestamps);
        const maxT = Math.max(...timestamps);
        const range = maxT - minT || 1;

        let elements = [];
        let pids = new Set();


        for (let i = 1; i < rows.length; ++i) {
            const raw = lineToObject(rows[0], rows[i]);

            const pid = raw[settings.pid];
            const pfullpath = raw[settings.pfullpath];

            const currTime = new Date(raw[settings.time]).getTime();
            const factor = (currTime - minT) / range;
            const nodeColor = interpolateColor(CONFIG.startColor, CONFIG.endColor, factor);
            
            if (pid && !pids.has(pid)) {
                elements.push({ data: {
                    id: String(pid),
                    label: getShortName(pfullpath) || pid,
                    timeColor: nodeColor,
                    raw: raw
                } });
                pids.add(pid);
            }
        }

        for (let i = 1; i < rows.length; ++i) {
            const raw = lineToObject(rows[0], rows[i]);

            const ppid = raw[settings.ppid];
            const ppfullpath = raw[settings.ppfullpath];

            if (ppid && !pids.has(ppid)) {
                elements.push({ data: {
                    id: String(ppid),
                    label: getShortName(ppfullpath) || ppid,
                    timeColor: CONFIG.startColor,
                    raw: {
                        [settings.ppfullpath]: raw[settings.ppfullpath],
                        [settings.ppid]: ppid
                    }
                } });
                pids.add(ppid);
            }
        }

        for (let i = 1; i < rows.length; ++i) {
            const raw = lineToObject(rows[0], rows[i]);
            const pid = raw[settings.pid];
            const ppid = raw[settings.ppid];
            if (pid && ppid) {
                elements.push({data: {
                    id: `${ppid}-${pid}`,
                    source: String(ppid),
                    target: String(pid)
                }});
            }
            
        }

        cy.add(elements);
        runLayout();
        cy.fit();
    });
}

function interpolateColor(color1, color2, factor) {
    if (arguments.length < 3) factor = 0.5;
    const hex = x => {
        const s = x.toString(16);
        return s.length === 1 ? "0" + s : s;
    }

    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);

    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);

    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));

    return "#" + hex(r) + hex(g) + hex(b);
}