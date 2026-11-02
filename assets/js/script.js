// =======================================================
// EAGLE PAM EXPEDITIONs
// =======================================================

document.addEventListener("DOMContentLoaded", () => {

    initAnimations();
    initBackToTop();
    initSafariForm();
    initContactEnquiryForm();
    initTourSelection();
    initSidebar();
    initNavbarFooter();
    initItinerary();
    initPackagesPage();
    initPackageBookingCta();
    initPackageGallery();
    initHomeDestinationCarousel();
    initHomeCardNavigation();
    initHomeTripFinder();

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

    safariForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!safariForm.reportValidity()) return;

        const submitButton = safariForm.querySelector('button[type="submit"]');
        const status = document.getElementById("bookingFormStatus");
        const originalButtonText = submitButton?.textContent.trim() || "Send enquiry to our team";
        const payload = Object.fromEntries(new FormData(safariForm).entries());
        const travellerName = String(payload.name || "").trim();

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending your enquiry…";
        }
        if (status) status.textContent = "";

        try {
            const response = await fetch("/api/send-enquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Your enquiry could not be sent.");
            }

            safariForm.reset();
            if (status) {
                status.classList.add("is-success");
                status.textContent = `Thank you${travellerName ? `, ${travellerName}` : ""}. Your enquiry has been sent to our safari team. This is not a confirmed booking; our team will contact you to discuss your plans.`;
            }
        } catch (error) {
            console.error("Booking enquiry submission failed.", error);
            if (status) {
                status.classList.remove("is-success");
                status.textContent = error instanceof Error
                    ? error.message
                    : "We could not send your enquiry. Please try again or contact us by WhatsApp.";
            }
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
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

function initContactEnquiryForm() {
    const form = document.getElementById("contactEnquiryForm");

    if (!form) return;

    const submitButton = form.querySelector('button[type="submit"]');
    const status = document.getElementById("contactFormStatus");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const originalButtonText = submitButton?.textContent.trim() || "Send Message";
        const payload = Object.fromEntries(new FormData(form).entries());

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending…";
        }
        if (status) {
            status.classList.remove("is-success");
            status.textContent = "";
        }

        try {
            const response = await fetch("/api/enquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "We couldn't send your message. Please try again.");
            }

            form.reset();
            if (status) {
                status.classList.add("is-success");
                status.textContent = "Thank you, we'll reply shortly.";
            }
        } catch (error) {
            console.error("Contact enquiry submission failed.", error);
            if (status) {
                status.textContent = error instanceof Error
                    ? error.message
                    : "We couldn't send your message. Please try again.";
            }
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
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

function initPackageGallery() {
    const galleries = document.querySelectorAll(".gallery-section .gallery-grid");

    galleries.forEach((gallery, index) => {
        const section = gallery.closest(".gallery-section");
        if (!section) return;

        const controls = document.createElement("div");
        controls.className = "package-gallery-controls";
        controls.setAttribute("aria-label", "Photo gallery controls");
        controls.innerHTML = `
            <span>Swipe to explore</span>
            <button class="package-gallery-control" type="button" data-scroll-direction="-1" aria-label="Show previous gallery photos">
                <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
            </button>
            <button class="package-gallery-control" type="button" data-scroll-direction="1" aria-label="Show more gallery photos">
                <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </button>
        `;

        gallery.id = gallery.id || `package-photo-gallery-${index + 1}`;
        gallery.setAttribute("aria-label", "Safari photo gallery");
        gallery.tabIndex = 0;
        gallery.parentNode.insertBefore(controls, gallery);

        const buttons = [...controls.querySelectorAll(".package-gallery-control")];
        const updateControls = () => {
            const maxScroll = gallery.scrollWidth - gallery.clientWidth;
            buttons.forEach((button) => {
                const direction = Number(button.dataset.scrollDirection);
                button.disabled = direction < 0
                    ? gallery.scrollLeft <= 1
                    : gallery.scrollLeft >= maxScroll - 1;
            });
        };

        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                const image = gallery.querySelector("img");
                if (!image) return;
                const gap = Number.parseFloat(getComputedStyle(gallery).columnGap) || 0;
                const direction = Number(button.dataset.scrollDirection);
                gallery.scrollBy({
                    left: direction * (image.getBoundingClientRect().width + gap),
                    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                        ? "auto"
                        : "smooth"
                });
            });
        });

        gallery.addEventListener("scroll", updateControls, { passive: true });
        window.addEventListener("resize", updateControls);
        requestAnimationFrame(updateControls);
    });
}

