(function () {
    "use strict";

    var form = document.getElementById("destinationSearch");
    var queryInput = document.getElementById("destinationQuery");
    var categorySelect = document.getElementById("destinationCategory");
    var count = document.getElementById("destinationSearchCount");
    var empty = document.getElementById("destinationSearchEmpty");
    var clear = document.getElementById("destinationSearchClear");
    var sections = Array.prototype.slice.call(document.querySelectorAll(".destination-section[data-category]"));

    if (!form || !queryInput || !categorySelect || !count || !empty || !clear || !sections.length) {
        console.error("Destination search could not be initialized.");
        return;
    }

    function normalize(value) {
        return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function filterDestinations() {
        var query = normalize(queryInput.value.trim());
        var category = categorySelect.value;
        var visible = 0;

        sections.forEach(function (section) {
            var categoryMatches = category === "all" || section.dataset.category === category;
            var cards = Array.prototype.slice.call(section.querySelectorAll(".destination-card"));
            var sectionVisible = 0;

            cards.forEach(function (card) {
                var textMatches = !query || normalize(card.textContent).includes(query);
                var isVisible = categoryMatches && textMatches;
                card.hidden = !isVisible;
                if (isVisible) {
                    sectionVisible++;
                    visible++;
                }
            });

            section.hidden = sectionVisible === 0;
        });

        count.textContent = "Showing " + visible + " " + (visible === 1 ? "destination" : "destinations");
        empty.hidden = visible !== 0;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        filterDestinations();
    });

    queryInput.addEventListener("input", filterDestinations);
    categorySelect.addEventListener("change", filterDestinations);
    clear.addEventListener("click", function () {
        queryInput.value = "";
        categorySelect.value = "all";
        filterDestinations();
        queryInput.focus();
    });

    filterDestinations();
})();
