// =======================================================
// EAGLE PAM EXPEDITIONs
// =======================================================

document.addEventListener("DOMContentLoaded", () => {

    initAnimations();
    initBackToTop();
    initSafariForm();
    initTourSelection();
    initSidebar();
    initNavbarFooter();
    initItinerary();
    initPackagesPage();
    initPackageBookingCta();

});

// =======================================================
// ANIMATIONS
// =======================================================

function initAnimations() {

    const sections = document.querySelectorAll(
        ".tour-card, .why-box, .destination-card, .stat-box"
    );

    if (!sections.length) return;

    const observer = new IntersectionObserver((entries, obs) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add("show");

            obs.unobserve(entry.target);

        });

    }, {
        threshold: 0.1
    });

    sections.forEach(section => observer.observe(section));

}

// =======================================================
// BACK TO TOP
// =======================================================

function initBackToTop() {

    const topBtn = document.getElementById("topBtn");

    if (!topBtn) return;

    window.addEventListener("scroll", () => {

        topBtn.style.display =
            window.scrollY > 300 ? "block" : "none";

    });

    topBtn.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}

// =======================================================
// SAFARI BOOKING FORM
// =======================================================

function initSafariForm() {

    const safariForm = document.getElementById("safariForm");

    if (!safariForm) return;

    const buildInquiryMessage = () => {
        const getValue = (id) => document.getElementById(id)?.value.trim() || "";
        const name = getValue("name");
        const email = getValue("email");
        const phone = getValue("phone");
        const destination = getValue("destination");
        const date = getValue("date");
        const days = getValue("days");
        const travelers = getValue("travelers");
        const budget = getValue("budget");
        const message = getValue("message");
        const formattedDate = date
            ? new Intl.DateTimeFormat("en", {
                day: "numeric",
                month: "long",
                year: "numeric"
            }).format(new Date(`${date}T00:00:00`))
            : "Not provided";

        return [
            "SAFARI PLANNING ENQUIRY",
            "Eagle Pam Expeditions & Travel",
            "",
            "Dear Eagle Pam Expeditions Team,",
            "",
            "I would love your help planning the following safari:",
            "",
            "TRIP PREFERENCES",
            `Safari or destination: ${destination || "Not selected yet"}`,
            `Preferred departure date: ${formattedDate}`,
            `Trip duration: ${days ? `${days} days` : "Flexible / not specified"}`,
            `Group size: ${travelers} ${Number(travelers) === 1 ? "traveller" : "travellers"}`,
            `Preferred travel style: ${budget || "No preference selected"}`,
            "",
            "TRAVELLER CONTACT DETAILS",
            `Full name: ${name}`,
            `Email address: ${email}`,
            `Phone / WhatsApp: ${phone}`,
            "",
            "ADDITIONAL REQUESTS",
            message || "No additional requests at this time.",
            "",
            "Please share your availability, a tailored itinerary, and a quotation for this trip.",
            "",
            "Kind regards,",
            name
        ].join("\n");
    };

    safariForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const destination = document.getElementById("destination")?.value.trim();
        const subject = destination
            ? `Safari planning enquiry | ${destination}`
            : "Safari planning enquiry | Eagle Pam Expeditions";
        const mailto = `mailto:info@eaglepamexpeditionsandtravel.com?${new URLSearchParams({
            subject,
            body: buildInquiryMessage()
        })}`;

        window.location.href = mailto;
    });

    document.getElementById("bookingWhatsApp")?.addEventListener("click", () => {
        if (!safariForm.reportValidity()) return;

        const whatsappMessage = [
            "Hello Eagle Pam Expeditions,",
            "",
            buildInquiryMessage()
        ].join("\n");

        window.open(
            `https://wa.me/254111932279?${new URLSearchParams({ text: whatsappMessage })}`,
            "_blank",
            "noopener,noreferrer"
        );

    });

}

// =======================================================
// TOUR PRE-SELECTION
// =======================================================

function initTourSelection() {

    const params = new URLSearchParams(window.location.search);

    const tour = params.get("tour");

    const destinationField =
        document.getElementById("destination") ||
        document.querySelector("select");

    if (tour && destinationField) {

        destinationField.value = tour;

    }

    const travelDate = document.getElementById("date");

    if (travelDate) {
        const today = new Date();
        const localToday = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");

        travelDate.min = localToday;
    }

}

