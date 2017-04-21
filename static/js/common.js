
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

function makeSVG(tag, attrs) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}

function ajaxPatch(url, dataObj, callback, failCallback) {
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "PATCH",
        url: url,
        data: JSON.stringify(dataObj)
    }).done(function(data) {
        console.log("Success!");

        if (callback)
            callback(data);
    }).fail(function(jqXHR, textStatus) {
        console.log("Connection failed: " + textStatus);

        if (failCallback)
            failCallback();
    });
}

function SvgDragManager(jqContainer) {
    /* TODO: Consider using DOM elements instead of jQuery, since there are some parts of
     * jQuery that aren't guaranteed to work with SVG. */

    this.jqContainer = $(jqContainer);
    this.containerDom = this.jqContainer.get(0);
    this.svgPt = this.containerDom.createSVGPoint();

    this.cursOffsetX = 0;
    this.cursOffsetY = 0;

    this.selectedElement = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.currentMatrix = 0;
    this.moveCallback = 0;
    this.detachCallback = 0;

    this.translateDimensions = function(x, y, callback) {
        this.svgPt.x = x;
        this.svgPt.y = y;

        const adjustedPt = this.svgPt.matrixTransform(this.containerDom.getScreenCTM().inverse());

        callback(adjustedPt.x, adjustedPt.y);
    };

    this.addListener = function(jqContainer, jqElem) {
        const thisManager = this;

        $(jqContainer).on("mousedown.svgDragDown", jqElem, function(e) {
            thisManager.selectElement(e);
        });
    }

    this.removeListeners = function(jqContainer, jqElem) {
        $(jqContainer).off("mousedown.svgDragDown");
    }

    this.addMoveCallback = function(handler) {
        this.moveCallback = handler;
    }

    this.addDetachCallback = function(handler) {
        this.detachCallback = handler;
    }

    this.selectElement = function(evt) {
        evt.preventDefault();
        const thisManager = this;

        if (this.selectedElement == 0) {
            console.log("Selecting element...");

            this.selectedElement = $(evt.target);
            this.translateDimensions(evt.clientX, evt.clientY, function(x, y) {
                thisManager.currentX = x;
                thisManager.currentY = y;
            });

            const xAttr = this.selectedElement.attr("x");
            const yAttr = this.selectedElement.attr("y");
            this.cursOffsetX = thisManager.currentX - xAttr;
            this.cursOffsetY = thisManager.currentY - yAttr;

            this.jqContainer.on("mousemove.svgDragMove", this.selectedElement, function(e) {
                thisManager.moveElement(e);
            });
            this.jqContainer.on("mouseup.svgDragUp", this.selectedElement, function(e) {
                thisManager.deselectElement(e);
            });
        } else {
            console.log("Element double selected...");
        }
    }

    this.moveElement = function(evt) {
        evt.preventDefault();

        if (this.selectedElement != 0) {
            let newX = 0, newY = 0;

            this.translateDimensions(evt.clientX, evt.clientY, function(x, y) {
                newX = x;
                newY = y;
            });

            const newXAttr = newX - this.cursOffsetX;
            const newYAttr = newY - this.cursOffsetY;

            this.selectedElement.attr("x", newXAttr);
            this.selectedElement.attr("y", newYAttr);

            this.currentX = newX;
            this.currentY = newY;

            if (this.moveCallback != 0) {
                this.moveCallback(evt, newXAttr, newYAttr);
            }
        } else {
            console.log("Dodged unattached move...");
        }
    }

    this.deselectElement = function(evt) {
        evt.preventDefault();

        if(this.selectedElement != 0){
            console.log("Detaching " + this.selectedElement.data("id"))

            this.jqContainer.off("mousemove.svgDragMove");
            this.jqContainer.off("mouseup.svgDragUp");

            if (this.detachCallback != 0) {
                this.detachCallback(evt, this.selectedElement);
            }

            this.selectedElement = 0;
        } else {
            console.log("failed to detach")
        }
    }
}
