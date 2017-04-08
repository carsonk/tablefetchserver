
function getCsrfToken() {
    return Cookies.get('csrftoken');
}

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function jqueryAjaxSetup() {
    var csrfToken = getCsrfToken();

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrfToken);
            } else {
                console.log("Not setting csrf token, because not safe method: " + settings.type);
            }
        }
    });
}

// Find model in array of models by id.
function findModelById(arr, id) {
    var foundItem = null;

    if (id <= 0 || typeof id === "undefined")
        return null;

    arr.some(function(elem) {
        if (elem.id == id) {
            foundItem = elem;
            return true;
        }

        return false;
    });

    return foundItem;
}

function getIdsFromModels(modelArr) {
    var idArr = [];

    modelArr.forEach(function(instance) {
        idArr.push(parseInt(instance.id));
    });

    return idArr;
}
