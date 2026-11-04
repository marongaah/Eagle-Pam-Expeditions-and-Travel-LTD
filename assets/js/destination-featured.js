(function () {
    "use strict";

    var packages = {
        mara3: {
            title: "3 Days Masai Mara Safari",
            price: "$850",
            priceLabel: "Low season $850 · Peak season $1,385 per person",
            image: "migration 1.jpg",
            href: "3-days-mara.html",
            description: "Search for the Big Five on game drives across the Mara's open savannah."
        },
        migration5: {
            title: "5-Day Kenya 4x4 Migration Safari Adventure",
            price: "$1,390",
            image: "p4.jpg",
            href: "5-days-4x4-migration-safari.html",
            description: "Explore the Masai Mara on a small-group safari during the migration season."
        },
        kenya7: {
            title: "7 Days Kenya Wildlife Safari",
            price: "$2,285",
            image: "lion surrounded .jpg",
            href: "7-days-kenya-wildlife-safari.html",
            description: "A classic Kenya circuit covering the Masai Mara, Lake Nakuru and Amboseli."
        },
        amboseli3: {
            title: "3 Days Amboseli Safari",
            price: "$650",
            image: "p2.jpg",
            href: "3-days-amboseli-budget-group-safari.html",
            description: "Enjoy game drives among Amboseli's elephant herds with views of Mount Kilimanjaro."
        },
        kenyaCamping6: {
            title: "6 Days Kenya Budget 4x4 Camping Group Safari",
            price: "$1,950",
            image: "potraitg1.jpg",
            href: "6-days-kenya-budget-camping-group.html",
            description: "A multi-park Kenya camping trip that includes Amboseli and Mount Kilimanjaro views."
        },
        kenyaBudget5: {
            title: "5 Days Kenya Budget 4x4 Jeep Camping Safari",
            price: "$1,370",
            image: "amboseli1.jpg",
            href: "5-days-kenya-budget-safari.html",
            description: "Visit the Masai Mara, Lake Nakuru and Lake Naivasha on a 4x4 camping safari."
        },
        nakuru4: {
            title: "4 Days Kenya Budget 4x4 Safari",
            price: "$1,300",
            image: "potraite1.jpg",
            href: "4-days-kenya-budget-4x4-safari.html",
            description: "Combine game drives in the Masai Mara with rhino tracking at Lake Nakuru."
        },
        luxury8: {
            title: "8 Days Kenya Luxury Lodge Safari",
            price: "$4,850",
            image: "potraitc1.jpg",
            href: "8-days-kenya-luxury-lodge-safari.html",
            description: "A luxury lodge circuit through Amboseli, Aberdare, Lake Nakuru and the Masai Mara."
        },
        essence10: {
            title: "The Essence of Kenya: 10 Days of Luxury Safari & Adventure",
            price: "$5,650",
            image: "PotraitElephants.jpg",
            href: "10-days-essence-of-kenya.html",
            description: "Explore Kenya on a private or group safari. Ask our team about a custom extension to this destination."
        },
        tanzania7: {
            title: "7 Days Kenya & Tanzania Safari",
            price: "$3,550",
            image: "lion surrounded .jpg",
            href: "7-days-kenya-tz-safari.html",
            description: "Experience the Serengeti, Ngorongoro Crater and Masai Mara on one journey."
        },
        circuit12: {
            title: "12 Days Kenya & Tanzania Circuit Group Safari",
            price: "$4,847",
            image: "p3.jpg",
            href: "12-days-kenya-tanzania-circuit.html",
            description: "A group circuit through Kenya and Tanzania's iconic wildlife parks."
        },
        classic11: {
            title: "11 Days Kenya & Tanzania Classic Mid-Range Jeep Safari",
            price: "$4,290",
            image: "p7.jpg",
            href: "11-days-kenya-tanzania-classic-mid-range-jeep-safari.html",
            description: "Visit Lake Manyara, Serengeti and Ngorongoro on a mid-range cross-border safari."
        },
        kenya13: {
            title: "13-Day Kenya & Tanzania 4x4 Jeep Safari",
            price: "$6,180",
            image: "p6.jpg",
            href: "13-days-kenya-tanzania-4x4-jeep-safari.html",
            description: "A private 4x4 journey across Kenya and Tanzania's legendary parks."
        },
        samburu3: {
            title: "3 Days Samburu Safari",
            price: "$840",
            image: "p1.jpg",
            href: "3-days-samburu-budget-group-safari.html",
            description: "Look for Samburu's Special Five on game drives in the reserve."
        },
        highlights7: {
            title: "7-Day Highlights of Kenya: 4x4 Safari Adventure",
            price: "$3,780",
            image: "PotraitH1.jpg",
            href: "7-day-highlights-of-kenya.html",
            description: "A private 4x4 Kenya safari. Contact us to tailor the itinerary to this destination."
        },
        mount4: {
            title: "Sirimon Summit: 4-Day Mount Kenya Trekking Adventure",
            price: "$1,350",
            image: "Mt1.jpg",
            href: "4-day-mount-kenya-trekking-adventure.html",
            description: "Follow the scenic Sirimon Route on a guided trek to Point Lenana."
        },
        mount5: {
            title: "Conquer Mount Kenya: 5-Day Trek via Sirimon–Chogoria",
            price: "$1,550",
            image: "Mt2.jpg",
            href: "5-day-trek-sirimon-chogoria.html",
            description: "Summit Point Lenana on a guided trek up the Sirimon Route and down Chogoria."
        },
        bigFive6: {
            title: "Kenya's Big 5 Adventure: 6-Day 4x4 Safari Tour",
            price: "$2,380",
            image: "p5.jpg",
            href: "6-days-kenya-big-5-adventure-4x4-safari.html",
            description: "A small-group safari through the Masai Mara and Amboseli."
        }
    };

    var destinations = {
        aberdare: {
            packages: ["luxury8", "essence10", "kenya7"],
            notes: {
                essence10: "A Kenya safari option; contact us to confirm a custom Aberdare extension.",
                kenya7: "A Kenya park circuit; Aberdare is not included in the listed itinerary."
            }
        },
        amboseli: { packages: ["amboseli3", "kenya7", "kenyaCamping6"] },
        kilimanjaro: {
            label: "Safaris with Kilimanjaro views",
            packages: ["amboseli3", "kenya7", "kenyaCamping6"]
        },
        manyara: { packages: ["classic11", "circuit12", "kenya13"] },
        "masai-mara": { packages: ["mara3", "migration5", "kenya7"] },
        meru: {
            label: "Kenya safari packages",
            packages: ["essence10", "luxury8", "highlights7"],
            notes: {
                essence10: "Ask us to customize this Kenya trip with Meru; it is not listed in the standard itinerary.",
                luxury8: "This listed itinerary visits Aberdare, not Meru. Ask us about a custom Meru extension.",
                highlights7: "Meru is not listed in this standard itinerary; contact us to tailor the route."
            }
        },
        "mount-kenya": { packages: ["mount4", "mount5", "essence10"] },
        "lake-nakuru": { packages: ["nakuru4", "kenya7", "luxury8"] },
        ngorongoro: { packages: ["tanzania7", "classic11", "circuit12"] },
        "north-coast": {
            label: "Safari packages to pair with a beach stay",
            packages: ["kenya7", "luxury8", "essence10"],
            notes: {
                kenya7: "The safari itinerary does not include the North Coast; arrange the beach stay separately.",
                luxury8: "The listed safari visits Kenya's parks; add a separately arranged North Coast stay.",
                essence10: "The listed safari does not include the coast; ask us to arrange a separate beach extension."
            }
        },
        samburu: {
            label: "Kenya safari packages",
            packages: ["samburu3", "highlights7", "kenya7"],
            notes: {
                highlights7: "Samburu is not listed in this itinerary; contact us to tailor the route.",
                kenya7: "This itinerary visits the Mara, Nakuru and Amboseli, not Samburu."
            }
        },
        serengeti: { packages: ["tanzania7", "classic11", "circuit12"] },
        "south-coast": {
            label: "Safari packages to pair with a beach stay",
            packages: ["kenya7", "luxury8", "essence10"],
            notes: {
                kenya7: "The safari itinerary does not include the South Coast; arrange the beach stay separately.",
                luxury8: "The listed safari visits Kenya's parks; add a separately arranged South Coast stay.",
                essence10: "The listed safari does not include the coast; ask us to arrange a separate beach extension."
            }
        },
        tarangire: { packages: ["circuit12", "classic11", "kenya13"] },
        "tsavo-east": {
            label: "Kenya safari packages",
            packages: ["kenyaBudget5", "kenyaCamping6", "bigFive6"],
            notes: {
                kenyaBudget5: "This itinerary visits the Mara, Nakuru and Naivasha, not Tsavo East.",
                kenyaCamping6: "Tsavo East is not included in the listed itinerary; ask us about a custom extension.",
                bigFive6: "This itinerary visits the Mara and Amboseli; ask us to tailor a Tsavo East extension."
            }
        },
        "tsavo-west": {
            label: "Kenya safari packages",
            packages: ["kenyaBudget5", "kenyaCamping6", "bigFive6"],
            notes: {
                kenyaBudget5: "This itinerary visits the Mara, Nakuru and Naivasha, not Tsavo West.",
                kenyaCamping6: "Tsavo West is not included in the listed itinerary; ask us about a custom extension.",
                bigFive6: "This itinerary visits the Mara and Amboseli; ask us to tailor a Tsavo West extension."
            }
        },
        zanzibar: {
            label: "Safari packages to pair with a beach stay",
            packages: ["tanzania7", "circuit12", "classic11"],
            notes: {
                tanzania7: "This wildlife safari does not include Zanzibar; arrange the island stay separately.",
                circuit12: "The listed circuit does not include Zanzibar; ask us to arrange a separate beach extension.",
                classic11: "The listed safari does not include Zanzibar; arrange the island stay separately."
            }
        }
    };

    var key = document.body.getAttribute("data-destination");
    var destination = destinations[key];
    var footer = document.getElementById("footer");
    var heading = document.querySelector(".destination-intro h1, .detail-hero h1");

    if (!destination || destination.packages.length < 3 || !footer || !heading) {
        console.error("Destination featured safaris could not be rendered.", { destination: key, footer: footer, heading: heading });
        return;
    }

    function esc(value) {
        return String(value).replace(/[&<>"']/g, function (char) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
        });
    }

    var base = document.body.getAttribute("data-base") || "../";
    var cards = destination.packages.map(function (packageKey) {
        var trip = packages[packageKey];
        if (!trip) {
            console.error("Featured package is missing from the package catalog.", packageKey);
            return "";
        }

        var description = (destination.notes && destination.notes[packageKey]) || trip.description;
        return '<article class="featured-safari-card">' +
            '<img src="' + encodeURI(base + "assets/images/" + trip.image) + '" alt="' + esc(trip.title) + '" loading="lazy">' +
            '<div class="featured-safari-content">' +
                '<span class="featured-safari-label">' + esc(trip.priceLabel || ("From " + trip.price + " per person")) + '</span>' +
                '<h3>' + esc(trip.title) + '</h3>' +
                '<p>' + esc(description) + '</p>' +
                '<a class="featured-safari-link" href="' + base + 'Packages-HTML/' + encodeURIComponent(trip.href).replace(/%2F/g, "/") + '">View safari</a>' +
            '</div>' +
        '</article>';
    }).join("");

    var section = document.createElement("section");
    section.className = "featured-safari";
    section.setAttribute("aria-labelledby", "featured-safari-title");
    section.innerHTML =
        '<div class="featured-safari-inner">' +
            '<div class="featured-safari-heading">' +
                '<span>' + esc(destination.label || "Featured safaris") + '</span>' +
                '<h2 id="featured-safari-title">Safari packages for ' + esc(heading.textContent.trim()) + '</h2>' +
            '</div>' +
            '<div class="featured-safari-grid">' + cards + '</div>' +
        '</div>';

    var cta = document.querySelector(".detail-cta");
    footer.parentNode.insertBefore(section, cta || footer);
})();