function initHomeDestinationCarousel() {
    const section = document.querySelector(".destinations");
    const track = section?.querySelector(".destination-grid");
    const controls = [...(section?.querySelectorAll(".destination-carousel-control") || [])];

    if (!track || !controls.length) return;

    const updateControls = () => {
        const maxScroll = track.scrollWidth - track.clientWidth;
        controls.forEach((button) => {
            const direction = Number(button.dataset.scrollDirection);
            button.disabled = direction < 0
                ? track.scrollLeft <= 2
                : track.scrollLeft >= maxScroll - 2;
        });
    };

    controls.forEach((button) => {
        button.addEventListener("click", () => {
            const card = track.querySelector(".destination-card");
            if (!card) return;
            const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
            const direction = Number(button.dataset.scrollDirection);
            track.scrollBy({
                left: direction * (card.getBoundingClientRect().width + gap),
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "auto"
                    : "smooth"
            });
        });
    });

    track.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);
    requestAnimationFrame(updateControls);
}

function initHomeCardNavigation() {
    const cards = document.querySelectorAll(
        ".tours .tour-card, .destinations > .destination-grid .destination-card"
    );

    cards.forEach((card) => {
        const destinationLink = card.querySelector(".tour-btn, .destination-btn");
        if (!destinationLink) return;

        card.addEventListener("click", (event) => {
            if (event.target.closest("a, button, input, select, textarea")) return;

            if (event.metaKey || event.ctrlKey || event.shiftKey) {
                window.open(destinationLink.href, "_blank", "noopener");
                return;
            }

            window.location.assign(destinationLink.href);
        });
    });
}

