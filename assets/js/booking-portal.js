(() => {
    const loginSection = document.getElementById("portalLogin");
    const dashboard = document.getElementById("portalDashboard");
    if (!loginSection || !dashboard) return;

    const loginForm = document.getElementById("portalLoginForm");
    const loginStatus = document.getElementById("portalLoginStatus");
    const dashboardStatus = document.getElementById("portalDashboardStatus");
    const requestList = document.getElementById("portalRequests");
    const tokenKey = "eaglePamStaffAccessToken";
    let config;
    let accessToken = sessionStorage.getItem(tokenKey) || "";

    function setStatus(element, message, isSuccess = false) {
        element.textContent = message;
        element.classList.toggle("is-success", isSuccess);
    }

    async function readResponse(response) {
        const text = await response.text();
        let result;
        try {
            result = text ? JSON.parse(text) : {};
        } catch {
            throw new Error("The server returned an unreadable response. Please try again.");
        }
        if (!response.ok) throw new Error(result.error || "Something went wrong. Please try again.");
        return result;
    }

    async function portalRequest(path, options = {}) {
        const response = await fetch(path, {
            ...options,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                ...(options.headers || {})
            }
        });
        return readResponse(response);
    }

    function createTextElement(tag, className, value) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        element.textContent = value || "";
        return element;
    }

    function addMeta(meta, label, value) {
        const item = document.createElement("span");
        item.textContent = `${label}: ${value || "Not provided"}`;
        meta.append(item);
    }

    function formatMoney(currency, amount) {
        return `${currency} ${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    function createRequestCard(request) {
        const card = document.createElement("article");
        card.className = "portal-request";
        const title = createTextElement("h3", "", request.safari);
        const status = createTextElement(
            "span",
            "portal-request-status",
            request.status.replaceAll("_", " ")
        );
        const meta = document.createElement("div");
        meta.className = "portal-request-meta";

        addMeta(meta, "Reference", `EP-${request.id.slice(0, 8).toUpperCase()}`);
        addMeta(meta, "Received", new Intl.DateTimeFormat("en", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(new Date(request.created_at)));
        addMeta(meta, "Traveller", request.traveller_name);
        addMeta(meta, "Email", request.email);
        addMeta(meta, "Phone", request.phone);
        addMeta(meta, "Date", request.departure_date || "Flexible");
        addMeta(meta, "Travellers", String(request.traveller_count));
        addMeta(meta, "Option", request.package_option);
        addMeta(meta, "Guide", request.guide_language);
        addMeta(meta, "Requested estimate", request.estimated_total === null
            ? "Not provided"
            : formatMoney(request.requested_currency, request.estimated_total));

        card.append(title, status, meta);
        if (request.country) card.append(createTextElement("p", "", `Location: ${request.country}`));
        if (request.notes) card.append(createTextElement("blockquote", "", request.notes));

        if (request.status === "deposit_paid") {
            card.append(createTextElement(
                "p",
                "portal-request-paid",
                `Deposit received: ${formatMoney(request.payment_currency, request.deposit_amount)}`
            ));
            card.append(createTextElement(
                "p",
                "portal-request-audit",
                `Marked paid by ${request.paid_recorded_by || "staff"}${request.paid_at ? ` on ${new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(request.paid_at))}` : ""}.`
            ));
        } else if (request.status === "awaiting_payment") {
            card.append(createTextElement(
                "p",
                "",
                `Confirmed total: ${formatMoney(request.payment_currency, request.final_total)} · 30% deposit: ${formatMoney(request.payment_currency, request.deposit_amount)}`
            ));
            card.append(createTextElement("blockquote", "", request.payment_instructions));
            card.append(createTextElement(
                "p",
                "portal-request-audit",
                `Quote confirmed by ${request.confirmed_by || "staff"}${request.confirmed_at ? ` on ${new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(request.confirmed_at))}` : ""}.`
            ));

            const markPaidButton = document.createElement("button");
            markPaidButton.className = "portal-button";
            markPaidButton.type = "button";
            markPaidButton.textContent = "Mark 30% deposit received";
            markPaidButton.addEventListener("click", () => {
                const confirmed = window.confirm(
                    `Have you received and verified the ${formatMoney(request.payment_currency, request.deposit_amount)} bank transfer from ${request.traveller_name}?`
                );
                if (confirmed) void updateRequest({
                    id: request.id,
                    action: "mark_paid"
                }, markPaidButton);
            });
            card.append(markPaidButton);
        } else if (request.status === "pending") {
            const form = document.createElement("form");
            form.className = "portal-quote-form";

            const amountField = document.createElement("div");
            amountField.className = "portal-quote-field";
            const amountLabel = document.createElement("label");
            amountLabel.textContent = "Confirmed final trip total";
            const amountInput = document.createElement("input");
            amountInput.id = `quote-${request.id}`;
            amountInput.name = "finalTotal";
            amountInput.type = "number";
            amountInput.min = "1";
            amountInput.step = "0.01";
            amountInput.required = true;
            amountInput.inputMode = "decimal";
            amountInput.value = request.estimated_total === null ? "" : request.estimated_total;
            amountLabel.htmlFor = amountInput.id;
            amountField.append(amountLabel, amountInput);

            const currencyField = document.createElement("div");
            currencyField.className = "portal-quote-field";
            const currencyLabel = document.createElement("label");
            currencyLabel.htmlFor = `currency-${request.id}`;
            currencyLabel.textContent = "Quote currency";
            const currencySelect = document.createElement("select");
            currencySelect.className = "portal-currency-select";
            currencySelect.id = currencyLabel.htmlFor;
            currencySelect.name = "currency";
            ["USD", "KES", "EUR", "GBP"].forEach((currency) => {
                const option = document.createElement("option");
                option.value = currency;
                option.textContent = currency;
                option.selected = currency === request.requested_currency;
                currencySelect.append(option);
            });
            currencyField.append(currencyLabel, currencySelect);

            const bankField = document.createElement("div");
            bankField.className = "portal-quote-field portal-quote-field-full";
            const bankLabel = document.createElement("label");
            bankLabel.htmlFor = `bank-${request.id}`;
            bankLabel.textContent = "Bank transfer instructions";
            const bankInput = document.createElement("textarea");
            bankInput.id = bankLabel.htmlFor;
            bankInput.name = "bankDetails";
            bankInput.rows = 5;
            bankInput.maxLength = 2000;
            bankInput.required = true;
            bankInput.placeholder = "Bank name, account name, account number, branch/SWIFT details, and transfer reference.";
            bankField.append(bankLabel, bankInput);

            const button = document.createElement("button");
            button.className = "portal-button portal-quote-submit";
            button.type = "submit";
            button.textContent = "Confirm quote & send bank details";
            const help = createTextElement(
                "p",
                "portal-quote-help",
                `Review availability and the final amount. The portal calculates the 30% deposit in the selected currency and emails your instructions to the client.`
            );
            form.append(amountField, currencyField, bankField, button, help);
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                if (!form.reportValidity()) return;
                void updateRequest({
                    id: request.id,
                    action: "confirm_quote",
                    finalTotal: amountInput.value,
                    currency: currencySelect.value,
                    bankDetails: bankInput.value
                }, button);
            });
            card.append(form);
        }

        return card;
    }

    async function loadRequests() {
        setStatus(dashboardStatus, "Loading booking requests…");
        const result = await portalRequest("/api/admin/booking-requests");
        if (result.staffEmail) {
            sessionStorage.setItem("eaglePamStaffEmail", result.staffEmail);
            document.getElementById("portalSignedInEmail").textContent = `Signed in as ${result.staffEmail}`;
        }
        requestList.replaceChildren();
        if (!result.requests.length) {
            requestList.append(createTextElement(
                "p",
                "portal-empty",
                "No safari requests yet. New requests will appear here."
            ));
        } else {
            result.requests.forEach((request) => requestList.append(createRequestCard(request)));
        }
        setStatus(
            dashboardStatus,
            `${result.requests.length} recent request${result.requests.length === 1 ? "" : "s"} loaded.`,
            true
        );
    }

    async function updateRequest(payload, button) {
        button.disabled = true;
        setStatus(dashboardStatus, "Updating booking request…");
        try {
            const result = await portalRequest("/api/admin/booking-requests", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            await loadRequests();
            setStatus(dashboardStatus, result.message, result.emailSent);
        } catch (error) {
            setStatus(dashboardStatus, error.message);
            button.disabled = false;
        }
    }

    async function showDashboard() {
        loginSection.hidden = true;
        dashboard.hidden = false;
        const signedInEmail = sessionStorage.getItem("eaglePamStaffEmail");
        document.getElementById("portalSignedInEmail").textContent =
            signedInEmail ? `Signed in as ${signedInEmail}` : "Signed in";
        document.getElementById("portalPaymentConfig").textContent =
            "Payment method: bank transfer. Confirm availability and quote first, then provide the client with the correct bank instructions. Mark the deposit received only after checking the transfer.";
        try {
            await loadRequests();
        } catch (error) {
            setStatus(dashboardStatus, error.message);
            if (/session has expired|sign in/i.test(error.message)) signOut(false);
        }
    }

    function signOut(updateStatus = true) {
        const currentToken = accessToken;
        accessToken = "";
        sessionStorage.removeItem(tokenKey);
        sessionStorage.removeItem("eaglePamStaffEmail");
        dashboard.hidden = true;
        loginSection.hidden = false;
        requestList.replaceChildren();
        if (updateStatus) setStatus(loginStatus, "You have signed out.", true);
        if (currentToken && config?.supabaseUrl && config?.supabaseAnonKey) {
            void fetch(`${config.supabaseUrl}/auth/v1/logout`, {
                method: "POST",
                headers: {
                    apikey: config.supabaseAnonKey,
                    Authorization: `Bearer ${currentToken}`
                }
            });
        }
    }

    async function init() {
        try {
            const response = await fetch("/api/public-config");
            config = await readResponse(response);
            if (!config.staffPortalEnabled || !config.supabaseUrl || !config.supabaseAnonKey) {
                loginForm.querySelector("button").disabled = true;
                setStatus(loginStatus, "Staff sign-in is not configured yet. Ask the site administrator to finish Supabase setup.");
            }

            const hash = new URLSearchParams(location.hash.slice(1));
            const linkToken = hash.get("access_token");
            if (linkToken) {
                accessToken = linkToken;
                sessionStorage.setItem(tokenKey, accessToken);
                history.replaceState(null, "", `${location.pathname}${location.search}`);
            }
            if (accessToken && config.staffPortalEnabled) await showDashboard();
        } catch (error) {
            setStatus(loginStatus, error.message || "Staff portal configuration could not be loaded.");
        }
    }

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!loginForm.reportValidity() || !config?.staffPortalEnabled) return;

        const email = loginForm.elements.namedItem("email").value.trim().toLowerCase();
        const button = loginForm.querySelector("button");
        button.disabled = true;
        setStatus(loginStatus, "Sending your secure sign-in link…");
        try {
            const response = await fetch(`${config.supabaseUrl}/auth/v1/otp?redirect_to=${encodeURIComponent(`${location.origin}/admin.html`)}`, {
                method: "POST",
                headers: {
                    apikey: config.supabaseAnonKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, create_user: false })
            });
            const result = await readResponse(response);
            setStatus(loginStatus, result.msg || "If this email is authorized, a sign-in link will arrive shortly.", true);
        } catch (error) {
            setStatus(loginStatus, error.message);
        } finally {
            button.disabled = false;
        }
    });

    document.getElementById("portalRefresh").addEventListener("click", () => {
        void loadRequests().catch((error) => setStatus(dashboardStatus, error.message));
    });
    document.getElementById("portalSignOut").addEventListener("click", () => signOut());
    void init();
})();
