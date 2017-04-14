
function TableMapManager(tableMapContainer) {
    this.mapContainer = $(tableMapContainer);
    this.tableGroup = this.mapContainer.children(".table-group");
    this.tableLabelGroup = this.mapContainer.children(".table-label-group");
    this.svgDragManager = new SvgDragManager(this.mapContainer);

    this.tables = [];

    this.TEXT_LABEL_PREFIX = "table-label-";

    this.initListeners = function() {
        const thisManager = this;

        this.svgDragManager.addListener(this.tableGroup, "rect");

        this.svgDragManager.addMoveCallback(function(evt, newXAttr, newYAttr) {
            const elem = $(evt.target);
            const textElem = $("." + thisManager.TEXT_LABEL_PREFIX + elem.data("id"));
            thisManager.placeTextElem(elem, textElem, newXAttr, newYAttr);
        });
    }

    this.collectInitialTables = function() {
        const thisManager = this;

        this.tableLabelGroup.html("");
        const tableRects = this.tableGroup.children("rect");

        tableRects.each(function(index) {
            const elem = $(this);
            const tableId = parseInt(elem.data("id"));
            const tableCoord = { x: elem.attr("x"), y: elem.attr("y") };
            const tableDimen = { width: elem.attr("width"), height: elem.attr("height") };

            let newTextElem = makeSVG("text", {
                "x": 0, "y": 0, "data-id": tableId,
                "class": thisManager.TEXT_LABEL_PREFIX + tableId.toString()
            });
            newTextElem = $(newTextElem);
            newTextElem.text(tableId);
            newTextElem = newTextElem.appendTo(thisManager.tableLabelGroup);

            thisManager.placeTextElem(elem, newTextElem, tableCoord.x, tableCoord.y);
        });
    }

    this.addTable = function() {

    }

    this.saveChanges = function() {

    }

    this.placeTextElem = function(tableElem, textElem, tableX, tableY) {
        tableX = tableX || tableElem.attr("x");
        tableY = tableY || tableElem.attr("y");
        tableX = parseInt(tableX);
        tableY = parseInt(tableY);

        const textBBox = textElem.get(0).getBBox();
        
        // TODO: Possible optimization might be to use BBox values instead.
        const tableWidth = parseInt(tableElem.attr("width"));
        const tableHeight = parseInt(tableElem.attr("height"));

        const textWidth = textBBox.width;
        const textHeight = textBBox.height;

        const tableMidX = tableWidth / 2;
        const tableMidY = tableHeight / 2;
        const textMidX = textWidth / 2;
        const textMidY = textHeight / 2;

        const newX = tableX + tableMidX - textMidX;
        const newY = tableY + tableMidY + (textMidY / 2);

        $(textElem).attr("x", newX);
        $(textElem).attr("y", newY);
    }
}
