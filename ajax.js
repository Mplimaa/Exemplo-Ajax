var req = null;
var READY_STATE_COMPLETE = 4;

function timedNews(data) {
    sendRequest(data);
    var t = setTimeout("timedNews('" + data + "')", 30000);
}

function sendRequest(url, params, HttpMethod) {
    if (!HttpMethod) {
        HttpMethod = "GET";
    }
    req = initXMLHttpRequest();
    if (req) {
        req.onreadystatechange = onReadyState;
        req.open(HttpMethod, url, true);
        req.setRequestHeader("Content-Type", "text/xml");
        req.send(params);
    }
}

function initXMLHttpRequest() {
    var xRequest = null;
    if (window.XMLHttpRequest) {
        xRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xRequest;
}

function onReadyState() {
    var ready = req.readyState;
    if (ready == READY_STATE_COMPLETE) {
        loadingMsg(0);
        parseNews();
    } else {
        loadingMsg(1);
    }
}

function newDetect(titulo) {
    var sitenews = document.getElementById('news');
    var oldnew = sitenews.firstChild;
    if (oldnew == null) {
        return false;
    } else {
        while (oldnew != null) {
            var tit = oldnew.getElementsByTagName('h3');
            tit = tit[0].innerHTML;
            if (tit == titulo) {
                return true;
            }
            oldnew = oldnew.nextSibling;
        }
        return false;
    }
}

function parseNews() {
    var news = req.responseXML.getElementsByTagName('new');
    for (var i = 0; i < news.length; i++) {
        var date = getNodeValue(news[i], 'date');
        var title = getNodeValue(news[i], 'title');
        var titcont = date + " - " + title;
        if (newDetect(titcont) == false) {
            var divnew = document.createElement('div');
            divnew.setAttribute('id', 'new' + i);
            var titulo = document.createElement('h3');
            titulo.appendChild(document.createTextNode(titcont));
            var corpo = document.createElement('p');
            corpo.setAttribute('class', 'corpo');
            var txt = document.createTextNode(getNodeValue(news[i], 'content'));
            corpo.appendChild(txt);
            divnew.appendChild(titulo);
            divnew.appendChild(corpo);
            var base = document.getElementById('news');
            base.insertBefore(divnew, base.firstChild);
        }
    }
}

function getNodeValue(obj, tag) {
    return obj.getElementsByTagName(tag)[0].firstChild.nodeValue;
}

function loadingMsg(set) {
    if (set == 1) {
        var msg_div = document.getElementById('loadDiv');
        if (msg_div == null) {
            msg_div = document.createElement('div');
            msg_div.setAttribute('id', 'loadDiv');
            var txt = document.createTextNode('Loading...');
            msg_div.appendChild(txt);
            var corpo = document.getElementsByTagName('body');
            corpo[0].appendChild(msg_div);
        } else {
            msg_div.innerHTML = "Loading...";
        }
    } else {
        var msg_div = document.getElementById('loadDiv');
        if (msg_div != null) {
            var pai = msg_div.parentNode;
            pai.removeChild(msg_div);
        }
    }
}
