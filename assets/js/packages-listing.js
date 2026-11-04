(function () {
    "use strict";

    var BASE = document.body.getAttribute("data-base") || "../";
    var PER_PAGE = 12;

    /* ---------- Package data (edit here to add/change packages) ---------- */
    var PACKAGES = [
        { t: "3 Days Masai Mara Safari", loc: "Kenya · Masai Mara", d: 3, p: 850, dest: "kenya", badge: "Bestseller", fmt: "Small group", img: "migration 1.jpg", href: "3-days-mara.html", tags: ["wildlife", "bigcats", "elephants", "budget", "photography"], season: "Best Jul – Oct for the migration", seasons: [["Low season (Jan - June)", 850], ["Peak season (July - Dec)", 1385]], feats: ["Big Five game drives", "Expert guides", "2–6 people"] },
        { t: "7 Days Kenya Wildlife Safari", loc: "Masai Mara · Lake Nakuru · Amboseli", d: 7, p: 2285, dest: "kenya", badge: "Popular", fmt: "Group tour", img: "lion surrounded .jpg", href: "7-days-kenya-wildlife-safari.html", tags: ["wildlife", "bigcats", "elephants", "rhino", "photography"], season: "Good year-round", feats: ["Three parks, one journey", "Full safari circuit", "2–60 people"] },
        { t: "5 Days Kenya Budget 4X4 Jeep Camping Safari", loc: "Masai Mara · Lake Nakuru · Lake Naivasha", d: 5, p: 1370, dest: "kenya", badge: "Budget Safari", fmt: "Group tour", img: "amboseli1.jpg", href: "5-days-kenya-budget-safari.html", tags: ["wildlife", "rhino", "budget"], season: "Good year-round", feats: ["4x4 Land Cruiser", "Camping safari", "2–60 people"] },
        { t: "4 Days Kenya Budget 4x4 Safari", loc: "Masai Mara · Lake Nakuru", d: 4, p: 1300, dest: "kenya", badge: "Budget", fmt: "Group tour", img: "potraite1.jpg", href: "4-days-kenya-budget-4x4-safari.html", tags: ["wildlife", "bigcats", "rhino", "budget"], season: "Good year-round", feats: ["Game drives in the Mara", "Rhino tracking at Lake Nakuru", "4x4 Land Cruiser"] },
        { t: "8 Days Kenya Luxury Lodge Safari", loc: "Amboseli · Aberdare · Nakuru · Masai Mara", d: 8, p: 4850, dest: "kenya", badge: "Luxury", fmt: "Private or group", img: "potraitc1.jpg", href: "8-days-kenya-luxury-lodge-safari.html", tags: ["wildlife", "bigcats", "elephants", "rhino", "luxury", "romance"], season: "Good year-round", feats: ["Luxury safari lodges", "Four premier destinations", "Private or group options"] },
        { t: "8-Day Classic Kenya Family 4x4 Safari Experience", loc: "Lake Nakuru · Lake Naivasha · Masai Mara", d: 8, p: 4600, dest: "kenya", badge: "Family Safari", fmt: "Private tour", img: "Potraitsafari.jpg", href: "8-day-family.html", tags: ["wildlife", "bigcats", "elephants", "rhino", "photography"], season: "Good year-round", feats: ["Three days in the Masai Mara", "Lake Nakuru & Lake Naivasha", "Private 4x4 family safari"] },
        { t: "The Essence of Kenya: 10 Days of Luxury Safari & Adventure", loc: "Nairobi · Amboseli · Mount Kenya · Nakuru · Naivasha · Masai Mara", d: 10, p: 5650, dest: "kenya", badge: "Luxury", fmt: "Private or group", img: "PotraitElephants.jpg", href: "10-days-essence-of-kenya.html", tags: ["wildlife", "elephants", "rhino", "luxury", "romance", "hiking", "photography"], season: "Good year-round", feats: ["Luxury lodges throughout", "Six destinations in Kenya", "Private or group options"] },
        { t: "6 Days Kenya Budget 4X4 Camping Group Safari", loc: "Masai Mara · Lake Nakuru · Amboseli", d: 6, p: 1950, dest: "kenya", badge: "Group Camping", fmt: "Group tour", img: "potraitg1.jpg", href: "6-days-kenya-budget-camping-group.html", tags: ["wildlife", "elephants", "rhino", "budget"], season: "Good year-round", feats: ["4x4 Land Cruiser", "Camping safari", "Group departures"] },
        { t: "7-Day Highlights of Kenya: 4x4 Safari Adventure", loc: "Nairobi · Shaba · Lake Nakuru · Masai Mara", d: 7, p: 3780, dest: "kenya", badge: "Highlights", fmt: "Private tour", img: "PotraitH1.jpg", href: "7-day-highlights-of-kenya.html", tags: ["wildlife", "bigcats", "rhino", "photography"], season: "Good year-round", feats: ["Premium safari lodges", "4x4 Land Cruiser", "Private safari"] },
        { t: "3 Days Amboseli Safari", loc: "Amboseli National Park", d: 3, p: 650, dest: "kenya", badge: "Group Safari", fmt: "Group tour", img: "p2.jpg", href: "3-days-amboseli-budget-group-safari.html", tags: ["wildlife", "bigcats", "elephants", "budget", "photography"], season: "Best Jun – Oct", feats: ["Views of Mount Kilimanjaro", "4x4 Land Cruiser", "Budget, mid-range & luxury options"], note: "Budget price shown" },
        { t: "3 Days Samburu Safari", loc: "Samburu National Reserve", d: 3, p: 840, dest: "kenya", badge: "Group Safari", fmt: "Group tour", img: "p1.jpg", href: "3-days-samburu-budget-group-safari.html", tags: ["wildlife", "bigcats", "elephants", "budget", "photography"], season: "Best Jun – Oct", feats: ["Search for the Samburu Special Five", "Stay at Samburu Simba Lodge", "Budget, mid-range & luxury options"], note: "Budget price shown" },
        { t: "5-Day Kenya 4x4 Migration Safari Adventure: Into the Wild", loc: "Kenya · Masai Mara", d: 5, p: 1390, dest: "kenya", badge: "Migration", fmt: "Small group", img: "p4.jpg", href: "5-days-4x4-migration-safari.html", tags: ["wildlife", "bigcats", "migration", "photography"], season: "Best Jul – Oct", feats: ["Migration landscapes", "Comfortable 4x4 safari vehicle", "Small group"] },
        { t: "9-Day East Africa Safari: Explore Kenya & Tanzania on a Budget", loc: "Kenya · Tanzania · Masai Mara · Serengeti · Ngorongoro", d: 9, p: 4104, dest: "tanzania", badge: "Budget Safari", fmt: "Private tour", img: "lion surrounded .jpg", href: "9-day-east-africa-safari.html", tags: ["wildlife", "bigcats", "migration", "elephants", "photography", "budget"], season: "Good year-round", feats: ["Masai Mara & Serengeti", "Ngorongoro Crater 4WD excursion", "Nairobi wildlife & cultural visits"] },
        { t: "7-Day Northern Kenya's Finest Luxury Safari", loc: "Aberdare · Mount Kenya · Samburu · Meru", d: 7, p: 4388, dest: "kenya", badge: "Luxury Safari", fmt: "Private tour", img: "samburu-hero.jpg", href: "7-day-north.html", tags: ["wildlife", "elephants", "rhino", "luxury", "photography"], season: "Good year-round", feats: ["Game drives in Samburu & Meru", "Aberdare & Mount Kenya scenery", "Private, fully guided tour"] },
        { t: "5 Days Kenya Budget Jeep Safari: Masai Mara, Lake Nakuru & Hell's Gate", loc: "Masai Mara · Lake Nakuru · Lake Naivasha", d: 5, p: 1150, dest: "kenya", badge: "Budget Jeep Safari", fmt: "Group tour", img: "mara1.jpg", href: "5-day-kenya-jeep-safari.html", tags: ["wildlife", "bigcats", "elephants", "budget", "photography", "hiking"], season: "Good year-round", feats: ["Masai Mara & Lake Nakuru game drives", "Lake Naivasha & Hell's Gate", "Small group of 2–7"] },
        { t: "12 Days Tanzania & Kenya Great Migration Budget Camping Group Tour", loc: "Kenya · Tanzania", d: 12, p: 3250, dest: "tanzania", badge: "Budget Camping", fmt: "Group tour", img: "mara1.jpg", href: "12-days-kenya-tanzania-budget.html", tags: ["wildlife", "bigcats", "migration", "elephants", "budget", "photography"], season: "Best Jun – Oct for the migration", feats: ["Masai Mara, Serengeti & Ngorongoro", "Budget camps & hotels", "Small group of 2–7"] },
        { t: "14-Day Ultimate Kenya Big Five Safari & Beach Adventure", loc: "Masai Mara · Lake Nakuru · Naivasha · Amboseli · Tsavo West · Diani Beach", d: 14, p: 4731, dest: "kenya", badge: "Safari & Beach", fmt: "Private tour", img: "beach1.jpg", href: "14-day-kenya-big-five-safari-beach-eagle-pam.html", tags: ["wildlife", "bigcats", "elephants", "rhino", "photography", "romance"], season: "Safari and Diani Beach year-round", feats: ["Big Five safari across four parks", "Four days at Diani Beach", "Shared-room reference total incl. park fees"] },
        { t: "Kenya's Big 5 Adventure: 6-Day 4x4 Safari Tour", loc: "Kenya · Masai Mara · Amboseli", d: 6, p: 2380, dest: "kenya", badge: "Big Five", fmt: "Small group", img: "p5.jpg", href: "6-days-kenya-big-5-adventure-4x4-safari.html", tags: ["wildlife", "bigcats", "elephants", "rhino", "photography"], season: "Good year-round", feats: ["Search for the Big Five", "Masai Mara & Amboseli", "Small group"] },
        { t: "7 Days Kenya & Tanzania Safari", loc: "Kenya · Tanzania Circuit", d: 7, p: 3550, dest: "tanzania", badge: "Premium", fmt: "Small group", img: "lion surrounded .jpg", href: "7-days-kenya-tz-safari.html", tags: ["wildlife", "bigcats", "migration", "elephants", "photography"], season: "Best Jun – Oct", feats: ["Serengeti & Ngorongoro Crater", "Masai Mara", "Cross-border journey"] },
        { t: "12 Days Kenya & Tanzania Circuit Group Safari", loc: "Kenya · Tanzania", d: 12, p: 4847, dest: "tanzania", badge: "Group Safari", fmt: "Group tour", img: "p3.jpg", href: "12-days-kenya-tanzania-circuit.html", tags: ["wildlife", "bigcats", "migration", "elephants", "photography"], season: "Good year-round", feats: ["Iconic East African parks", "4x4 Land Cruiser", "Group departures"] },
        { t: "13-Day Kenya & Tanzania 4x4 Jeep Safari: From Savannah to Serengeti", loc: "Masai Mara · Amboseli · Ngorongoro · Serengeti · Tarangire", d: 13, p: 6180, dest: "tanzania", badge: "4x4 Safari", fmt: "Private tour", img: "p6.jpg", href: "13-days-kenya-tanzania-4x4-jeep-safari.html", tags: ["wildlife", "bigcats", "migration", "elephants", "photography"], season: "Best Jun – Oct", feats: ["Five legendary parks", "4x4 jeep safari", "Two countries"] },
        { t: "11 Days Kenya & Tanzania Classic Mid-Range Jeep Safari", loc: "Masai Mara · Lake Nakuru · Amboseli · Serengeti · Ngorongoro", d: 11, p: 4290, dest: "tanzania", badge: "Mid-Range", fmt: "Group tour", img: "p7.jpg", href: "11-days-kenya-tanzania-classic-mid-range-jeep-safari.html", tags: ["wildlife", "bigcats", "rhino", "elephants"], season: "Good year-round", feats: ["Mid-range stays", "4x4 jeep safari", "Two countries"] },
        { t: "Sirimon Summit: 4-Day Mount Kenya Trekking Adventure", loc: "Mount Kenya National Park", d: 4, p: 1350, dest: "mountain", badge: "Moderate Trek", fmt: "Guided trek", img: "Mt1.jpg", href: "4-day-mount-kenya-trekking-adventure.html", tags: ["hiking", "photography"], season: "Best Jan – Mar & Jul – Oct", feats: ["Scenic Sirimon Route", "Guided trek", "Mount Kenya National Park"] },
        { t: "Conquer Mount Kenya: 5-Day Trek via Sirimon–Chogoria Route", loc: "Mount Kenya", d: 5, p: 1550, dest: "mountain", badge: "Moderate Trek", fmt: "Guided trek", img: "Mt2.jpg", href: "5-day-trek-sirimon-chogoria.html", tags: ["hiking", "photography"], season: "Best Jan – Mar & Jul – Oct", feats: ["Summit Point Lenana", "Up Sirimon, down Chogoria", "Guided trek"] }
    ];

    var TAGS = [
        ["wildlife", "Wildlife & game drives"], ["bigcats", "Big cats"], ["migration", "Great Migration"],
        ["elephants", "Elephants"], ["rhino", "Rhino & conservation"], ["hiking", "Hiking & walking"],
        ["photography", "Photography"], ["romance", "Honeymoon & romance"], ["luxury", "Luxury"], ["budget", "Budget"]
    ];
    var DESTS = [["all", "All destinations"], ["kenya", "Kenya"], ["tanzania", "Kenya & Tanzania"], ["mountain", "Mountain trekking"]];
    var CHIPS = [
        { k: "len", v: "short", l: "2 – 4 days" }, { k: "len", v: "mid", l: "5 – 7 days" }, { k: "len", v: "long", l: "8+ days" },
        { k: "tag", v: "bigcats", l: "Big cats" }, { k: "tag", v: "migration", l: "Great Migration" },
        { k: "tag", v: "hiking", l: "Hiking & walking" }, { k: "under", v: "1000", l: "Under $1,000" },
        { k: "tag", v: "luxury", l: "Luxury" }, { k: "tag", v: "budget", l: "Budget" }
    ];

    var state = { q: "", len: "all", dest: "all", tags: [], under: false, sort: "recommended", page: 1 };

    var $ = function (id) { return document.getElementById(id); };
    var els = {
        where: $("pkWhere"), length: $("pkLength"), form: $("pkSearchForm"), chips: $("pkChips"),
        dest: $("pkDestList"), tags: $("pkInterestList"), grid: $("pkGrid"), count: $("pkCount"),
        range: $("pkRange"), pager: $("pkPager"), sort: $("pkSort"), empty: $("pkEmpty"),
        sidebar: $("pkSidebar")
    };

    var ICON_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>';
    var ICON_PERSON = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>';
    var ICON_SWAP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/></svg>';

    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }
    function money(n) { return "$" + n.toLocaleString("en-US"); }
    function lenBand(d) { return d <= 4 ? "short" : d <= 7 ? "mid" : "long"; }

    /* ---------- Filtering ---------- */
    function matches(p, skip) {
        skip = skip || {};
        if (!skip.q && state.q) {
            var hay = (p.t + " " + p.loc + " " + p.badge + " " + p.tags.join(" ") + " " + (p.dest === "tanzania" ? "tanzania serengeti ngorongoro" : "")).toLowerCase();
            var words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
            for (var i = 0; i < words.length; i++) if (hay.indexOf(words[i]) === -1) return false;
        }
        if (!skip.len && state.len !== "all" && lenBand(p.d) !== state.len) return false;
        if (!skip.dest && state.dest !== "all" && p.dest !== state.dest) return false;
        if (!skip.under && state.under && p.p >= 1000) return false;
        if (!skip.tags && state.tags.length) {
            var ok = state.tags.some(function (t) { return p.tags.indexOf(t) > -1; });
            if (!ok) return false;
        }
        return true;
    }

    function sorted(list) {
        var a = list.slice();
        var s = state.sort;
        if (s === "price-asc") a.sort(function (x, y) { return x.p - y.p; });
        else if (s === "price-desc") a.sort(function (x, y) { return y.p - x.p; });
        else if (s === "days-asc") a.sort(function (x, y) { return x.d - y.d; });
        else if (s === "days-desc") a.sort(function (x, y) { return y.d - x.d; });
        return a;
    }

    /* ---------- Rendering ---------- */
    function renderCard(p) {
        var img = encodeURI(BASE + "assets/images/" + p.img);
        var priv = /private/i.test(p.fmt);
        var pill = '<span class="pk-pill">' + (priv ? ICON_PERSON : ICON_SWAP) + esc(p.fmt) + "</span>";
        var feats = p.feats.map(function (f) { return "<li>" + ICON_CHECK + "<span>" + esc(f) + "</span></li>"; }).join("");
        var nights = p.d - 1;
        var priceMarkup = p.seasons
            ? '<span class="pk-label">Seasonal pricing</span><div class="pk-seasonal-prices">' +
                p.seasons.map(function (season) {
                    return '<span><span>' + esc(season[0]) + '</span><strong>' + money(season[1]) + '</strong></span>';
                }).join("") + '</div><span class="pk-sub">per person</span>'
            : '<span class="pk-label">From</span><span class="pk-big">' + money(p.p) + '</span><span class="pk-sub">' + (p.note || "per person") + "</span>";
        return '<article class="pk-card"><a class="pk-card-link" href="' + BASE + "Packages-HTML/" + p.href + '">' +
            '<div class="pk-card-img"><img src="' + img + '" alt="' + esc(p.t) + '" loading="lazy"><span class="pk-badge">' + esc(p.badge) + "</span></div>" +
            '<div class="pk-card-body">' + pill +
            '<div class="pk-loc">' + esc(p.loc) + "</div>" +
            '<h3 class="pk-title">' + esc(p.t) + "</h3>" +
            '<div class="pk-season">' + esc(p.season) + "</div>" +
            '<ul class="pk-feats">' + feats + "</ul>" +
            '<div class="pk-card-foot">' +
            '<div class="pk-price-cell">' + priceMarkup + "</div>" +
            '<div><span class="pk-label">Duration</span><span class="pk-big">' + p.d + ' days</span><span class="pk-sub">' + nights + " nights</span></div>" +
            "</div>" +
            "</div></a></article>";
    }

    function renderChips() {
        els.chips.innerHTML = CHIPS.map(function (c, i) {
            return '<button type="button" class="pk-chip" data-i="' + i + '" aria-pressed="' + chipOn(c) + '">' + esc(c.l) + "</button>";
        }).join("");
    }
    function chipOn(c) {
        if (c.k === "len") return state.len === c.v;
        if (c.k === "tag") return state.tags.indexOf(c.v) > -1;
        return state.under;
    }

    function renderSidebar() {
        els.dest.innerHTML = DESTS.map(function (d) {
            var n = PACKAGES.filter(function (p) { return (d[0] === "all" || p.dest === d[0]) && matches(p, { dest: true }); }).length;
            return '<label class="pk-opt pk-radio"><input type="radio" name="pkDest" value="' + d[0] + '"' + (state.dest === d[0] ? " checked" : "") + '><span class="pk-box"></span><span class="pk-opt-label">' + d[1] + '</span><span class="pk-opt-count">' + n + "</span></label>";
        }).join("");

        els.tags.innerHTML = TAGS.map(function (t) {
            var n = PACKAGES.filter(function (p) { return p.tags.indexOf(t[0]) > -1 && matches(p, { tags: true }); }).length;
            return '<label class="pk-opt"><input type="checkbox" value="' + t[0] + '"' + (state.tags.indexOf(t[0]) > -1 ? " checked" : "") + '><span class="pk-box"></span><span class="pk-opt-label">' + t[1] + '</span><span class="pk-opt-count">' + n + "</span></label>";
        }).join("");
    }

    function renderPager(pages) {
        if (pages <= 1) { els.pager.innerHTML = ""; return; }
        var h = "";
        h += '<button type="button" data-p="1" aria-label="First page"' + (state.page === 1 ? " disabled" : "") + ">«</button>";
        h += '<button type="button" data-p="' + (state.page - 1) + '" aria-label="Previous page"' + (state.page === 1 ? " disabled" : "") + ">‹</button>";
        for (var i = 1; i <= pages; i++) {
            h += '<button type="button" data-p="' + i + '"' + (i === state.page ? ' class="is-active" aria-current="page"' : "") + ">" + i + "</button>";
        }
        h += '<button type="button" data-p="' + (state.page + 1) + '" aria-label="Next page"' + (state.page === pages ? " disabled" : "") + ">›</button>";
        h += '<button type="button" data-p="' + pages + '" aria-label="Last page"' + (state.page === pages ? " disabled" : "") + ">»</button>";
        els.pager.innerHTML = h;
    }

    function render(scroll) {
        var list = sorted(PACKAGES.filter(function (p) { return matches(p); }));
        var total = list.length;
        var pages = Math.max(1, Math.ceil(total / PER_PAGE));
        if (state.page > pages) state.page = pages;
        var start = (state.page - 1) * PER_PAGE;
        var slice = list.slice(start, start + PER_PAGE);

        els.grid.innerHTML = slice.map(renderCard).join("");
        els.empty.hidden = total !== 0;
        els.count.innerHTML = "<strong>" + total + "</strong> " + (total === 1 ? "package" : "packages") + " found";
        els.range.innerHTML = total
            ? "Showing <strong>" + (start + 1) + "–" + (start + slice.length) + "</strong> of " + total + " tours · page " + state.page + " of " + pages
            : "";
        els.range.hidden = !total;

        renderPager(pages);
        renderChips();
        renderSidebar();
        els.length.value = state.len;
        if (scroll) {
            var top = els.grid.getBoundingClientRect().top + window.pageYOffset - 120;
            window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        }
    }

    /* ---------- Events ---------- */
    function reset() {
        state.q = ""; state.len = "all"; state.dest = "all"; state.tags = []; state.under = false; state.page = 1;
        els.where.value = "";
        render();
    }

    els.form.addEventListener("submit", function (e) {
        e.preventDefault();
        state.q = els.where.value.trim(); state.page = 1; render(true);
    });
    els.where.addEventListener("input", function () {
        state.q = els.where.value.trim(); state.page = 1; render();
    });
    els.length.addEventListener("change", function () { state.len = els.length.value; state.page = 1; render(); });
    els.sort.addEventListener("change", function () { state.sort = els.sort.value; state.page = 1; render(); });

    els.chips.addEventListener("click", function (e) {
        var b = e.target.closest(".pk-chip"); if (!b) return;
        var c = CHIPS[+b.getAttribute("data-i")];
        if (c.k === "len") state.len = state.len === c.v ? "all" : c.v;
        else if (c.k === "under") state.under = !state.under;
        else {
            var i = state.tags.indexOf(c.v);
            if (i > -1) state.tags.splice(i, 1); else state.tags.push(c.v);
        }
        state.page = 1; render();
    });

    els.dest.addEventListener("change", function (e) { state.dest = e.target.value; state.page = 1; render(); });
    els.tags.addEventListener("change", function (e) {
        var v = e.target.value, i = state.tags.indexOf(v);
        if (e.target.checked && i === -1) state.tags.push(v);
        if (!e.target.checked && i > -1) state.tags.splice(i, 1);
        state.page = 1; render();
    });

    els.pager.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-p]"); if (!b || b.disabled) return;
        state.page = +b.getAttribute("data-p"); render(true);
    });

    $("pkClear").addEventListener("click", reset);
    $("pkEmptyReset").addEventListener("click", reset);

    document.querySelectorAll(".pk-group-toggle").forEach(function (btn) {
        btn.addEventListener("click", function () {
            btn.setAttribute("aria-expanded", btn.getAttribute("aria-expanded") === "true" ? "false" : "true");
        });
    });
    $("pkSidebarToggle").addEventListener("click", function () {
        var open = els.sidebar.classList.toggle("is-open");
        this.setAttribute("aria-expanded", open);
    });

    /* Allow deep links such as packages.html?q=mara or ?dest=mountain */
    var params = new URLSearchParams(window.location.search);
    if (params.get("q")) { state.q = params.get("q"); els.where.value = state.q; }
    if (params.get("dest") && DESTS.some(function (d) { return d[0] === params.get("dest"); })) state.dest = params.get("dest");

   console.log("Packages script loaded");
console.log("Total packages:", PACKAGES.length);
console.log("Package grid:", els.grid);
    render();
})();