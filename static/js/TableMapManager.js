
function TableMapManager(tableMapContainer, apiTablesUrl) {
    this.apiTablesUrl = apiTablesUrl;
    this.mapContainer = $(tableMapContainer);
    this.tableGroup = this.mapContainer.children(".table-group");
    this.tableLabelGroup = this.mapContainer.children(".table-label-group");
    this.svgDragManager = new SvgDragManager(this.mapContainer);

    this.tables = [];

    this.TEXT_LABEL_PREFIX = "table-label-";

    this.changesMade = false;

    this.initListeners = function() {
        const thisManager = this;

        this.svgDragManager.addListener(this.tableGroup, "rect");

        this.svgDragManager.addMoveCallback(function(evt, newXAttr, newYAttr) {
            const elem = $(evt.target);
            const textElem = $("." + thisManager.TEXT_LABEL_PREFIX + elem.data("id"));
            thisManager.placeTextElem(elem, textElem, newXAttr, newYAttr);
        });

        $(".new-table-btn").click(function() {
            thisManager.openAddTableForm();
        });

        $(".table-save-btn").click(function() {
            thisManager.saveAddTable();
        });

        $("#new-table-modal").on('hidden.bs.modal', function(e) {

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

    this.openAddTableForm = function() {
        $('#new-table-modal').modal('show');
    }

    this.saveAddTable = function() {
        const form = $("#new-table-modal form");
        const formDom = form.get(0);

        if (formDom.reportValidity()) {
            const formData = {
                "x_coord": 50,
                "y_coord": 50,
                "width": 100,
                "height": 100,
                "color": 0xFFFFFF,
                "name": $("#slug-field").val(),
                "num_seats": $("#num-seats-field").val()
            };

            $.post(this.apiTablesUrl, formData, function(data) {
                console.log("Success!");
                console.log(data);
            });
        }
    }

    this.placeTextElem = function(tableElem, textElem, tableX, tableY) {
        tableX = tableX || tableElem.attr("x");
        tableY = tableY || tableElem.attr("y");
        tableX = parseInt(tableX);
        tableY = parseInt(tableY);

        if (typeof textElem == "undefined")
            return;

        const textElemDom = textElem.get(0);

        if (typeof textElemDom == "undefined")
            return;

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
