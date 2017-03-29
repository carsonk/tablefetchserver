
function getCsrfToken() {
    return Cookies.get('csrftoken');
}

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function jqueryAjaxSetup() {
    var csrfToken = getCsrfToken();

    console.log("CSRF token set to " + csrfToken);

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (csrfSafeMethod(settings.type) && !this.crossDomain) {
                console.log("Setting csrf token to " + csrfToken);
                xhr.setRequestHeader("X-CSRFToken", csrfToken);
            } else {
                console.log("Not setting csrf token, because not safe method: " + settings.type);
            }
        }
    });
}

