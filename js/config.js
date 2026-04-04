export const [IP, HASH, URL, DOMAIN, SSL_THUMBPRINT] = ["ip", "hash", "url", "domain", "ssl-thumbprint"];

export const RESOURCES = {
    "virustotal": {
        "title": "VirusTotal",
        "description": "VirusTotal — бесплатная служба, осуществляющая анализ подозрительных файлов и ссылок (URL) на предмет выявления вирусов, червей, троянов и всевозможных вредоносных программ.",
        "accepts": [IP, HASH, URL, DOMAIN, SSL_THUMBPRINT],
        "baseUrl": "https://www.virustotal.com",
        "lookups": {
            "ip": "/gui/ip-address/<?>",
            "hash": "/gui/file/<?>",
            "domain": "/gui/domain/<?>",
            "url": "/gui/url/<?>" // с оговорками
        }
    }
}

// потом сделать автоматически
export const ENTITY_TO_RESOURCE = {
    [IP]: ["virustotal"],
    [HASH]: ["virustotal"],
    [URL]: ["virustotal"],
    [DOMAIN]: ["virustotal"],
    [SSL_THUMBPRINT]: ["virustotal"],
}