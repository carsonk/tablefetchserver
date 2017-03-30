
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

function MenuSelectWidgetManager(categoriesUrl, itemsUrl) {
    this.apiItemsUrl = itemsUrl;
    this.apiCategoriesUrl = categoriesUrl;

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

        $(".order-select-breadcrumbs").on('click', 'li', function(e) {
            var elem = $(this);
            var breadcrumbs = elem.parent(".order-select-breadcrumbs");
            var selectList = breadcrumbs.parent().children(".menu-select-list");
            var categoryId = elem.data("category");
            
            thisWidget.getCategoryList(categoryId, selectList, thisWidget.loadMenu);
            thisWidget.gotoCategoryBreadcrumb(breadcrumbs, categoryId);
        });
    }

    this.getCategoryList = function(categoryId, container, callback) {
        var data = (categoryId > 0) ? {"category": categoryId} : {};
        var itemsUrl = this.apiItemsUrl;
        var catUrl = this.apiCategoriesUrl;

        $.get(itemsUrl, data, function(data) {
            var menuItems = data.results;
            data = (categoryId > 0) ? {"parent": categoryId} : {};

            $.get(catUrl, data, function(data) {
                var menuCategories = data.results;

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
        console.log("Pushing breadcrumb: " + categoryName);
        template.data("category", categoryId);
        template.children("a").text(categoryName);
        console.log(template.html());
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
}

