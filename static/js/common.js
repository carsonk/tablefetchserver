
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

    arr.forEach(function(elem) {
        if (elem.id == id) {
            foundItem = elem;
        }
    });

    return foundItem;
}

function getIdsFromModels(modelArr) {
    var idArr = [];

    modelArr.forEach(function(instance) {
        idArr.push(instance.id);
    });

    return idArr;
}

function MenuSelectWidgetManager(categoriesUrl, itemsUrl) {
    this.apiItemsUrl = itemsUrl;
    this.apiCategoriesUrl = categoriesUrl;

    this.categories = [];
    this.items = [];

    this.selectedItems = [];

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
            var itemId = selectedItem.data("item");
            var container = selectedItem.parent(".order-selected-items");

            thisWidget.openIngredientSelector(container, itemId);
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

        this.selectedItems.push(item);
        container.append(tpl);
    }

    this.openIngredientSelector = function(container, itemId) {
        var selectorModal = $("#ingredients-selector-modal");
        var thisWidget = this;

        this.getItem(itemId, function(item) {
            selectorModal.modal('show');
            thisWidget.fillIngredientsSelector(item.possible_ingredients, item.default_ingredients);
        });
    }

    this.fillIngredientsSelector = function(availableIngredients, selectedIngredients) {
        var selectorModalBody = $("#ingredients-selector-modal .modal-body");
        var tpl = $(".tpl-modal-ingredient").children("label");
        var selectedIdArr = getIdsFromModels(selectedIngredients);

        selectorModalBody.html("");

        availableIngredients.forEach(function(ingredient) {
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

    this.collectSelectedIngredients = function(itemId) {
        var selectorModal = $("#ingredients-selector-modal");
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


}
