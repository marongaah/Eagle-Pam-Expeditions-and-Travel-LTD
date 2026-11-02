(function () {
    "use strict";

    var destinations = {
        aberdare: {
            title: "8 Days Kenya Luxury Lodge Safari",
            price: "$4,850",
            image: "potraitc1.jpg",
            href: "8-days-kenya-luxury-lodge-safari.html",
            description: "Explore Aberdare, Amboseli, Lake Nakuru and the Masai Mara on a luxury lodge circuit."
        },
        amboseli: {
            title: "3 Days Amboseli Safari",
            price: "$650",
            image: "p2.jpg",
            href: "3-days-amboseli-budget-group-safari.html",
            description: "Enjoy game drives among Amboseli's elephant herds with views of Mount Kilimanjaro."
        },
        kilimanjaro: {
            title: "3 Days Amboseli Safari",
            price: "$650",
            image: "p2.jpg",
            href: "3-days-amboseli-budget-group-safari.html",
            description: "Explore the plains below Kilimanjaro and look for Amboseli's famous elephant herds."
        },
        manyara: {
            title: "11 Days Kenya & Tanzania Classic Mid-Range Jeep Safari",
            price: "$4,290",
            image: "p7.jpg",
            href: "11-days-kenya-tanzania-classic-mid-range-jeep-safari.html",
            description: "A cross-border journey that includes Lake Manyara, the Serengeti and Ngorongoro."
        },
        "masai-mara": {
            title: "3 Days Masai Mara Safari",
            price: "$650",
            image: "migration 1.jpg",
            href: "3-days-mara.html",
            description: "Search for the Big Five on game drives across the Mara's open savannah."
        },
        meru: {
            title: "The Essence of Kenya: 10 Days of Luxury Safari & Adventure",
            price: "$5,650",
            image: "PotraitElephants.jpg",
            href: "10-days-essence-of-kenya.html",
            description: "Explore Kenya on a private or group safari. Ask our team about adding Meru National Park."
        },
        "mount-kenya": {
            title: "Sirimon Summit: 4-Day Mount Kenya Trekking Adventure",
            price: "$1,350",
            image: "Mt1.jpg",
            href: "4-day-mount-kenya-trekking-adventure.html",
            label: "Featured Mount Kenya trek",
            description: "Follow the scenic Sirimon Route on a guided trek to Point Lenana."
        },
        "lake-nakuru": {
            title: "4 Days Kenya Budget 4x4 Safari",
            price: "$1,300",
            image: "potraite1.jpg",
            href: "4-days-kenya-budget-4x4-safari.html",
            description: "Combine game drives in the Masai Mara with rhino tracking at Lake Nakuru."
        },
        ngorongoro: {
            title: "7 Days Kenya & Tanzania Safari",
            price: "$3,550",
            image: "lion surrounded .jpg",
            href: "7-days-kenya-tz-safari.html",
            description: "Visit Ngorongoro Crater and the Serengeti on a Kenya and Tanzania safari."
        },
        "north-coast": {
            title: "7 Days Kenya Wildlife Safari",
            price: "$2,285",
            image: "lion surrounded .jpg",
            href: "7-days-kenya-wildlife-safari.html",
            description: "Pair this classic Kenya park circuit with a separately arranged North Coast beach stay."
        },
        samburu: {
            title: "3 Days Samburu Safari",
            price: "$840",
            image: "p1.jpg",
            href: "3-days-samburu-budget-group-safari.html",
            description: "Look for Samburu's Special Five on game drives in the reserve."
        },
        serengeti: {
            title: "7 Days Kenya & Tanzania Safari",
            price: "$3,550",
            image: "lion surrounded .jpg",
            href: "7-days-kenya-tz-safari.html",
            description: "Experience the Serengeti, Ngorongoro Crater and Masai Mara on one journey."
        },
        "south-coast": {
            title: "7 Days Kenya Wildlife Safari",
            price: "$2,285",
            image: "lion surrounded .jpg",
            href: "7-days-kenya-wildlife-safari.html",
            description: "Pair this classic Kenya park circuit with a separately arranged South Coast beach stay."
        },
        tarangire: {
            title: "12 Days Kenya & Tanzania Circuit Group Safari",
            price: "$4,847",
            image: "p3.jpg",
            href: "12-days-kenya-tanzania-circuit.html",
            description: "Visit Tarangire, Lake Manyara, the Serengeti and Ngorongoro on a group circuit."
        },
        "tsavo-east": {
            title: "5 Days Kenya Budget 4x4 Jeep Camping Safari",
            price: "$1,370",
            image: "amboseli1.jpg",
            href: "5-days-kenya-budget-safari.html",
            description: "Explore the Masai Mara, Lake Nakuru and Lake Naivasha. Contact us to tailor an itinerary that includes Tsavo East."
        },
        "tsavo-west": {
            title: "5 Days Kenya Budget 4x4 Jeep Camping Safari",
            price: "$1,370",
            image: "amboseli1.jpg",
            href: "5-days-kenya-budget-safari.html",
            description: "Explore the Masai Mara, Lake Nakuru and Lake Naivasha. Contact us to tailor an itinerary that includes Tsavo West."
        },
        zanzibar: {
            title: "7 Days Kenya & Tanzania Safari",
            price: "$3,550",
            image: "lion surrounded .jpg",
            href: "7-days-kenya-tz-safari.html",
            description: "Pair this East African wildlife circuit with a separately arranged Zanzibar beach stay."
        }
    };

    var key = document.body.getAttribute("data-destination");
    var trip = destinations[key];
    var footer = document.getElementById("footer");

    if (!trip || !footer) {
        console.error("Destination featured safari could not be rendered.", { destination: key, footer: footer });
        return;
    }

    function esc(value) {
        return String(value).replace(/[&<>"']/g, function (char) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
        });
    }

    var base = document.body.getAttribute("data-base") || "../";
    var section = document.createElement("section");
    section.className = "featured-safari";
    section.setAttribute("aria-labelledby", "featured-safari-title");
    section.innerHTML =
        '<div class="featured-safari-inner">' +
            '<div class="featured-safari-heading">' +
                '<span>' + esc(trip.label || "Featured safari") + '</span>' +
                '<h2 id="featured-safari-title">Explore ' + esc(document.querySelector(".detail-hero h1").textContent.trim()) + '</h2>' +
            '</div>' +
            '<article class="featured-safari-card">' +
                '<img src="' + encodeURI(base + "assets/images/" + trip.image) + '" alt="' + esc(trip.title) + '" loading="lazy">' +
                '<div class="featured-safari-content">' +
                    '<span class="featured-safari-label">From ' + esc(trip.price) + ' per person</span>' +
                    '<h3>' + esc(trip.title) + '</h3>' +
                    '<p>' + esc(trip.description) + '</p>' +
                    '<a class="featured-safari-link" href="' + base + 'Packages-HTML/' + encodeURIComponent(trip.href).replace(/%2F/g, "/") + '">View safari</a>' +
                '</div>' +
            '</article>' +
        '</div>';

    footer.parentNode.insertBefore(section, footer);
})();
