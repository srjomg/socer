import { readFileFromInput, zip, interpolateColor, getShortName } from "./specials.js";

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

async function parseCsvFromFile() {
    const settings = parseSettings();

    const input = document.getElementById("file");
    const content = await readFileFromInput(input);
    let result = Papa.parse(content, {
        "delimiter": settings.separator
    });

    return result
}


function lineToObject(header, line) {
    return Object.fromEntries(zip([
        header,
        line
    ]));
}

export function rawToBeauty(raw) {
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

export function buildGraph(cy) {
    const settings = parseSettings();

    parseCsvFromFile().then(data => {
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
        cy.layout({
            name: "dagre",
            rankDir: "TB",
            rankSep: 50,
            nodeSep: 50,
            animate: true,
            animationDuration: 500
        }).run();
        cy.fit();
    });
}
