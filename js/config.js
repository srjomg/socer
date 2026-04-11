export const ENTITIES = {
    "ipv4": {
        "title": "IPv4"
    },
    "ipv6": {
        "title": "IPv6"
    },
    "hash_md5": {
        "title": "Hash MD5"
    },
    "hash_sha256": {
        "title": "Hash SHA256"
    },
    "url": {
        "title": "URL"
    },
    "ssl_thumbprint": {
        "title": "SSL Thumbprint"
    },
    "email": {
        "title": "Email"
    }
};

export const GROUPS = {
    "sandbox": {
        "title": "Sandboxes"
    },
    "safebrowsing": {
        "title": "Safebrowsing"
    },
    "archive": {
        "title": "Archives"
    },
    "reputation": {
        "title": "Reputation & TI"
    },
    "infrastructure": {
        "title": "Infrastructure"
    },
};

const E = ENTITIES;
const G = GROUPS;

export const RESOURCES = {
    "virustotal": {
        "title": "VirusTotal",
        "group": "reputation",
        "description": "Бесплатная служба, осуществляющая анализ подозрительных файлов и ссылок (URL) на предмет выявления вирусов, червей, троянов и всевозможных вредоносных программ.",
        "accepts": ["ipv4", "ipv6", "hash_md5", "hash_sha256", "url", "domain", "ssl_thumbprint" /*?*/],
        "baseUrl": "https://www.virustotal.com",
        "lookups": {
            "ipv4": { "endpoint": "/gui/ip-address/<?>" },
            "ipv6": { "endpoint": "/gui/ip-address/<?>" },
            "hash_md5": { "endpoint": "/gui/file/<?>" },
            "hash_sha256": { "endpoint": "/gui/file/<?>" },
            "domain": { "endpoint": "/gui/domain/<?>" },
            "url": {
                "endpoint": "/gui/url/<?>",
                "preprocess": (str) => { return btoa(str).replace(/=/g, "") }
            }
        },
        "attributes": {
            "authRequired": false,
        }
    },
    "abuseipdb": {
        "title": "AbuseIPDB",
        "group": "reputation",
        "description": "Онлайн-база данных репутации IP-адресов, основанная на сообщениях сообщества.",
        "accepts": ["ipv4", "ipv6", "domain"],
        "baseUrl": "https://www.abuseipdb.com",
        "lookups": {
            "ipv4": { "endpoint": "/check/<?>" },
            "ipv6": { "endpoint": "/check/<?>" },
            "domain": { "endpoint": "/check/<?>" }
        }
    },
    "shodan": {
        "title": "Shodan",
        "group": "infrastructure",
        "description": "Специализированная поисковая система, которая индексирует устройства и сервисы, подключённые к интернету.",
        "accepts": ["ipv4", "ipv6", "domain", "query"],
        "baseUrl": "https://www.shodan.io",
        "lookups": {
            "ipv4": { "endpoint": "/search?query=<?>" },
            "ipv6": { "endpoint": "/search?query=<?>" },
            "domain": { "endpoint": "/search?query=<?>" },
            "query": { "endpoint": "/search?query=<?>" },
        }
    },
    "urlscanio": {
        "title": "urlscan.io",
        "group": "infrastructure",
        "description": "Веб-служба, которая позволяет сканировать и анализировать URL-адреса для определения потенциальных угроз безопасности и рисков.",
        "accepts": ["ipv4", "ipv6", "domain", "url", "hash_sha256", "query"],
        "baseUrl": "https://urlscan.io",
        "lookups": {
            "ipv4": { "endpoint": "/search/#page.ip:<?>" },
            "ipv6": { "endpoint": "/search/#page.ip:<?>" }, //?
            "domain": { "endpoint": "/search/#domain:<?>" },
            "hash_sha256": { "endpoint": "/search/#hash:<?>" },
            "query": { "endpoint": "/search/#<?>" },
        }
    },
    "webarchive": {
        "title": "Wayback Machine",
        "group": "archive",
        "description": "Некоммерческий проект некоммерческой организации Internet Archive, который сохраняет копии веб-страниц, а также другие цифровые материалы.",
        "accepts": ["url"],
        "baseUrl": "https://web.archive.org",
        "lookups": {
            "url": { "endpoint": "/<?>" }
        }
    },
    "ipqualityscore": {
        "title": "IPQualityScore",
        "group": "reputation",
        "description": "Платформа для предотвращения мошенничества и анализа угроз, которая оценивает риски на основе IP-адресов, устройств, поведения и других данных.",
        "accepts": ["ipv4", "ipv6", "url", "phone", "email"], /*ipv6???*/ /*phone,email*/
        "baseUrl": "https://www.ipqualityscore.com"
    },
    "greynoise": {
        "title": "Greynoise",
        "group": "reputation",
        "description": "Платформа кибербезопасности, которая собирает и анализирует данные о сканировании и атаках в интернете.",
        "accepts": ["ipv4", /*???*/],
        "baseUrl": "https://viz.greynoise.io",
        "lookups": {
            "ipv4": { "endpoint": "/ip/<?>" }
        }
    },
    "crtsh": {
        "title": "crt.sh",
        "group": "infrastructure",
        "description": "Веб-инструмент для поиска и анализа SSL/TLS-сертификатов, основанный на логах Certificate Transparency.",
        "accepts": ["domain", "query"],
        "baseUrl": "https://crt.sh",
        "lookups": { 
            "domain": { "endpoint": "/?q=<?>" },
            "query": { "endpoint": "/?q=<?>" }
        }
    },
    "censys": {
        "title": "Censys",
        "group": "infrastructure",
        "description": "Ведущая поисковая система и платформа для анализа безопасности, которая непрерывно сканирует весь интернет для создания карты подключенных устройств, серверов и сервисов.",
        "accepts": ["ipv4", "ipv6", "query"],
        "baseUrl": "https://platform.censys.io",
        "lookups": {
            "ipv4": { "endpoint": "/hosts/<?>" },
            "ipv6": { "endpoint": "/hosts/<?>" } /*????*/
        }
    }
}

export const ENTITY_TO_RESOURCES = (() => {
    let tmp = {};
    for ( let [resource, info] of Object.entries(RESOURCES) ) {
        console.log(resource, info);
        for ( let entity of info.accepts ) {
            console.log(entity);
            if ( !Array.isArray(tmp[entity]) ) {
                tmp[entity] = [resource];
            } else {
                tmp[entity].push(resource);
            }
        }
    }
    return tmp;
})();

console.log(ENTITY_TO_RESOURCES)