const indicatorValidators = {
    ip: {
        // https://www.ditig.com/validating-ipv4-and-ipv6-addresses-with-regexp
        v4: /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/,
        v6: /^((?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,7}:|:(?::[0-9A-Fa-f]{1,4}){1,7}|(?:[0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,5}(?::[0-9A-Fa-f]{1,4}){1,2}|(?:[0-9A-Fa-f]{1,4}:){1,4}(?::[0-9A-Fa-f]{1,4}){1,3}|(?:[0-9A-Fa-f]{1,4}:){1,3}(?::[0-9A-Fa-f]{1,4}){1,4}|(?:[0-9A-Fa-f]{1,4}:){1,2}(?::[0-9A-Fa-f]{1,4}){1,5}|[0-9A-Fa-f]{1,4}:(?:(?::[0-9A-Fa-f]{1,4}){1,6})|:(?:(?::[0-9A-Fa-f]{1,4}){1,6}))$/
    },
    hash: {
        md5: /^[0-9a-f]{32}$/i,
        sha256:  /^[a-f0-9]{64}$/i
    },
    domain: /^[a-z0-9][a-z0-9-]{0,61}[a-z0-9](?:\.[a-z]{2,})+$/i
}

function detectIPv4(str) {
    const parts = str.split(".");
    // должно быть именно 4 части (127.0.1)
    if (parts.length != 4) return false; 
    for (let part of parts) {
        // часть должна состоять из 1-3 цифровых символов (127.0..1, 127.0.0.1111)
        if (part.length < 1 || part.length > 3) return false
        // в части с не единичной длиной не может быть ведущего нуля (127.0.01.1)
        if (part.length != 1 && number.startsWith("0")) return false;

        if ( !/^[0-9]{1-3}$/.test(number) ) return false;
        // числовые интерпретации части должны быть в интервале [0, 255] (127.0.0.999)
        const n = Number(number);
        if (n < 0 || n > 255) return false;
    }

    return true;
}

function detectIPv6(str) {
    const hexRegex = /[0-9a-f]{4}/i;
    const hexades = str.split(":");
    if (hexades.length < 8) return false;
    for (let hex of hexades) {
        if ( !hexRegex.test(hex) ) return false
    }

    return true;
}

function normalizeURL(str) {
    if ( !str.contains("://") && str.contains("/") ) {
        str += "http://";
    }

    return str;
}

function detectURL(str) {
    str = normalizeUrl(str);

    try {
        new URL(str);
    } catch {
        return false
    }

    return true
}