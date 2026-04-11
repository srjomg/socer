const HEX_REGEX = /[0-9a-f]{4}/i;
const DETECTORS = {
    "ipv4": detectIPv4,
    "ipv6": detectIPv6,
    "url": detectURL,
    "domain": detectDomain,
    "hash_sha256": detectHashSHA256,
    "hash_md5": detectHashMD5
};

export function detectEntity(str) {
    let cleanStr = refang(str.trim());

    for ( let [entityType, detector] of Object.entries(DETECTORS) ) {
        if ( detector(cleanStr) === true) {
            return entityType;
        }
    }

    return undefined;
}

function detectIPv4(str) {
    const parts = str.split(".");
    // должно быть именно 4 части (127.0.1)
    if (parts.length != 4) return false; 
    for (let part of parts) {
        // часть должна состоять из 1-3 цифровых символов (127.0..1, 127.0.0.1111)
        if (part.length < 1 || part.length > 3) return false
        // в части с не единичной длиной не может быть ведущего нуля (127.0.01.1)
        if (part.length != 1 && part.startsWith("0")) return false;
        // в части должны присутствовать только числовые символы
        if ( !/^[0-9]+$/.test(part) ) return false;
        // числовые интерпретации части должны быть в интервале [0, 255] (127.0.0.999)
        const n = Number(part);
        if (n < 0 || n > 255) return false;
    }

    return true;
}

function detectIPv6(str) {
    const hexades = str.split(":");
    if (hexades.length < 8) return false;
    for (let hex of hexades) {
        if ( !HEX_REGEX.test(hex) ) return false
    }

    return true;
}

function detectHashSHA256(str) {
    if (str.length != 64) return false;
    if ( !HEX_REGEX.test(str) ) return false;

    return true;
}

function detectHashMD5(str) {
    if (str.length != 32) return false;
    if ( !HEX_REGEX.test(str) ) return false;

    return true;
}

function normalizeURL(str) {
    if ( !str.includes("://") && str.includes("/") ) {
        str = "http://" + str;
    }

    return str;
}

function detectURL(str) {
    str = normalizeURL(str);

    try {
        new URL(str);
    } catch {
        return false
    }

    return true
}

function detectDomain(str) {
    const allowedSymbolsRegex = /^[a-z0-9\-]+$/i;
    const parts = str.split(".");
    if (parts.length < 2) return false;

    for (let part of parts) {
        if (part.length < 1) return false;
        if ( !allowedSymbolsRegex.test(part) ) return false;
        if ( part.startsWith("-") || part.endsWith("-") ) return false;
        
        let interParts = part.split("xn--");
        if (interParts.length > 2) return false;
        if (interParts.length === 2 && interParts[0] !== "") return false;
    }
    
    return true;
}

function refang(str) {
    return str.replace(/\[at\]/, "@")
        .replace("hxxp://", "http://")
        .replace("hxxps://", "https://")
        .replace(/\[[\.]\]/, "")
        .replace(/\([\.]\)/, "");
}