function initHomeTripFinder() {
    const form = document.getElementById("tripFinderForm");
    const results = document.getElementById("tripFinderResults");
    const tourCards = [...document.querySelectorAll(".tours .tour-card[data-trip-days]")];

    if (!form || !results || !tourCards.length) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const preferences = new FormData(form);
        const region = preferences.get("region");
        const duration = preferences.get("duration");
        const budget = preferences.get("budget");
        const style = preferences.get("style");

        const matches = tourCards.filter((card) => {
            const days = Number(card.dataset.tripDays);
            const price = Number(card.dataset.tripPrice);

            const matchesDuration = duration === "any" ||
                (duration === "short" && days <= 3) ||
                (duration === "week" && days >= 4 && days <= 7) ||
                (duration === "extended" && days >= 8);
            const matchesBudget = budget === "any" ||
                (budget === "up-to-1000" && price <= 1000) ||
                (budget === "1001-2000" && price > 1000 && price <= 2000) ||
                (budget === "over-2000" && price > 2000);

            const tripRegion = card.dataset.tripRegions;
            const matchesRegion = region === "any" ||
                tripRegion === region ||
                (tripRegion === "cross-border" && ["kenya", "tanzania"].includes(region));

            return matchesRegion &&
                matchesDuration &&
                matchesBudget &&
                (style === "any" || card.dataset.tripStyle === style);
        }).slice(0, 3);

        const heading = document.createElement("h3");
        heading.className = "trip-finder-results-title";

        if (!matches.length) {
            heading.textContent = "No exact match yet — let’s shape one together.";
            const message = document.createElement("p");
            message.textContent = "Tell our safari team where you’d like to go and what you have in mind.";
            const link = document.createElement("a");
            link.href = "../book.html";
            link.className = "trip-finder-custom-link";
            link.textContent = "Plan a custom safari";
            results.replaceChildren(heading, message, link);
            return;
        }

        heading.textContent = matches.length === 1
            ? "A safari to start with"
            : "Your safari matches";

        const list = document.createElement("div");
        list.className = "trip-finder-match-list";

        matches.forEach((card) => {
            const itineraryLink = card.querySelector(".tour-btn");
            const title = card.querySelector("h3")?.textContent.trim();
            if (!itineraryLink || !title) return;

            const matchLink = document.createElement("a");
            matchLink.className = "trip-finder-match";
            matchLink.href = itineraryLink.href;

            const matchTitle = document.createElement("strong");
            matchTitle.textContent = title;

            const details = document.createElement("span");
            details.textContent = `${card.dataset.tripDays} days · From ${card.querySelector(".tour-footer h4")?.textContent.trim() || "See itinerary"} per person`;

            const arrow = document.createElement("i");
            arrow.className = "fa-solid fa-arrow-right";
            arrow.setAttribute("aria-hidden", "true");

            matchLink.append(matchTitle, details, arrow);
            list.appendChild(matchLink);
        });

        results.replaceChildren(heading, list);
    });
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
                category: "tanzania",
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
                category: "tanzania",
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
                category: "tanzania",
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
                category: "tanzania",
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
                category: "mountain",
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
                category: "mountain",
                format: "Summit adventure",
                image: "Mt2.jpg",
                href: "5-day-trek-sirimon-chogoria.html",
                description: "Climb to Point Lenana on a guided trek up the scenic Sirimon and Chogoria routes."
            }
        ];

        const currentPage = window.location.pathname.split("/").pop();
        const currentPackage = packages.find((item) => item.href === currentPage);
        const currentCategory = currentPackage?.category || "kenya";
        const recommendations = packages.filter((item) => item.href !== currentPage);
        const preferred = recommendations.filter((item) =>
            currentCategory === "mountain"
                ? item.category === "mountain"
                : currentCategory === "tanzania"
                    ? item.category === "tanzania"
                    : !item.category
        );
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
                <div class="featured-safaris-controls" aria-label="Featured safari carousel controls">
                    <span>Swipe to explore</span>
                    <button class="featured-safaris-control" type="button" data-scroll-direction="-1" aria-label="Show previous safari packages">
                        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
                    </button>
                    <button class="featured-safaris-control" type="button" data-scroll-direction="1" aria-label="Show more safari packages">
                        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="related-grid featured-safaris-grid" aria-label="Featured safari packages">
                    ${cards}
                </div>
            </div>
        `;

        const track = section.querySelector(".featured-safaris-grid");
        const controls = [...section.querySelectorAll(".featured-safaris-control")];
        const updateControls = () => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            controls.forEach((button) => {
                const direction = Number(button.dataset.scrollDirection);
                button.disabled = direction < 0
                    ? track.scrollLeft <= 1
                    : track.scrollLeft >= maxScroll - 1;
            });
        };

        controls.forEach((button) => {
            button.addEventListener("click", () => {
                const card = track.querySelector(".featured-package-card");
                if (!card) return;
                const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
                const direction = Number(button.dataset.scrollDirection);
                track.scrollBy({
                    left: direction * (card.getBoundingClientRect().width + gap),
                    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                        ? "auto"
                        : "smooth"
                });
            });
        });

        track.addEventListener("scroll", updateControls, { passive: true });
        window.addEventListener("resize", updateControls);
        requestAnimationFrame(updateControls);

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
        const currentLeaf = currentPath.substring(currentPath.lastIndexOf("/") + 1);
        const targetLeaf = targetPath.substring(targetPath.lastIndexOf("/") + 1);

        if (
            currentPath.includes("/Destination Pages HTML/") &&
            targetLeaf === "destinations.html"
        ) {
            return true;
        }

        if (
            currentPath.includes("/Packages-HTML/") &&
            targetLeaf === "packages.html"
        ) {
            return true;
        }

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

        const closeMenu = (restoreFocus = false) => {
            navLinks?.classList.remove("active");
            menuToggle?.setAttribute("aria-expanded", "false");
            menuToggle?.setAttribute("aria-label", "Open navigation menu");

            if (restoreFocus) menuToggle?.focus();
        };

        menuToggle?.addEventListener("click", () => {
            const expanded = menuToggle.getAttribute("aria-expanded") === "true";
            navLinks?.classList.toggle("active", !expanded);
            menuToggle.setAttribute("aria-expanded", String(!expanded));
            menuToggle.setAttribute(
                "aria-label",
                expanded ? "Open navigation menu" : "Close navigation menu"
            );
        });

        document.addEventListener("click", (event) => {
            if (
                navLinks?.classList.contains("active") &&
                !event.target.closest(".navbar")
            ) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && navLinks?.classList.contains("active")) {
                closeMenu(true);
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) closeMenu();
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
                link.setAttribute("aria-current", "page");
            }

            link.addEventListener("click", () => {
                closeMenu();
            });

        });

        const bookingLink = document.querySelector(".btn-book");
        if (bookingLink && isActivePage(bookingLink.getAttribute("href"))) {
            bookingLink.setAttribute("aria-current", "page");
        }

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
