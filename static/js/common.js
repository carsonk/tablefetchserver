
function jqueryAjaxSetup() {
    $.ajaxSetup({
        headers: { "X-CSRFToken": Cookies.get('csrftoken') }
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
