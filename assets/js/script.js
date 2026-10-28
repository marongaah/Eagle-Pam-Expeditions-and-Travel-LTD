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

    safariForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const name = document.getElementById("name")?.value || "";
        const email = document.getElementById("email")?.value || "";
        const destination = document.getElementById("destination")?.value || "";
        const date = document.getElementById("date")?.value || "";
        const travelers = document.getElementById("travelers")?.value || "";
        const budget = document.getElementById("budget")?.value || "";
        const message = document.getElementById("message")?.value || "";

        const whatsappMessage =
            `Hello Eagle Pam Expeditions,%0A%0A` +
            `My Name: ${name}%0A` +
            `Email: ${email}%0A` +
            `Destination: ${destination}%0A` +
            `Travel Date: ${date}%0A` +
            `Travelers: ${travelers}%0A` +
            `Budget: ${budget}%0A` +
            `Message: ${message}`;

        window.open(
            `https://wa.me/254111932279?text=${whatsappMessage}`,
            "_blank"
        );

    });

}

// =======================================================
// TOUR PRE-SELECTION
// =======================================================

function initTourSelection() {

    const params = new URLSearchParams(window.location.search);

    const tour = params.get("tour");

    const select = document.querySelector("select");

    if (tour && select) {

        select.value = tour;

    }

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
