export function zip(arrays) {
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
}

export function getShortName(fullpath) {
    if (!fullpath) return null;
    return fullpath.split("\\").pop().split("/").pop();
}

export function interpolateColor(color1, color2, factor) {
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

export function readFileFromInput(input) {
    return new Promise(function (resolve, reject) {
        const file = input.files[0];
        if (!file) {
            reject( new Error("File not selected") );
            return;
        }

        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);

        reader.readAsText(file);
    });    
}