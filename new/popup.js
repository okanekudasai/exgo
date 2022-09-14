const go = document.getElementById("go");
var p;
(async function initPopupWindow() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log(tab.url)
    if (tab.url) {
        try {
            p = new URL(tab.url);
        } catch {}
    }
})();

go.addEventListener("click", setting);

async function setting(event) {
    event.preventDefault();
    let cookies = await gettingCookies(p.hostname);
    for (const i of cookies) {
        console.log(i.name);
    }
    let pending = cookies.map(fianlSettingCookie);
    await Promise.all(pending);
    console.log("끝");
}

async function gettingCookies(domain) {
    try {
        const cookies = await chrome.cookies.getAll({ domain });
        return cookies;
    } catch { }
}

function fianlSettingCookie(cookie) {
    console.log(cookie);
    const protocol = cookie.secure ? "https:" : "http:";
    const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;
    return /*chrome.cookies.remove({
        url: cookieUrl,
        name: cookie.name,
        storeId: cookie.storeId,
    })*/;
}

/*
function logStores(cookieStores) {
  for (const store of cookieStores) {
    console.log(`Cookie store: ${store.id}\n Tab IDs: ${store.tabIds}`);
  }
}

browser.cookies.getAllCookieStores().then(logStores);
*/
/*
function buildUrl(domain, path, searchUrl) {
    // Keep same protocol as searchUrl
    // This fixes a bug when we want to unset 'secure' property in an https domain
    var secure = searchUrl.indexOf("https://") === 0;

    if (domain.substr(0, 1) === '.')
        domain = domain.substring(1);

    return "http" + ((secure) ? "s" : "") + "://" + domain + path;
}

function deleteAll(cookieList, searchUrl) {
    for (var i = 0; i < cookieList.length; i++) {
        var curr = cookieList[i];
        var url = buildUrl(curr.domain, curr.path, searchUrl);
        deleteCookie(url, curr.name, curr.storeId);
    }
}

function deleteCookie(url, name, store, callback) {
    chrome.cookies.remove({
        'url': url,
        'name': name,
        'storeId': store
    }, function (details) {
        if (typeof callback === "undefined")
            return;
        if (details === "null" || details === undefined || details === "undefined") {
            callback(false);
        } else {
            callback(true);
        }
    })
}
*/
