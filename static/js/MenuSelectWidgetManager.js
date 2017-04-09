
function MenuSelectWidgetManager(categoriesUrl, itemsUrl) {
    this.apiItemsUrl = itemsUrl;
    this.apiCategoriesUrl = categoriesUrl;

    this.categories = [];
    this.items = [];

    this.selectedItems = [];

    // Allows us to assign unique number to each selected item.
    this.currentSelectedIndex = 0;

    this.initListeners = function() {
        var thisWidget = this;

        // Listen for clicks when categories are selected.
        $(".menu-select-list").on('click', '.menu-select-category', function(e) {
            var elem = $(this);
            var categoryId = elem.data("category");
            var selectList = elem.parent(".menu-select-list");
            var breadcrumbs = selectList.parent(".order-select-items")
                .children(".order-select-breadcrumbs");
            var categoryName = elem.text();

            thisWidget.pushCategoryBreadcrumb(breadcrumbs, categoryId, categoryName);
            thisWidget.getCategoryList(categoryId, selectList, thisWidget.loadMenu);
        });

        // Load menu with categories.
        $(".order-select-breadcrumbs").on('click', 'li', function(e) {
            var elem = $(this);
            var breadcrumbs = elem.parent(".order-select-breadcrumbs");
            var selectList = breadcrumbs.parent().children(".menu-select-list");
            var categoryId = elem.data("category");

            thisWidget.getCategoryList(categoryId, selectList, thisWidget.loadMenu);
            thisWidget.gotoCategoryBreadcrumb(breadcrumbs, categoryId);
        });

        // Click selected item button.
        $(".menu-select-list").on("click", ".menu-select-item", function(e) {
            var elem = $(this);
            var itemId = elem.data("item");
            var selectWidget = elem.parent(".menu-select-list")
                .parent(".order-select-items");

            var item = findModelById(thisWidget.items, itemId);

            if (typeof item === "undefined")
                return;

            var container = selectWidget.children(".order-selected-items").first();

            thisWidget.addSelectedItem(container, item);
        });

        // Click quantity controls on selected ingredient.
        $(".order-selected-items").on("click", ".selected-tools button", function(e) {
            e.preventDefault();

            var elem = $(this);
            var selectedTools = elem.parent(".selected-tools");
            var quantityButton = selectedTools.children(".selected-quantity");
            var quantityField = selectedTools.children("input[name='quantity']");
            var increment = elem.hasClass("select-quantity-inc");

            var value = parseInt(quantityField.val());

            if (increment)
                value++;
            else
                value--;

            if (value > 0) {
                quantityButton.text(value);
                quantityField.val(value);
            }
        });

        // Click ingredients button on selected item.
        $(".order-selected-items").on("click", ".ingredients-btn", function(e) {
            e.preventDefault();

            var selectedItem = $(this).closest(".order-selected-item");
            var selectedIndex = selectedItem.data("selectedIndex");
            var container = selectedItem.parent(".order-selected-items");

            thisWidget.openIngredientSelector(container, selectedIndex);
        });

        $('#ingredients-selector-modal').on('hidden.bs.modal', function (e) {
            console.log("Collecting ingredients...");
            thisWidget.collectSelectedIngredients();
        });
    }

    this.getCategoryList = function(categoryId, container, callback) {
        var data = (categoryId > 0) ? {"category": categoryId} : {};
        var itemsUrl = this.apiItemsUrl;
        var catUrl = this.apiCategoriesUrl;
        var thisWidget = this;

        $.get(itemsUrl, data, function(data) {
            var menuItems = data.results;
            data = (categoryId > 0) ? {"parent": categoryId} : {};
            thisWidget.items = menuItems;

            $.get(catUrl, data, function(data) {
                var menuCategories = data.results;
                thisWidget.categories = menuCategories;

                callback(container, menuItems, menuCategories);
            });
        }, "json");
    }

    this.loadMenu = function(container, menuItems, menuCategories) {
        var catTpl = $(".tpl-menu-select-category li").first().clone();
        var itemTpl = $(".tpl-menu-select-item li").first().clone();

        container.html("");

        menuCategories.forEach(function(category) {
            var currentTpl = catTpl.clone();

            currentTpl.data("category", category.id);
            currentTpl.text(category.name);
            container.append(currentTpl);
        });

        menuItems.forEach(function(item) {
            var currentTpl = itemTpl.clone();

            currentTpl.data("item", item.id);
            currentTpl.text(item.name);
            container.append(currentTpl);
        });
    }

    this.pushCategoryBreadcrumb = function(container, categoryId, categoryName) {
        var template = $(".tpl-order-select-breadcrumb")
            .children("li").clone();
        template.data("category", categoryId);
        template.children("a").text(categoryName);
        container.append(template);
    }

    this.popCategoryBreadcrumb = function(container) {
        container.children().last().remove();
    }

    this.gotoCategoryBreadcrumb = function(container, categoryId) {
        var found = false;

        while(!found) {
            var elem = container.children().last();

            if (!elem)
                break;

            if (elem.data("category") == categoryId) {
                found = true;
            } else {
                elem.remove();
            }
        }
    }

    this.addSelectedItem = function(container, item) {
        var tpl = $(".tpl-order-selected-item").children("li").first().clone();

        tpl.find(".selected-title").text(item.name);
        tpl.data("item", item.id);
        tpl.data("selectedIndex", this.currentSelectedIndex);

        var clonedItem = $.extend({}, item);
        clonedItem.selectedIndex = this.currentSelectedIndex;
        clonedItem.selectedIngredients = clonedItem.default_ingredients.slice();
        this.selectedItems.push(clonedItem);

        this.currentSelectedIndex++;
        container.append(tpl);
    }

    this.openIngredientSelector = function(container, selectedIndex) {
        var selectorModal = $("#ingredients-selector-modal");
        var selectedItem = this.getSelectedItem(selectedIndex);

        selectorModal.data("item", selectedItem.id);
        selectorModal.data("selectedIndex", selectedIndex)
        this.fillIngredientsSelector(selectedItem);
        selectorModal.modal('show');
    }

    this.fillIngredientsSelector = function(item) {
        var selectorModalBody = $("#ingredients-selector-modal .modal-body");
        var tpl = $(".tpl-modal-ingredient").children("label");
        var selectedIdArr = getIdsFromModels(item.selectedIngredients);

        selectorModalBody.html("");

        item.possible_ingredients.forEach(function(ingredient) {
            var newIngredientElem = tpl.clone();
            var checkbox = newIngredientElem.children("input");

            checkbox.val(ingredient.id);

            if ($.inArray(ingredient.id, selectedIdArr) > -1) {
                checkbox.prop("checked", true);
            }

            newIngredientElem.children(".modal-ingredient-title")
                .text(ingredient.name);

            selectorModalBody.append(newIngredientElem);
        })
    }

    this.collectSelectedIngredients = function() {
        var selectorModal = $("#ingredients-selector-modal");
        var selectedIndex = selectorModal.data("selectedIndex");
        var selectedItem = this.getSelectedItem(selectedIndex);
        var thisWidget = this;
        var selectedIngredientIds = [];
        var selectedItemElem = this.getSelectedItemElem(selectedIndex);

        selectedItem.selectedIngredients = [];

        selectorModal.find(".modal-body label input").each(function(index) {
            var elem = $(this);
            var itemId = parseInt(elem.val());
            var ingredient = findModelById(selectedItem.possible_ingredients, itemId);

            if (elem.prop("checked")) {
                selectedIngredientIds.push(parseInt(itemId));
                selectedItem.selectedIngredients.push(ingredient);
            }
        });

        var selectedIngredientsElem = selectedItemElem.children(".order-selected-ingredients");
        var addedTpl = $(".tpl-order-selected-ingredient .order-selected-add");
        var totalChanges = 0;

        var usedDefaults = [];

        selectedIngredientsElem.html("");

        var unusedDefaults = getIdsFromModels(selectedItem.default_ingredients);

        // Pick up the added ingredients and note used defaults.
        selectedIngredientIds.forEach(function(selectedId) {
            var ingredient = findModelById(selectedItem.default_ingredients, selectedId);
            var defaultIngredient = true;

            if (ingredient == null) {
                ingredient = findModelById(selectedItem.possible_ingredients, selectedId);
                // TODO: Implement error check here.
                defaultIngredient = false;
            }

            if (defaultIngredient) {
                unusedDefaults.splice(unusedDefaults.indexOf(selectedId), 1);
            } else {
                var tpl = addedTpl.clone();
                tpl.append(ingredient.name);
                selectedIngredientsElem.append(tpl);
                totalChanges++;
            }
        });

        var removedTpl = $(".tpl-order-selected-ingredient .order-selected-remove");

        // Create list of removed ingredients.
        unusedDefaults.forEach(function(selectedId) {
            var ingredient = findModelById(selectedItem.default_ingredients, selectedId);
            var tpl = removedTpl.clone();
            tpl.append(ingredient.name);
            selectedIngredientsElem.append(tpl);
            totalChanges++;
        });

        if (totalChanges > 0)
            selectedIngredientsElem.show();
        else
            selectedIngredientsElem.hide();
    }

    this.getItem = function(itemId, callback) {
        var item = findModelById(this.items, itemId);

        if (item != null) {
            callback(item);
        } else {
            this.getItemAjax(itemId, callback);
        }
    }

    this.getItemAjax = function(itemId, callback) {
        var url = this.apiItemsUrl + itemId;

        $.get(url, {}, function(data) {
            if (typeof data.id != "undefined") {
                callback(data);
            } else {
                console.log("Failed to retrieve item...");
                console.log(data);
            }
        });
    }

    this.getSelectedItemElem = function(selectedIndex) {
        var foundElem = null;

        $(".order-selected-items li").each(function(index, element) {
            if ($(element).data("selectedIndex") == selectedIndex) {
                foundElem = $(element);
                return false;
            }
        });

        return foundElem;
    }

    // Get the number of times an item has been selected.
    this.countSelectedItem = function(itemId) {
        var count = 0;

        for (var item of this.selectedItems) {
            if (item.id == itemId)
                count++;
        }

        return count;
    }

    this.getSelectedItem = function(selectedIndex) {
        for (var item of this.selectedItems) {
            if (item.selectedIndex == selectedIndex)
                return item;
        }

        return null;
    }
}