function initPackageBookingCta() {

    const hero = document.querySelector(".package-intro");

    if (!hero) return;

    const packageTitle = hero.querySelector("h1, h2")?.textContent.trim().replace(/\s+/g, " ");

    if (!packageTitle) {
        console.error("Package booking button could not be initialized.");
        return;
    }

    function initFeaturedSafaris() {
        const existingSections = document.querySelectorAll(".related-section");
        const footer = document.getElementById("footer");

        if (!footer || !document.querySelector(".package-intro")) return;

        const packages = [
            {
                title: "3 Days Masai Mara Safari",
                location: "Kenya · Masai Mara",
                days: 3,
                price: 650,
                badge: "Bestseller",
                format: "Small group",
                image: "migration 1.jpg",
                href: "3-days-mara.html",
                description: "Enjoy Big Five game drives and expert-guided wildlife viewing in Kenya's iconic Mara."
            },
            {
                title: "7 Days Kenya Wildlife Safari",
                location: "Masai Mara · Lake Nakuru · Amboseli",
                days: 7,
                price: 2285,
                badge: "Popular",
                format: "Group tour",
                image: "lion surrounded .jpg",
                href: "7-days-kenya-wildlife-safari.html",
                description: "Explore three celebrated parks on a memorable journey through Kenya's diverse landscapes."
            },
            {
                title: "5 Days Kenya Budget 4x4 Camping Safari",
                location: "Masai Mara · Lake Nakuru · Lake Naivasha",
                days: 5,
                price: 1370,
                badge: "Great value",
                format: "Group tour",
                image: "amboseli1.jpg",
                href: "5-days-kenya-budget-safari.html",
                description: "Discover Kenya's classic wildlife destinations with a 4x4 Land Cruiser and camping stays."
            },
            {
                title: "8 Days Kenya Luxury Lodge Safari",
                location: "Amboseli · Aberdare · Nakuru · Masai Mara",
                days: 8,
                price: 4850,
                badge: "Luxury",
                format: "Private or group",
                image: "potraitc1.jpg",
                href: "8-days-kenya-luxury-lodge-safari.html",
                description: "Travel between four premier destinations with the comfort of carefully selected lodges."
            },
            {
                title: "7 Days Kenya & Tanzania Safari",
                location: "Kenya · Tanzania circuit",
                days: 7,
                price: 3550,
                badge: "Cross-border",
                format: "Small group",
                image: "lion surrounded .jpg",
                href: "7-days-kenya-tz-safari.html",
                description: "Pair the Masai Mara with Tanzania's Serengeti and Ngorongoro on one classic circuit."
            },
            {
                title: "3 Days Samburu Safari",
                location: "Samburu National Reserve",
                days: 3,
                price: 840,
                badge: "Northern Kenya",
                format: "Group tour",
                image: "p1.jpg",
                href: "3-days-samburu-budget-group-safari.html",
                description: "Seek out the Samburu Special Five among dramatic northern landscapes and wildlife."
            },
            {
                title: "3 Days Amboseli Safari",
                location: "Amboseli National Park",
                days: 3,
                price: 650,
                badge: "Group safari",
                format: "Group tour",
                image: "p2.jpg",
                href: "3-days-amboseli-budget-group-safari.html",
                description: "See Amboseli's celebrated elephant herds with Mount Kilimanjaro rising beyond the plains."
            },
            {
                title: "12 Days Kenya & Tanzania Circuit",
                location: "Kenya · Tanzania",
                days: 12,
                price: 4847,
                badge: "Cross-border",
                format: "Group tour",
                image: "p3.jpg",
                href: "12-days-kenya-tanzania-circuit.html",
                description: "Discover iconic East African parks on an extended Kenya and Tanzania group safari."
            },
            {
                title: "13 Days Kenya & Tanzania 4x4 Jeep Safari",
                location: "Masai Mara · Amboseli · Serengeti · Ngorongoro",
                days: 13,
                price: 6180,
                badge: "4x4 safari",
                format: "Private tour",
                image: "p6.jpg",
                href: "13-days-kenya-tanzania-4x4-jeep-safari.html",
                description: "Journey across five legendary parks in two countries on a private 4x4 safari."
            },
            {
                title: "11 Days Kenya & Tanzania Classic Safari",
                location: "Masai Mara · Amboseli · Serengeti · Ngorongoro",
                days: 11,
                price: 4290,
                badge: "Mid-range",
                format: "Group tour",
                image: "p7.jpg",
                href: "11-days-kenya-tanzania-classic-mid-range-jeep-safari.html",
                description: "Experience a classic cross-border route with comfortable mid-range stays and game drives."
            },
            {
                title: "4-Day Mount Kenya Trek",
                location: "Mount Kenya National Park",
                days: 4,
                price: 1350,
                badge: "Guided trek",
                format: "Sirimon route",
                image: "Mt1.jpg",
                href: "4-day-mount-kenya-trekking-adventure.html",
                description: "Take the scenic Sirimon route on a guided trek through Mount Kenya National Park."
            },
            {
                title: "5-Day Mount Kenya Trek",
                location: "Mount Kenya · Sirimon–Chogoria route",
                days: 5,
                price: 1550,
                badge: "Guided trek",
                format: "Summit adventure",
                image: "Mt2.jpg",
                href: "5-day-trek-sirimon-chogoria.html",
                description: "Climb to Point Lenana on a guided trek up the scenic Sirimon and Chogoria routes."
            }
        ];

        const currentPage = window.location.pathname.split("/").pop();
        const isTanzaniaCircuit = /tanzania/i.test(currentPage);
        const isMountainTrek = /mount-kenya|trek-sirimon/i.test(currentPage);
        const recommendations = packages.filter((item) => item.href !== currentPage);
        const preferred = isMountainTrek
            ? recommendations.filter((item) => /mount-kenya|trek-sirimon/i.test(item.href))
            : isTanzaniaCircuit
                ? recommendations.filter((item) => /tanzania/i.test(item.href))
                : recommendations.filter((item) => !/tanzania|mount-kenya|trek-sirimon/i.test(item.href));
        const selected = [...preferred, ...recommendations.filter((item) => !preferred.includes(item))]
            .slice(0, 3);

        if (selected.length < 3) return;

        const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);

        const cards = selected.map((item) => `
            <article class="package-card featured-package-card">
                <div class="card-image">
                    <img src="../assets/images/${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" loading="lazy">
                    <span class="badge">${escapeHTML(item.badge)}</span>
                </div>
                <div class="package-info">
                    <div class="package-top">
                        <h3>${escapeHTML(item.title)}</h3>
                        <span class="location">${escapeHTML(item.location)}</span>
                    </div>
                    <p>${escapeHTML(item.description)}</p>
                    <div class="package-meta">
                        <span><i class="fa-regular fa-clock" aria-hidden="true"></i> ${item.days} days</span>
                        <span><i class="fa-solid fa-compass" aria-hidden="true"></i> ${escapeHTML(item.format)}</span>
                    </div>
                    <div class="package-footer">
                        <div class="price">
                            <small>From per person</small>
                            <h4>$${item.price.toLocaleString("en-US")}</h4>
                        </div>
                        <a class="card-btn" href="${escapeHTML(item.href)}">View safari</a>
                    </div>
                </div>
            </article>
        `).join("");

        existingSections.forEach((section) => section.remove());

        const section = document.createElement("section");
        section.className = "related-section featured-safaris-section";
        section.setAttribute("aria-labelledby", "featured-safaris-heading");
        section.innerHTML = `
            <div class="container">
                <div class="section-heading">
                    <span>FEATURED SAFARIS</span>
                    <h2 id="featured-safaris-heading">Find your next adventure</h2>
                    <p>Explore more journeys selected by our local safari team.</p>
                </div>
                <div class="related-grid featured-safaris-grid" aria-label="Featured safari packages">
                    ${cards}
                </div>
            </div>
        `;

        const callToAction = document.querySelector(".package-cta");
        footer.parentNode.insertBefore(section, callToAction || footer);
    }

    initFeaturedSafaris();

    const bookingUrl = new URL("../book.html", window.location.href);
    bookingUrl.searchParams.set("tour", packageTitle);
    bookingUrl.hash = "booking-form";

    const mobileBookingLink = document.createElement("a");
    mobileBookingLink.className = "package-mobile-booking";
    mobileBookingLink.href = bookingUrl.toString();
    mobileBookingLink.setAttribute("aria-label", `Choose dates and book ${packageTitle}`);

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-calendar-check";
    icon.setAttribute("aria-hidden", "true");

    const text = document.createElement("span");
    text.textContent = "Choose dates & book";

    mobileBookingLink.append(icon, text);
    document.body.append(mobileBookingLink);
    document.body.classList.add("has-package-mobile-booking");

}

