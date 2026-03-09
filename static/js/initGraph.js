cytoscape.use(cytoscapeDagre);
if (typeof fcose !== 'undefined') {
    cytoscape.use(fcose);
}

var cy = cytoscape({
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
})

cy.on("tap", "node", function(event) {
    const raw = event.target.data("raw");
    let container = document.getElementById("details-content");
    
    container.innerHTML = "";

    if (!raw || Object.keys(raw).length === 0) {
        container.innerHTML = '<div class="notification is-warning is-light">Данные отсутствуют</div>';
        return;
    }

    console.log(rawToBeauty);
    container.innerHTML = rawToBeauty(raw);
});