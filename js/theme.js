/* =========================================================
   MY SWEET PORTFOLIO
   THEME.JS
   Candy / Vintage Bakery
========================================================= */

(() => {

    "use strict";


    /* =====================================================
       SETTINGS
    ===================================================== */

    const STORAGE_KEY = "sweet-gam-theme";

    const THEMES = {
        candy: "theme-candy",
        bakery: "theme-bakery"
    };


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const themeToggle =
        document.getElementById("themeToggle");

    const body =
        document.body;

    const musicIcon =
        document.getElementById("musicIcon");


    /* =====================================================
       CURRENT THEME
    ===================================================== */

    let currentTheme = "candy";


    /* =====================================================
       GET SAVED THEME
    ===================================================== */

    function getSavedTheme() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (
                saved === "candy" ||
                saved === "bakery"
            ) {

                return saved;

            }

        } catch (error) {

            console.warn(
                "Theme storage unavailable.",
                error
            );

        }

        return "candy";
    }


    /* =====================================================
       APPLY THEME
    ===================================================== */

    function applyTheme(
        theme,
        animate = false
    ) {

        if (
            theme !== "candy" &&
            theme !== "bakery"
        ) {

            theme = "candy";

        }


        if (animate) {

            body.classList.add(
                "theme-changing"
            );

        }


        body.classList.remove(
            THEMES.candy,
            THEMES.bakery
        );


        body.classList.add(
            THEMES[theme]
        );


        currentTheme =
            theme;


        updateThemeButton();


        saveTheme(theme);


        updateThemeDecorations();


        if (animate) {

            window.setTimeout(() => {

                body.classList.remove(
                    "theme-changing"
                );

            }, 1300);

        }

    }


    /* =====================================================
       SAVE THEME
    ===================================================== */

    function saveTheme(theme) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                theme
            );

        } catch (error) {

            console.warn(
                "Could not save theme.",
                error
            );

        }

    }


    /* =====================================================
       TOGGLE THEME
    ===================================================== */

    function toggleTheme() {

        const nextTheme =
            currentTheme === "candy"
                ? "bakery"
                : "candy";


        applyTheme(
            nextTheme,
            true
        );


        showThemeToast(
            nextTheme
        );

    }


    /* =====================================================
       THEME BUTTON
    ===================================================== */

    function updateThemeButton() {

        if (!themeToggle) {
            return;
        }


        const isBakery =
            currentTheme === "bakery";


        themeToggle.setAttribute(
            "aria-pressed",
            String(isBakery)
        );


        themeToggle.setAttribute(
            "title",
            isBakery
                ? "เปลี่ยนเป็น Candy / Sweet Fantasy"
                : "เปลี่ยนเป็น Vintage Bakery"
        );


        themeToggle.setAttribute(
            "aria-label",
            isBakery
                ? "เปลี่ยนเป็นธีม Candy"
                : "เปลี่ยนเป็นธีม Bakery"
        );


        /*
         * รองรับหลายโครงสร้างของปุ่ม
         * โดยไม่ทำลาย HTML เดิม
         */

        const icon =
            themeToggle.querySelector(
                ".theme-icon"
            );

        const label =
            themeToggle.querySelector(
                ".theme-label"
            );


        if (icon) {

            icon.textContent =
                isBakery
                    ? "🍞"
                    : "🍭";

        }


        if (label) {

            label.textContent =
                isBakery
                    ? "Bakery"
                    : "Candy";

        }

    }


    /* =====================================================
       THEME TOAST
    ===================================================== */

    function showThemeToast(theme) {

        const toast =
            document.getElementById("toast");

        const toastIcon =
            document.getElementById("toastIcon");

        const toastMessage =
            document.getElementById("toastMessage");


        if (
            !toast ||
            !toastMessage
        ) {

            return;

        }


        if (theme === "bakery") {

            if (toastIcon) {
                toastIcon.textContent = "🍞";
            }

            toastMessage.textContent =
                "เข้าสู่โลก Vintage Bakery แล้ว 🍞🍫✨";

        } else {

            if (toastIcon) {
                toastIcon.textContent = "🍭";
            }

            toastMessage.textContent =
                "กลับเข้าสู่โลก Candy Sweet Fantasy แล้ว 🍭🍓✨";

        }


        toast.classList.add(
            "show"
        );


        window.clearTimeout(
            showThemeToast.timeout
        );


        showThemeToast.timeout =
            window.setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 2600);

    }


    /* =====================================================
       UPDATE DECORATIONS
    ===================================================== */

    function updateThemeDecorations() {

        const bakery =
            currentTheme === "bakery";


        /*
         * บอกระบบอื่นว่า Theme ปัจจุบันคืออะไร
         */

        window.dispatchEvent(
            new CustomEvent(
                "sweetThemeChange",
                {
                    detail: {
                        theme:
                            currentTheme,
                        isBakery:
                            bakery,
                        isCandy:
                            !bakery
                    }
                }
            )
        );


        /*
         * เปลี่ยน data-theme
         * เผื่อ CSS / JS ตัวอื่นนำไปใช้
         */

        body.dataset.theme =
            currentTheme;


        /*
         * เปลี่ยนธีมของ cursor
         */

        const cursor =
            document.getElementById(
                "customCursor"
            );

        if (cursor) {

            cursor.dataset.theme =
                currentTheme;

        }


        /*
         * เปลี่ยนธีมของ mouse trail
         */

        const trail =
            document.getElementById(
                "mouseTrail"
            );

        if (trail) {

            trail.dataset.theme =
                currentTheme;

        }


        /*
         * เปลี่ยนธีมของ click burst
         */

        const burst =
            document.getElementById(
                "clickBurstLayer"
            );

        if (burst) {

            burst.dataset.theme =
                currentTheme;

        }

    }


    /* =====================================================
       THEME-SPECIFIC EFFECT EVENT
    ===================================================== */

    window.addEventListener(
        "sweetThemeChange",
        event => {

            const theme =
                event.detail?.theme;


            /*
             * ให้ JS ตัวอื่นรับรู้ได้
             */

            document.dispatchEvent(
                new CustomEvent(
                    "portfolioThemeChanged",
                    {
                        detail: {
                            theme
                        }
                    }
                )
            );

        }
    );


    /* =====================================================
       NIGHT MODE
       - ไม่บังคับเวลา
       - ให้ main.js / ระบบอื่นเรียกได้
===================================================== */

    function setNightMode(enabled) {

        body.classList.toggle(
            "theme-night",
            Boolean(enabled)
        );

        body.dataset.night =
            enabled
                ? "true"
                : "false";

    }


    function isNightMode() {

        return body.classList.contains(
            "theme-night"
        );

    }


    /* =====================================================
       AUTO NIGHT MODE
       Candy Night / Bakery Night
===================================================== */

    function updateAutomaticNightMode() {

        const hour =
            new Date().getHours();


        /*
         * กลางคืน 19:00 - 05:59
         */

        const night =
            hour >= 19 ||
            hour < 6;


        setNightMode(
            night
        );

    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.SweetTheme = {

        get current() {
            return currentTheme;
        },

        set(theme, animate = true) {

            applyTheme(
                theme,
                animate
            );

        },

        toggle() {

            toggleTheme();

        },

        candy() {

            applyTheme(
                "candy",
                true
            );

        },

        bakery() {

            applyTheme(
                "bakery",
                true
            );

        },

        night(enabled = true) {

            setNightMode(
                enabled
            );

        },

        isNight() {

            return isNightMode();

        }

    };


    /* =====================================================
       BUTTON EVENT
    ===================================================== */

    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            event => {

                event.preventDefault();

                toggleTheme();

            }
        );

    }


    /* =====================================================
       KEYBOARD ACCESS
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            /*
             * Alt + T
             * เปลี่ยนธีม
             */

            if (
                event.altKey &&
                event.key.toLowerCase() === "t"
            ) {

                event.preventDefault();

                toggleTheme();

            }

        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initializeTheme() {

        const savedTheme =
            getSavedTheme();


        applyTheme(
            savedTheme,
            false
        );


        updateAutomaticNightMode();

    }


    /* =====================================================
       START
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeTheme,
            {
                once: true
            }
        );

    } else {

        initializeTheme();

    }


    /* =====================================================
       UPDATE NIGHT MODE
       ทุก 10 นาที
    ===================================================== */

    window.setInterval(
        updateAutomaticNightMode,
        10 * 60 * 1000
    );


})();