// =======================================================
// MOBILE SIDEBAR
// =======================================================

function initSidebar() {

    const sidebar = document.getElementById("sidebar");
    const openSidebar = document.getElementById("openSidebar");
    const closeSidebar = document.getElementById("closeSidebar");
    const overlay = document.getElementById("overlay");

    if (openSidebar && sidebar && overlay) {

        openSidebar.addEventListener("click", () => {

            sidebar.classList.add("active");
            overlay.classList.add("active");

        });

    }

    if (closeSidebar && sidebar && overlay) {

        closeSidebar.addEventListener("click", () => {

            sidebar.classList.remove("active");
            overlay.classList.remove("active");

        });

    }

    if (overlay && sidebar) {

        overlay.addEventListener("click", () => {

            sidebar.classList.remove("active");
            overlay.classList.remove("active");

        });

    }

}



// =======================================================
// NAVBAR & FOOTER LOADER
// =======================================================

function initNavbarFooter() {

    const navbar = document.getElementById("navbar");
    const footer = document.getElementById("footer");


    /*
    IMPORTANT

    Home/About/Contact:

    <body data-base="">

    Package Pages:

    <body data-base="../">

    */

    const BASE_PATH = document.body.dataset.base || "";

    const normalizeHref = (value) =>

        decodeURIComponent(
            (value || "")
                .split("?")[0]
                .split("#")[0]
        );

    const isActivePage = (linkHref) => {

        const currentPath = normalizeHref(window.location.pathname);

        const targetPath = normalizeHref(linkHref);

        const currentLeaf =
            currentPath.substring(currentPath.lastIndexOf("/") + 1);

        const targetLeaf =
            targetPath.substring(targetPath.lastIndexOf("/") + 1);

        if (currentLeaf === targetLeaf) return true;

        if (
            targetLeaf === "index.html" &&
            (currentLeaf === "" || currentLeaf === "index.html")
        ) {
            return true;
        }

        return false;

    };

    const applyNavbarBehavior = () => {

        const menuToggle =
            document.querySelector(".menu-toggle");

        const navLinks =
            document.querySelector(".nav-links");

        const navItems =
            document.querySelectorAll(".nav-links a[data-nav-link]");

                    menuToggle?.addEventListener("click", () => {

            navLinks?.classList.toggle("active");

            const expanded =
                menuToggle.getAttribute("aria-expanded") === "true";

            menuToggle.setAttribute(
                "aria-expanded",
                String(!expanded)
            );

        });

        navItems.forEach(link => {

            const href = link.getAttribute("href");

            if (
                !href ||
                href.startsWith("http") ||
                href.startsWith("#") ||
                href.startsWith("mailto:") ||
                href.startsWith("tel:")
            ) return;

            if (isActivePage(href)) {

                link.classList.add("active");

            }

            link.addEventListener("click", () => {

                navLinks?.classList.remove("active");

                menuToggle?.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    };

    if (navbar) {

       fetch(BASE_PATH + "includes/navbar.html")

            .then(res => {

                if (!res.ok) {

                    throw new Error("Navbar not found");

                }

                return res.text();

            })

            .then(data => {

                navbar.innerHTML = data;

                navbar.querySelectorAll("a[href]").forEach(link => {

                    const href = link.getAttribute("href");

                    if (
                        !href ||
                        href.startsWith("http") ||
                        href.startsWith("#") ||
                        href.startsWith("mailto:") ||
                        href.startsWith("tel:")
                    ) return;

                    link.setAttribute("href", BASE_PATH + href);

                });

                    // Fix relative image paths inside the injected navbar
                    navbar.querySelectorAll("img[src]").forEach(img => {
                        const src = img.getAttribute('src');
                        if (!src) return;
                        if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('mailto:') || src.startsWith('tel:')) return;
                        img.setAttribute('src', BASE_PATH + src);
                    });

                applyNavbarBehavior();

            })

            .catch(err => {

                console.error("Navbar load error:", err);

            });

    }

        if (footer) {
        fetch(BASE_PATH + "includes/footer.html")
            .then(res => {
                if (!res.ok) {
                    throw new Error("Footer not found");
                }
                return res.text();
            })
            .then(data => {
                footer.innerHTML = data;

                footer.querySelectorAll("a[href]").forEach(link => {
                    const href = link.getAttribute("href");

                    if (
                        !href ||
                        href.startsWith("http") ||
                        href.startsWith("#") ||
                        href.startsWith("mailto:") ||
                        href.startsWith("tel:")
                    ) return;

                    link.setAttribute("href", BASE_PATH + href);
                });
            })
            .catch(err => {
                console.error("Footer load error:", err);
            });
    }
} // End initNavbarFooter()

// =======================================================
// ITINERARY
// =======================================================

function initItinerary() {

    const itinerarySection =
        document.querySelector(".itinerary-section");

    const timeline =
        document.querySelector(".timeline");

    if (!itinerarySection || !timeline) return;

    const visibleDays = parseInt(

        itinerarySection.dataset.visibleDays || 3

    );

    const items =
        timeline.querySelectorAll(".timeline-item");

    if (items.length <= visibleDays) return;

    items.forEach((item, index) => {

        if (index >= visibleDays) {

            item.classList.add("hidden-day");

        }

    });

    const hiddenCount =
        items.length - visibleDays;

    timeline.classList.add("collapsed");

    const wrapper =
        document.createElement("div");

    wrapper.className = "itinerary-toggle";

    const button =
        document.createElement("button");

    button.className =
        "toggle-days-btn";

    wrapper.appendChild(button);

    timeline.after(wrapper);

    let expanded = false;

    function updateButton() {

        button.classList.toggle("open", expanded);

        button.innerHTML = `
            ${expanded ? "Show Less" : `View Remaining ${hiddenCount} Day${hiddenCount > 1 ? "s" : ""}`}
            <i class="fa-solid fa-chevron-down"></i>
        `;

    }

    updateButton();

    button.addEventListener("click", () => {

        expanded = !expanded;

        document
            .querySelectorAll(".hidden-day")
            .forEach(day => {

                day.classList.toggle(
                    "show",
                    expanded
                );

            });

        timeline.classList.toggle(
            "collapsed",
            !expanded
        );

        updateButton();

        if (!expanded) {

            wrapper.scrollIntoView({

                behavior: "smooth",

                block: "center"

            });

        }

    });

}






/* ======================================================
   PACKAGES PAGE — SEARCH, FILTERS AND PAGINATION
====================================================== */

function initPackagesPage() {
    const layout = document.querySelector(".safari-layout");
    if (!layout) return;

    const destination = document.getElementById("destinationFilter");
    const budget = document.getElementById("budgetFilter");
    const searchInput = document.getElementById("packageSearch");
    const form = document.getElementById("safariFilterForm");
    const resultsCount = document.getElementById("resultsCount");
    const noResults = document.getElementById("noResults");
    const results = layout.querySelector(".safari-results");

    if (!results) return;

    // Collect every package from the single grid or any existing sections.
    const allCards = [
        ...results.querySelectorAll(".package-card")
    ];

    if (!allCards.length) return;

    const PAGE_SIZE = 12;
    let currentPage = 1;

    // Create pagination inside the results container.
    let pagination = document.getElementById("packagePagination");

    if (!pagination) {
        pagination = document.createElement("nav");
        pagination.id = "packagePagination";
        pagination.setAttribute(
            "aria-label",
            "Safari package pagination"
        );
        results.appendChild(pagination);
    }

    // Destination filtering for the combined package grid.
    function matchesDestination(card) {
        const selected = destination?.value || "all";

        if (selected === "all") return true;

        // Preferred: add data-destination="kenya", "tanzania",
        // "mountain", or multiple space-separated values to each card.
        const destinations = (card.dataset.destination || "")
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean);

        if (destinations.length) {
            return destinations.includes(selected);
        }

        // Fallback for cards that don't yet have data-destination.
        const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
        const location = card.querySelector(".location")?.textContent.toLowerCase() || "";
        const text = `${title} ${location}`;

        const isMountain =
            /mount kenya|mountain trekking|trekking|sirimon|chogoria/.test(text);

        if (selected === "mountain") {
            return isMountain;
        }

        if (selected === "tanzania") {
            return /tanzania|serengeti|ngorongoro|tarangire/.test(text);
        }

        if (selected === "kenya") {
            return !isMountain &&
                /kenya|masai mara|amboseli|samburu|lake nakuru|lake naivasha|shaba/.test(text);
        }

        return true;
    }

    // Filter by price.
    function matchesBudget(card) {
        const selected = budget?.value || "all";
        if (selected === "all") return true;

        const price = Number(card.dataset.price);
        if (!Number.isFinite(price)) return false;

        if (selected === "1000") {
            return price >= 500 && price <= 1000;
        }

        if (selected === "2000") {
            return price > 1000 && price <= 2000;
        }

        if (selected === "2001") {
            return price > 2000;
        }

        return true;
    }

    // Search title, description, location, image alt text and links.
    function matchesSearch(card) {
        const query = (searchInput?.value || "")
            .trim()
            .toLowerCase();

        if (!query) return true;

        const searchableText = [
            card.textContent,
            ...[...card.querySelectorAll("img")].map(img => img.alt || ""),
            ...[...card.querySelectorAll("a")].map(link => link.href || "")
        ].join(" ").toLowerCase();

        return searchableText.includes(query);
    }

    function getFilteredCards() {
        return allCards.filter(card =>
            matchesDestination(card) &&
            matchesBudget(card) &&
            matchesSearch(card)
        );
    }

    function renderPagination(totalPages) {
        pagination.replaceChildren();
        pagination.hidden = totalPages <= 1;

        if (totalPages <= 1) return;

        function addButton(label, page, disabled = false, active = false) {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = label;
            button.disabled = disabled;

            if (active) {
                button.classList.add("active");
                button.setAttribute("aria-current", "page");
            }

            button.addEventListener("click", () => {
                currentPage = page;
                updatePackages();

                results.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });

            pagination.appendChild(button);
        }

        addButton("← Previous", currentPage - 1, currentPage === 1);

        for (let page = 1; page <= totalPages; page++) {
            addButton(
                String(page),
                page,
                false,
                page === currentPage
            );
        }

        addButton(
            "Next →",
            currentPage + 1,
            currentPage === totalPages
        );

        const info = document.createElement("div");
        info.className = "package-page-info";
        info.textContent = `Page ${currentPage} of ${totalPages}`;
        pagination.appendChild(info);
    }

    function updatePackages() {
        const filteredCards = getFilteredCards();
        const totalPages = Math.ceil(filteredCards.length / PAGE_SIZE);

        currentPage = Math.max(
            1,
            Math.min(currentPage, Math.max(totalPages, 1))
        );

        const start = (currentPage - 1) * PAGE_SIZE;
        const end = Math.min(start + PAGE_SIZE, filteredCards.length);
        const visibleCards = new Set(filteredCards.slice(start, end));

        allCards.forEach(card => {
            card.hidden = !visibleCards.has(card);
        });

        // Only hide sections that are actually empty.
        results.querySelectorAll(".package-section").forEach(section => {
            const hasVisibleCard = [
                ...section.querySelectorAll(".package-card")
            ].some(card => visibleCards.has(card));

            section.hidden = !hasVisibleCard;
        });

        if (resultsCount) {
            resultsCount.textContent = filteredCards.length
                ? `Showing ${start + 1}–${end} of ${filteredCards.length} packages`
                : "No packages found";
        }

        if (noResults) {
            noResults.hidden = filteredCards.length > 0;
        }

        renderPagination(totalPages);
    }

    searchInput?.addEventListener("input", () => {
        currentPage = 1;
        updatePackages();
    });

    destination?.addEventListener("change", () => {
        currentPage = 1;
        updatePackages();
    });

    budget?.addEventListener("change", () => {
        currentPage = 1;
        updatePackages();
    });

    form?.addEventListener("submit", event => {
        event.preventDefault();
        currentPage = 1;
        updatePackages();
    });

    form?.addEventListener("reset", () => {
        currentPage = 1;
        window.setTimeout(updatePackages, 0);
    });

    updatePackages();
}
