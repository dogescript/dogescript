function getXHR() {
    if (XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    try  {
        return new ActiveXObject('Msxml2.XMLHTTP.6.0');
    } catch (e) {
    }
    try  {
        return new ActiveXObject('Msxml2.XMLHTTP.3.0');
    } catch (e) {
    }
    try  {
        return new ActiveXObject('Microsoft.XMLHTTP');
    } catch (e) {
    }
    throw new Error('This browser does not support XMLHttpRequest.');
}

function loadText(url, callback) {
    try  {
        var xhr = getXHR();
    } catch (e) {
        callback(e, null);
        return;
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            callback(null, xhr.responseText);
        }
    };

    xhr.open('GET', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send(null);
}

module.exports = loadText;
