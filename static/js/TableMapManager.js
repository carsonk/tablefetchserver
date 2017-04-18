
function TableMapManager(tableMapContainer, apiTablesUrl, apiPartiesUrl, seatUrl, editUrl) {
    this.mapContainer = $(tableMapContainer);

    this.seatUrl = seatUrl;
    this.editUrl = editUrl;
    this.apiTablesUrl = apiTablesUrl;
    this.apiPartiesUrl = apiPartiesUrl;

    this.tableGroup = this.mapContainer.children(".table-group");
    this.tableLabelGroup = this.mapContainer.children(".table-label-group");
    this.svgDragManager = new SvgDragManager(this.mapContainer);

    this.tables = [];
    this.parties = [];

    this.editMode = false;

    this.TEXT_LABEL_CLASS_PREFIX = "table-label-";

    this.initListeners = function() {
        const thisManager = this;

        this.svgDragManager.addMoveCallback(function(evt, newXAttr, newYAttr) {
            const elem = $(evt.target);
            const textElem = $("." + thisManager.TEXT_LABEL_CLASS_PREFIX + elem.data("id"));
            thisManager.placeTextElem(elem, textElem, newXAttr, newYAttr);
        });

        this.svgDragManager.addDetachCallback(function(evt, selectedElem) {
            const updateTable = {
                x_coord: Math.round(selectedElem.attr("x")),
                y_coord: Math.round(selectedElem.attr("y"))
            };
            thisManager.updateTable(selectedElem.data("id"), updateTable);
        });

        $(".new-table-btn").click(() => thisManager.openAddTableForm());
        $(".switch-mode-btn").click(() => thisManager.toggleMode());
        $(".table-save-btn").click(() => thisManager.saveAddTable());
        $(".party-save-btn").click(() => thisManager.saveSeatedTable());

        $(this.tableGroup).on("dblclick", "rect", (e) => thisManager.openSeatTable($(e.target)));

        window.onpopstate = function(e) {
            if(e.state) {
                if (e.state.mode == "edit") {
                    thisManager.enterEditMode();
                } else if (e.state.mode == "seat") {
                    thisManager.enterSeatMode();
                }
            }
        }
    }

    this.toggleMode = function() {
        if(this.editMode)
            this.enterSeatMode(); // Switch to seat mode.
        else
            this.enterEditMode(); // Switch to edit mode.
    }

    this.enterEditMode = function() {
        const switchButton = $(".switch-mode-btn");
        switchButton.text("Seat Mode");
        this.editMode = true;
        this.mapContainer.addClass("edit-map");
        this.svgDragManager.addListener(this.tableGroup, "rect");
        $(".new-table-btn").show();
        window.history.pushState({"mode": "edit"}, "edit", this.editUrl);
    }

    this.enterSeatMode = function() {
        const switchButton = $(".switch-mode-btn");
        switchButton.text("Edit Mode");
        this.editMode = false;
        this.mapContainer.removeClass("edit-map");
        this.svgDragManager.removeListeners(this.tableGroup, "rect");
        $(".new-table-btn").hide();
        window.history.pushState({"mode": "seat"}, "seat", this.seatUrl);
    }

    this.loadAllTables = function() {
        const thisManager = this;

        this.tableGroup.html("");
        this.tableLabelGroup.html("");
        const tableRects = this.tableGroup.children("rect");

        this.getTables(0, function(tables) {
            thisManager.tables = tables;

            tables.forEach(function(table) {
                thisManager.createTableElem(table);
            })
        });
    }

    this.openAddTableForm = function() {
        $('#new-table-modal').modal('show');
    }

    this.saveAddTable = function() {
        const form = $("#new-table-modal form");
        const formDom = form.get(0);
        const thisManager = this;

        if (formDom.reportValidity()) {
            const formData = {
                "name": $("#slug-field").val(),
                "x_coord": 50, "y_coord": 50,
                "width": 75, "height": 75,
                "color": 0xFFFFFF, "num_seats": $("#num-seats-field").val()
            };
            formDom.reset();

            $.post(this.apiTablesUrl, formData, function(data) {
                if (data.hasOwnProperty("id")) {
                    console.log("Success!");
                    console.log(data);
                    thisManager.createTableElem(data);
                } else {
                    console.log("Returned data is invalid...");
                }
            });

            $('#new-table-modal').modal('hide');
        }
    }

    this.openSeatTable = function(tableElem) {
        const thisManager = this;

        this.getTable(tableElem.data("id"), function(table) {
            const modal = $("#new-party-modal");
            const partyList = $("#existing-party-list");
            
            modal.data("table", table.id);
            $("#new-party-table-slug").text(table.name);
            
            partyList.html("");
            thisManager.getParties(function(parties) {
                $("<option />", { "value": 0 }).text("------------").appendTo(partyList);

                thisManager.parties = parties;

                parties.forEach(function(party) {
                    const partyElem = $("<option />", { "value": party.id });
                    const name = (party.name) ? 
                        party.name 
                        : "UNNAMED PARTY - Arrived " + party.time_arrived;
                    partyElem.text(name);
                    partyList.append(partyElem);
                });

                modal.modal('show');
            });
        });
    }

    this.saveSeatedTable = function() {
        const modal = $("#new-party-modal");
        const partyList = $("#existing-party-list");
        const tableId = modal.data("table");
        const thisManager = this;

        const seatUpdate = function(partyId) {
            thisManager.updateTable(partyId, { "current_party": partyId }, function() {
                // Close the modal.
                thisManager.loadAllTables();
                modal.modal("hide");
            });
        };

        const existingPartyVal = parseInt(partyList.val());
        if(existingPartyVal > 0) {
            // Existing party.
            seatUpdate(existingPartyVal);
        } else {
            // New party.
            // TODO: Do validation of these fields.
            const party = {
                "table": tableId,
                "name": $("#name-field").val(),
                "size": $("#size-field").val()
            };

            this.createParty(party, function(newParty) {
                seatUpdate(newParty.id);
            }, function() {
                // TODO: Update with error.
            });
        }
    }

    this.getTables = function(mapId, callback) {
        $.get(this.apiTablesUrl, {}, function(data) {
            callback(data.results);
        }, "json");
    }

    this.getTable = function(tableId, callback, failCallback) {
        var getCall = $.get(this.apiTablesUrl + tableId, {}, function(data) {
            callback(data);
        }, "json");

        if (failCallback) {
            getCall.fail(failCallback);
        }
    }

    this.updateTable = function(tableId, updateData, callback, failCallback) {
        const url = this.apiTablesUrl + tableId + "/";

        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            type: "PATCH",
            url: url,
            data: JSON.stringify(updateData)
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

    this.getParties = function(callback) {
        $.get(this.apiPartiesUrl, {}, function(data) {
            callback(data.results);
        }, "json");
    }

    this.createParty = function(party, callback, failCallback) {
        $.post(this.apiPartiesUrl, JSON.stringify(party), function(party) {
            console.log("Created party.");
            callback(party);
        }, "json").fail(function(jqXHR, textStatus) {
            console.log("Connection failed: " + textStatus);
            failCallback();
        });
    }

    this.createTableElem = function(table) {
        let newTableElem = $(makeSVG("rect", this.getTableElemAttributes(table)));
        newTableElem = newTableElem.appendTo(this.tableGroup);
        const newTextElem = this.createLabelElem(table.id, table.name);
        this.placeTextElem(newTableElem, newTextElem, table.x_coord, table.y_coord);
    }

    this.createLabelElem = function(tableId, labelText) {
        const newTextElem = $(makeSVG("text", {
            "x": 0, "y": 0, "data-id": tableId,
            "class": this.TEXT_LABEL_CLASS_PREFIX + tableId.toString()
        }));
        newTextElem.text(labelText);
        return newTextElem.appendTo(this.tableLabelGroup);
    }

    this.getTableElemAttributes = function(table) {
        const elemClass = (table.current_party == null) ? null : "seated";

        return {
            "x": table.x_coord, "y": table.y_coord, "data-id": table.id,
            "width": table.width, "height": table.height,
            "id": "table-" + table.id,
            "class": elemClass
        };
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
