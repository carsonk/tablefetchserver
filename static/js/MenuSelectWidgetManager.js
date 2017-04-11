
function MenuSelectWidgetManager(categoriesUrl, itemsUrl) {
    this.apiItemsUrl = itemsUrl;
    this.apiCategoriesUrl = categoriesUrl;

    this.categories = [];
    this.items = [];

    this.selectedItems = [];

    // Allows us to assign unique number to each selected item.
    this.currentSelectedIndex = 0;

    this.initListeners = function() {
        const thisWidget = this;

        // Listen for clicks when categories are selected.
        $(".menu-select-list").on('click', '.menu-select-category', function(e) {
            const elem = $(this);
            const categoryId = elem.data("category");
            const selectList = elem.parent(".menu-select-list");
            const breadcrumbs = selectList.parent(".order-select-items")
                .children(".order-select-breadcrumbs");
            const categoryName = elem.text();

            thisWidget.pushCategoryBreadcrumb(breadcrumbs, categoryId, categoryName);
            thisWidget.getCategoryList(categoryId, selectList, thisWidget.loadMenu);
        });

        // Load menu with categories.
        $(".order-select-breadcrumbs").on('click', 'li', function(e) {
            const elem = $(this);
            const breadcrumbs = elem.parent(".order-select-breadcrumbs");
            const selectList = breadcrumbs.parent().children(".menu-select-list");
            const categoryId = elem.data("category");

            thisWidget.getCategoryList(categoryId, selectList, thisWidget.loadMenu);
            thisWidget.gotoCategoryBreadcrumb(breadcrumbs, categoryId);
        });

        // Click selected item button.
        $(".menu-select-list").on("click", ".menu-select-item", function(e) {
            const elem = $(this);
            const itemId = elem.data("item");
            const selectWidget = elem.parent(".menu-select-list")
                .parent(".order-select-items");

            const item = findModelById(thisWidget.items, itemId);

            if (typeof item === "undefined")
                return;

            const container = selectWidget.children(".order-selected-items").first();

            thisWidget.addSelectedItem(container, item);
        });

        // Click quantity controls on selected ingredient.
        $(".order-selected-items").on("click", ".selected-tools button", function(e) {
            e.preventDefault();

            const elem = $(this);
            const increment = elem.hasClass("select-quantity-inc");
            const selectedItemElem = elem.closest(".order-selected-item");
            const selectedIndex = selectedItemElem.data("selectedIndex");

            let valueChange = increment ? 1 : -1;
            thisWidget.incrementSelectedQuantity(selectedIndex, valueChange);
        });

        // Click ingredients button on selected item.
        $(".order-selected-items").on("click", ".ingredients-btn", function(e) {
            e.preventDefault();

            const selectedItem = $(this).closest(".order-selected-item");
            const selectedIndex = selectedItem.data("selectedIndex");
            const container = selectedItem.parent(".order-selected-items");

            thisWidget.openIngredientSelector(container, selectedIndex);
        });

        $('#ingredients-selector-modal').on('hidden.bs.modal', function (e) {
            console.log("Collecting ingredients...");
            thisWidget.collectSelectedIngredients();
        });
    }

    this.getCategoryList = function(categoryId, container, callback) {
        let data = (categoryId > 0) ? {"category": categoryId} : {};
        const itemsUrl = this.apiItemsUrl;
        const catUrl = this.apiCategoriesUrl;
        const thisWidget = this;

        $.get(itemsUrl, data, function(data) {
            const menuItems = data.results;
            data = (categoryId > 0) ? {"parent": categoryId} : {};
            thisWidget.items = menuItems;

            $.get(catUrl, data, function(data) {
                const menuCategories = data.results;
                thisWidget.categories = menuCategories;

                callback(container, menuItems, menuCategories);
            });
        }, "json");
    }

    this.loadMenu = function(container, menuItems, menuCategories) {
        const catTpl = $(".tpl-menu-select-category li").first().clone();
        const itemTpl = $(".tpl-menu-select-item li").first().clone();

        container.html("");

        menuCategories.forEach(function(category) {
            const currentTpl = catTpl.clone();

            currentTpl.data("category", category.id);
            currentTpl.text(category.name);
            container.append(currentTpl);
        });

        menuItems.forEach(function(item) {
            const currentTpl = itemTpl.clone();

            currentTpl.data("item", item.id);
            currentTpl.text(item.name);
            container.append(currentTpl);
        });
    }

    this.pushCategoryBreadcrumb = function(container, categoryId, categoryName) {
        const template = $(".tpl-order-select-breadcrumb")
            .children("li").clone();
        template.data("category", categoryId);
        template.children("a").text(categoryName);
        container.append(template);
    }

    this.popCategoryBreadcrumb = function(container) {
        container.children().last().remove();
    }

    this.gotoCategoryBreadcrumb = function(container, categoryId) {
        let found = false;

        while(!found) {
            const elem = container.children().last();

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
        const tpl = $(".tpl-order-selected-item").children("li").first().clone();

        tpl.find(".selected-title").text(item.name);
        tpl.data("item", item.id);
        tpl.data("selectedIndex", this.currentSelectedIndex);

        // Set hidden input field telling server how to parse data.
        const itemIdSelectIndexInputPair = this.currentSelectedIndex + "-" + item.id;
        tpl.find(".hidden-item-id-index").val(itemIdSelectIndexInputPair);

        // Clone item, add properties for selected items, and add to
        const clonedItem = $.extend({}, item);
        clonedItem.selectedIndex = this.currentSelectedIndex;
        clonedItem.selectedIngredients = clonedItem.default_ingredients.slice();
        clonedItem.quantity = 1;
        this.selectedItems.push(clonedItem);

        this.currentSelectedIndex++;
        container.append(tpl);
    }

    this.openIngredientSelector = function(container, selectedIndex) {
        const selectorModal = $("#ingredients-selector-modal");
        const selectedItem = this.getSelectedItem(selectedIndex);

        selectorModal.data("item", selectedItem.id);
        selectorModal.data("selectedIndex", selectedIndex)
        this.fillIngredientsSelector(selectedItem);
        selectorModal.modal('show');
    }

    this.fillIngredientsSelector = function(item) {
        const selectorModalBody = $("#ingredients-selector-modal .modal-body");
        const tpl = $(".tpl-modal-ingredient").children("label");
        const selectedIdArr = getIdsFromModels(item.selectedIngredients);

        selectorModalBody.html("");

        item.possible_ingredients.forEach(function(ingredient) {
            const newIngredientElem = tpl.clone();
            const checkbox = newIngredientElem.children("input");

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
        const selectorModal = $("#ingredients-selector-modal");
        const selectedIndex = selectorModal.data("selectedIndex");
        const selectedItem = this.getSelectedItem(selectedIndex);
        const selectedIngredientIds = [];
        const selectedItemElem = this.getSelectedItemElem(selectedIndex);

        selectedItem.selectedIngredients = [];

        selectorModal.find(".modal-body label input").each(function(index) {
            const elem = $(this);
            const itemId = parseInt(elem.val());
            const ingredient = findModelById(selectedItem.possible_ingredients, itemId);

            if (elem.prop("checked")) {
                selectedIngredientIds.push(parseInt(itemId));
                selectedItem.selectedIngredients.push(ingredient);
            }
        });

        const selectedIngredientsElem = selectedItemElem.children(".order-selected-ingredients");
        const addedTpl = $(".tpl-order-selected-ingredient .order-selected-add");
        let totalChanges = 0;

        const usedDefaults = [];

        selectedIngredientsElem.html("");

        const unusedDefaults = getIdsFromModels(selectedItem.default_ingredients);

        // Pick up the added ingredients and note used defaults.
        for (selectedId of selectedIngredientIds) {
            let ingredient = findModelById(selectedItem.default_ingredients, selectedId);
            let defaultIngredient = true;

            if (ingredient == null) {
                ingredient = findModelById(selectedItem.possible_ingredients, selectedId);
                // TODO: Implement error check here.
                defaultIngredient = false;
            }

            if (defaultIngredient) {
                unusedDefaults.splice(unusedDefaults.indexOf(selectedId), 1);
            } else {
                const tpl = addedTpl.clone();
                tpl.append(ingredient.name);
                selectedIngredientsElem.append(tpl);
                totalChanges++;
            }
        }

        const removedTpl = $(".tpl-order-selected-ingredient .order-selected-remove");

        // Create list of removed ingredients.
        for (selectedId of unusedDefaults) {
            const ingredient = findModelById(selectedItem.default_ingredients, selectedId);
            const tpl = removedTpl.clone();
            tpl.append(ingredient.name);
            selectedIngredientsElem.append(tpl);
            totalChanges++;
        }

        if (totalChanges > 0)
            selectedIngredientsElem.show();
        else
            selectedIngredientsElem.hide();
    }

    /* Change quantity of selected item by selectedIndex, incrementing by incrementQuantity. */
    this.incrementSelectedQuantity = function(selectedIndex, incrementQuantity) {
        const selectedElem = this.getSelectedItemElem(selectedIndex);
        const selectedItem = this.getSelectedItem(selectedIndex);

        const quantityButton = selectedElem.find(".selected-quantity");
        const quantityField = selectedElem.find("input[name='quantity']");

        if ((selectedItem.quantity + incrementQuantity) > 0) {
            selectedItem.quantity += incrementQuantity;
            quantityButton.text(selectedItem.quantity);
            quantityField.val(selectedItem.quantity);
        }
    }

    /* Get array of serialized selected items with clean ingredient subtypes, intended for submission to server. */
    this.getSerializedSelectedIds = function() {
        const serialized = [];

        for (item of this.selectedItems) {
            const srzItem = {
                "id": item.id,
                "add_ingredients": [],
                "remove_ingredients": [],
                "quantity": item.quantity
            };

            const diff = this.getDefaultIngredientsDiff(item.default_ingredients, item.selectedIngredients);
            srzItem.add_ingredients = diff.add;
            srzItem.remove_ingredients = diff.remove;

            serialized.push(srzItem);
        }

        return serialized;
    }

    /* Returns object with fields add and remove, containing the added items and the removed items, respectively. */
    this.getDefaultIngredientsDiff = function(defaultIngredients, selectedIngredients) {
        const diff = {"add": [], "remove": []};
        const defaultLeft = defaultIngredients.slice();
        const selectedLeft = selectedIngredients.slice();
        let defaultIndex = defaultIngredients.length;
        let selectedIndex = selectedIngredients.length;

        while(selectedIndex--) {
            let leftIndex = defaultLeft.length;
            let found = false;

            while (leftIndex--) {
                if (defaultLeft[leftIndex].id == selectedLeft[selectedIndex].id) {
                    // This is a default item. Remove both from the list.
                    found = true;
                    defaultLeft.splice(leftIndex, 1);
                    break;
                }
            }

            if (!found)
                diff.add.push(selectedLeft[selectedIndex]);
        }

        // What is remaining is items to remove.
        diff.remove = defaultLeft.slice();

        return diff;
    }

    this.getItem = function(itemId, callback) {
        const item = findModelById(this.items, itemId);

        if (item != null) {
            callback(item);
        } else {
            this.getItemAjax(itemId, callback);
        }
    }

    this.getItemAjax = function(itemId, callback) {
        const url = this.apiItemsUrl + itemId;

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
        let foundElem = null;

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
        let count = 0;

        for (const item of this.selectedItems) {
            if (item.id == itemId)
                count++;
        }

        return count;
    }

    this.getSelectedItem = function(selectedIndex) {
        for (const item of this.selectedItems) {
            if (item.selectedIndex == selectedIndex)
                return item;
        }

        return null;
    }
}
