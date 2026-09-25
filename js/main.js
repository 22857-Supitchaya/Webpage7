/* =========================================================
   SWEET GAM PORTFOLIO
   main.js
   Main Application Controller
========================================================= */

(() => {
    "use strict";

    /* =====================================================
       DOM
    ===================================================== */

    const loadingScreen =
        document.getElementById("loadingScreen");

    const loaderProgress =
        document.getElementById("loaderProgress");

    const loaderPercent =
        document.getElementById("loaderPercent");

    const loaderStatus =
        document.getElementById("loaderStatus");

    const curtain =
        document.getElementById("curtainTransition");

    const app =
        document.getElementById("app");

    const mainHeader =
        document.getElementById("mainHeader");

    const navigation =
        document.getElementById("mainNavigation");

    const mobileMenuButton =
        document.getElementById("mobileMenuButton");

    const themeToggle =
        document.getElementById("themeToggle");

    const musicToggle =
        document.getElementById("musicToggle");

    const musicIcon =
        document.getElementById("musicIcon");

    const backgroundMusic =
        document.getElementById("backgroundMusic");

    const pageProgress =
        document.getElementById("pageProgress");

    const liveRegion =
        document.getElementById("liveRegion");

    const stickySauce =
        document.getElementById("stickySauce");

    const pages =
        Array.from(
            document.querySelectorAll(".page")
        );

    const navLinks =
        Array.from(
            document.querySelectorAll(".nav-link")
        );

    /* =====================================================
       PAGE ORDER
    ===================================================== */

    const pageOrder = [
        "home",
        "about",
        "education",
        "hobbies",
        "dreams",
        "contact",
        "thankyou"
    ];

    /* =====================================================
       STATE
    ===================================================== */

    let currentPage =
        "home";

    let isChangingPage =
        false;

    let loadingFinished =
        false;

    let musicPlaying =
        false;

    let musicStartedOnce =
        false;

    let mobileMenuOpen =
        false;

    let visitedPages =
        new Set();

    let secretSequence = [];

    let secretFound =
        false;

    let cakeCompleted =
        false;

    let achievementUnlocked =
        new Set();

    const VISITED_KEY =
        "sweet-gam-visited-pages";

    const ACHIEVEMENT_KEY =
        "sweet-gam-achievements";

    const SECRET_KEY =
        "sweet-gam-secret-found";

    const MUSIC_KEY =
        "sweet-gam-music";

    /* =====================================================
       PAGE LABELS
    ===================================================== */

    const pageLabels = {

        home:
            "Welcome to my sweet world",

        about:
            "Let me introduce myself",

        education:
            "The path I've walked",

        hobbies:
            "Things that make me happy",

        dreams:
            "Where I want to go",

        contact:
            "Let's keep in touch",

        thankyou:
            "Before you leave... I have something for you."

    };

    /* =====================================================
       ACHIEVEMENTS
    ===================================================== */

    const achievements = {

        "sweet-explorer": {
            icon: "🍬",
            title: "Sweet Explorer",
            description:
                "Visited all pages"
        },

        "lucky-baker": {
            icon: "🎰",
            title: "Lucky Baker",
            description:
                "สุ่มของตกแต่งครบ 5 ครั้ง!"
        },

        "little-baker": {
            icon: "🧁",
            title: "Little Baker",
            description:
                "สร้างและส่งเค้กสำเร็จแล้ว!"
        },

        "secret-finder": {
            icon: "🔮",
            title: "Secret Finder",
            description:
                "ค้นพบความลับของ Sweet World!"
        }

    };

    /* =====================================================
       LOAD SAVED STATE
    ===================================================== */

    function loadSavedState() {

        try {

            const savedVisited =
                localStorage.getItem(
                    VISITED_KEY
                );

            if (savedVisited) {

                const parsed =
                    JSON.parse(
                        savedVisited
                    );

                if (
                    Array.isArray(parsed)
                ) {

                    visitedPages =
                        new Set(parsed);
                }
            }

            const savedAchievements =
                localStorage.getItem(
                    ACHIEVEMENT_KEY
                );

            if (savedAchievements) {

                const parsed =
                    JSON.parse(
                        savedAchievements
                    );

                if (
                    Array.isArray(parsed)
                ) {

                    achievementUnlocked =
                        new Set(parsed);
                }
            }

            secretFound =
                localStorage.getItem(
                    SECRET_KEY
                ) === "true";

        } catch (error) {

            console.warn(
                "SweetMain: unable to load saved state.",
                error
            );
        }
    }

    /* =====================================================
       SAVE VISITED PAGES
    ===================================================== */

    function saveVisitedPages() {

        try {

            localStorage.setItem(
                VISITED_KEY,
                JSON.stringify(
                    Array.from(
                        visitedPages
                    )
                )
            );

        } catch (_) {}
    }

    /* =====================================================
       SAVE ACHIEVEMENTS
    ===================================================== */

    function saveAchievements() {

        try {

            localStorage.setItem(
                ACHIEVEMENT_KEY,
                JSON.stringify(
                    Array.from(
                        achievementUnlocked
                    )
                )
            );

        } catch (_) {}
    }

    /* =====================================================
       LIVE REGION
    ===================================================== */

    function announce(
        message
    ) {

        if (!liveRegion) {
            return;
        }

        liveRegion.textContent =
            "";

        window.setTimeout(
            () => {

                liveRegion.textContent =
                    message;

            },
            20
        );
    }

    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(
        icon,
        message
    ) {

        const toast =
            document.getElementById(
                "toast"
            );

        const toastIcon =
            document.getElementById(
                "toastIcon"
            );

        const toastMessage =
            document.getElementById(
                "toastMessage"
            );

        if (
            !toast ||
            !toastIcon ||
            !toastMessage
        ) {
            return;
        }

        toastIcon.textContent =
            icon || "🍬";

        toastMessage.textContent =
            message || "";

        toast.classList.remove(
            "show"
        );

        void toast.offsetWidth;

        toast.classList.add(
            "show"
        );

        window.clearTimeout(
            showToast.timer
        );

        showToast.timer =
            window.setTimeout(
                () => {

                    toast.classList.remove(
                        "show"
                    );

                },
                2800
            );
    }

    window.showToast =
        showToast;

    /* =====================================================
       ACHIEVEMENT POPUP
    ===================================================== */

    function unlockAchievement(
        id
    ) {

        if (
            !id ||
            achievementUnlocked.has(id)
        ) {
            return;
        }

        const data =
            achievements[id];

        if (!data) {
            return;
        }

        achievementUnlocked.add(
            id
        );

        saveAchievements();

        const popup =
            document.getElementById(
                "achievementPopup"
            );

        const icon =
            document.getElementById(
                "achievementIcon"
            );

        const title =
            document.getElementById(
                "achievementTitle"
            );

        const description =
            document.getElementById(
                "achievementDescription"
            );

        if (
            popup &&
            icon &&
            title &&
            description
        ) {

            icon.textContent =
                data.icon;

            title.textContent =
                data.title;

            description.textContent =
                data.description;

            popup.classList.remove(
                "show"
            );

            void popup.offsetWidth;

            popup.classList.add(
                "show"
            );

            window.clearTimeout(
                unlockAchievement.timer
            );

            unlockAchievement.timer =
                window.setTimeout(
                    () => {

                        popup.classList.remove(
                            "show"
                        );

                    },
                    4200
                );
        }

        announce(
            `Achievement unlocked: ${data.title}`
        );
    }

    window.SweetAchievements = {

        unlock:
            unlockAchievement,

        has(id) {
            return achievementUnlocked.has(
                id
            );
        },

        getAll() {
            return Array.from(
                achievementUnlocked
            );
        }

    };

    /* =====================================================
       PAGE HELPERS
    ===================================================== */

    function getPage(
        pageName
    ) {

        return document.querySelector(
            `.page[data-page="${pageName}"]`
        ) || document.getElementById(
            `page-${pageName}`
        );
    }

    function normalizePage(
        pageName
    ) {

        if (
            pageOrder.includes(
                pageName
            )
        ) {
            return pageName;
        }

        return "home";
    }

    /* =====================================================
       UPDATE NAVIGATION
    ===================================================== */

    function updateNavigation(
        pageName
    ) {

        navLinks.forEach(
            link => {

                const target =
                    link.dataset.page ||
                    link.getAttribute(
                        "href"
                    )?.replace(
                        "#",
                        ""
                    );

                const active =
                    target === pageName;

                link.classList.toggle(
                    "active",
                    active
                );

                link.setAttribute(
                    "aria-current",
                    active
                        ? "page"
                        : "false"
                );
            }
        );
    }

    /* =====================================================
       UPDATE PAGE PROGRESS
    ===================================================== */

    function updateProgress(
        pageName
    ) {

        if (!pageProgress) {
            return;
        }

        const dots =
            Array.from(
                pageProgress.querySelectorAll(
                    ".progress-dot"
                )
            );

        const lines =
            Array.from(
                pageProgress.querySelectorAll(
                    ".progress-line"
                )
            );

        const index =
            Math.max(
                0,
                pageOrder.indexOf(
                    pageName
                )
            );

        dots.forEach(
            (dot, dotIndex) => {

                dot.classList.toggle(
                    "active",
                    dotIndex === index
                );

                dot.classList.toggle(
                    "completed",
                    dotIndex < index
                );

                dot.setAttribute(
                    "aria-current",
                    dotIndex === index
                        ? "page"
                        : "false"
                );
            }
        );

        lines.forEach(
            (line, lineIndex) => {

                line.classList.toggle(
                    "active",
                    lineIndex < index
                );
            }
        );
    }

    /* =====================================================
       ACTIVATE PAGE
    ===================================================== */

    function activatePage(
        pageName
    ) {

        pageName =
            normalizePage(
                pageName
            );

        pages.forEach(
            page => {

                const name =
                    page.dataset.page;

                page.classList.toggle(
                    "active",
                    name === pageName
                );

                page.setAttribute(
                    "aria-hidden",
                    name === pageName
                        ? "false"
                        : "true"
                );
            }
        );

        currentPage =
            pageName;

        visitedPages.add(
            pageName
        );

        saveVisitedPages();

        updateNavigation(
            pageName
        );

        updateProgress(
            pageName
        );

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });

        updateSauce();

        announce(
            pageLabels[pageName] ||
            pageName
        );

        if (
            pageName ===
            "thankyou"
        ) {

            refreshCakeState();
        }

        checkSweetExplorer();
    }

    /* =====================================================
       CHANGE PAGE
    ===================================================== */

    async function goToPage(
        pageName,
        options = {}
    ) {

        pageName =
            normalizePage(
                pageName
            );

        if (
            pageName ===
            currentPage &&
            !options.force
        ) {
            closeMobileMenu();
            return;
        }

        if (isChangingPage) {
            return;
        }

        isChangingPage =
            true;

        closeMobileMenu();

        const change =
            async () => {

                activatePage(
                    pageName
                );
            };

        try {

            if (
                window.SweetTransition &&
                typeof window.SweetTransition.play ===
                    "function"
            ) {

                await window.SweetTransition.play(
                    change
                );

            } else {

                activatePage(
                    pageName
                );
            }

        } catch (error) {

            console.error(
                "SweetMain: page transition failed.",
                error
            );

            activatePage(
                pageName
            );
        }

        isChangingPage =
            false;

        updateUrl(
            pageName
        );
    }

    /* =====================================================
       URL
    ===================================================== */

    function updateUrl(
        pageName
    ) {

        try {

            const url =
                `${window.location.pathname}` +
                `${window.location.search}` +
                `#${pageName}`;

            window.history.replaceState(
                {
                    page: pageName
                },
                "",
                url
            );

        } catch (_) {}
    }

    function getInitialPage() {

        const hash =
            window.location.hash
                .replace(
                    "#",
                    ""
                )
                .trim();

        if (
            pageOrder.includes(
                hash
            )
        ) {

            return hash;
        }

        return "home";
    }

    /* =====================================================
       NAVIGATION EVENTS
    ===================================================== */

    navLinks.forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const page =
                        link.dataset.page ||
                        link.getAttribute(
                            "href"
                        )?.replace(
                            "#",
                            ""
                        );

                    goToPage(
                        page
                    );
                }
            );
        }
    );

    document.addEventListener(
        "click",
        event => {

            const target =
                event.target.closest(
                    "[data-go-page]"
                );

            if (!target) {
                return;
            }

            event.preventDefault();

            goToPage(
                target.dataset.goPage
            );
        }
    );

    window.addEventListener(
        "popstate",
        () => {

            goToPage(
                getInitialPage(),
                {
                    force: true
                }
            );
        }
    );

    window.addEventListener(
        "hashchange",
        () => {

            const page =
                getInitialPage();

            if (
                page !== currentPage
            ) {

                goToPage(
                    page
                );
            }
        }
    );

    /* =====================================================
       MOBILE MENU
    ===================================================== */

    function openMobileMenu() {

        if (!navigation) {
            return;
        }

        mobileMenuOpen =
            true;

        navigation.classList.add(
            "is-open"
        );

        mobileMenuButton?.classList.add(
            "is-open"
        );

        mobileMenuButton?.setAttribute(
            "aria-expanded",
            "true"
        );

        document.body.classList.add(
            "menu-open"
        );
    }

    function closeMobileMenu() {

        if (!navigation) {
            return;
        }

        mobileMenuOpen =
            false;

        navigation.classList.remove(
            "is-open"
        );

        mobileMenuButton?.classList.remove(
            "is-open"
        );

        mobileMenuButton?.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.classList.remove(
            "menu-open"
        );
    }

    function toggleMobileMenu() {

        if (
            mobileMenuOpen
        ) {

            closeMobileMenu();

        } else {

            openMobileMenu();
        }
    }

    if (mobileMenuButton) {

        mobileMenuButton.addEventListener(
            "click",
            toggleMobileMenu
        );
    }

    /* =====================================================
       THEME BUTTON
    ===================================================== */

    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                if (
                    window.SweetTheme &&
                    typeof window.SweetTheme.toggle ===
                        "function"
                ) {

                    window.SweetTheme.toggle();
                }
            }
        );
    }

    /* =====================================================
       MUSIC
    ===================================================== */

    function updateMusicUI() {

        if (!musicToggle) {
            return;
        }

        musicToggle.classList.toggle(
            "is-playing",
            musicPlaying
        );

        musicToggle.setAttribute(
            "aria-pressed",
            String(musicPlaying)
        );

        musicToggle.setAttribute(
            "aria-label",
            musicPlaying
                ? "Pause music"
                : "Play music"
        );

        if (musicIcon) {

            musicIcon.textContent =
                musicPlaying
                    ? "🔊"
                    : "🎵";
        }
    }

    async function playMusic() {

        if (!backgroundMusic) {
            return;
        }

        try {

            backgroundMusic.loop =
                true;

            await backgroundMusic.play();

            musicPlaying =
                true;

            musicStartedOnce =
                true;

            try {

                localStorage.setItem(
                    MUSIC_KEY,
                    "on"
                );

            } catch (_) {}

        } catch (error) {

            musicPlaying =
                false;

            console.warn(
                "SweetMain: music could not start.",
                error
            );

            showToast(
                "🎵",
                "แตะปุ่มเพลงอีกครั้งเพื่อเริ่มเพลงนะ"
            );
        }

        updateMusicUI();
    }

    function pauseMusic() {

        if (!backgroundMusic) {
            return;
        }

        backgroundMusic.pause();

        musicPlaying =
            false;

        try {

            localStorage.setItem(
                MUSIC_KEY,
                "off"
            );

        } catch (_) {}

        updateMusicUI();
    }

    async function toggleMusic() {

        if (
            musicPlaying
        ) {

            pauseMusic();

        } else {

            await playMusic();
        }
    }

    if (musicToggle) {

        musicToggle.addEventListener(
            "click",
            toggleMusic
        );
    }

    if (backgroundMusic) {

        backgroundMusic.addEventListener(
            "ended",
            () => {

                if (musicPlaying) {

                    backgroundMusic.currentTime =
                        0;

                    playMusic();
                }
            }
        );

        backgroundMusic.addEventListener(
            "pause",
            () => {

                if (
                    musicPlaying &&
                    !document.hidden
                ) {

                    musicPlaying =
                        false;

                    updateMusicUI();
                }
            }
        );
    }

    /* =====================================================
       SAUCE / SCROLL EFFECT
    ===================================================== */

    function updateSauce() {

        if (!stickySauce) {
            return;
        }

        const scrollTop =
            window.scrollY || 0;

        const documentHeight =
            Math.max(
                1,
                document.documentElement
                    .scrollHeight -
                window.innerHeight
            );

        const progress =
            Math.min(
                1,
                Math.max(
                    0,
                    scrollTop /
                    documentHeight
                )
            );

        stickySauce.style.setProperty(
            "--scroll-progress",
            progress.toFixed(3)
        );

        stickySauce.classList.toggle(
            "is-spilling",
            progress > 0.94
        );

        document.body.classList.toggle(
            "near-page-bottom",
            progress > 0.94
        );
    }

    window.addEventListener(
        "scroll",
        updateSauce,
        {
            passive: true
        }
    );

    window.addEventListener(
        "resize",
        updateSauce
    );

    /* =====================================================
       SWEET EXPLORER
    ===================================================== */

    function checkSweetExplorer() {

        if (
            pageOrder.every(
                page =>
                    visitedPages.has(
                        page
                    )
            )
        ) {

            unlockAchievement(
                "sweet-explorer"
            );
        }
    }

    /* =====================================================
       SECRET RECIPE
    ===================================================== */

    const secretSequenceTarget = [
        "🍓",
        "🍫",
        "🍭",
        "🍰"
    ];

    function registerSecret(
        icon
    ) {

        if (
            secretFound
        ) {
            return;
        }

        secretSequence.push(
            icon
        );

        if (
            secretSequence.length >
            secretSequenceTarget.length
        ) {

            secretSequence.shift();
        }

        const matches =
            secretSequence.every(
                (
                    value,
                    index
                ) =>
                    value ===
                    secretSequenceTarget[
                        index
                    ]
            );

        if (
            matches &&
            secretSequence.length ===
                secretSequenceTarget.length
        ) {

            revealSecret();
        }
    }

    function revealSecret() {

        if (secretFound) {
            return;
        }

        secretFound =
            true;

        try {

            localStorage.setItem(
                SECRET_KEY,
                "true"
            );

        } catch (_) {}

        const secret =
            document.getElementById(
                "secretRecipe"
            );

        if (secret) {

            secret.hidden =
                false;

            secret.classList.add(
                "show"
            );
        }

        unlockAchievement(
            "secret-finder"
        );

        showToast(
            "🔮",
            "เจอความลับแล้ว! สูตรขนมลับถูกเปิดออก ✨"
        );
    }

    function setupSecretSparkles() {

        const sparkleButtons =
            document.querySelectorAll(
                ".secret-sparkle"
            );

        sparkleButtons.forEach(
            sparkle => {

                sparkle.addEventListener(
                    "click",
                    () => {

                        const icon =
                            sparkle.dataset.secret ||
                            sparkle.textContent.trim();

                        registerSecret(
                            icon
                        );

                        sparkle.classList.remove(
                            "found"
                        );

                        void sparkle.offsetWidth;

                        sparkle.classList.add(
                            "found"
                        );
                    }
                );
            }
        );
    }

    /* =====================================================
       CLOSE SECRET
    ===================================================== */

    const closeSecretButton =
        document.getElementById(
            "closeSecretRecipe"
        );

    if (closeSecretButton) {

        closeSecretButton.addEventListener(
            "click",
            () => {

                const secret =
                    document.getElementById(
                        "secretRecipe"
                    );

                if (secret) {

                    secret.classList.remove(
                        "show"
                    );

                    window.setTimeout(
                        () => {

                            secret.hidden =
                                true;

                        },
                        350
                    );
                }
            }
        );
    }

    /* =====================================================
       BACKGROUND SWEETS
    ===================================================== */

    function setupBackgroundSweets() {

        const sweets =
            document.querySelectorAll(
                ".background-sweet"
            );

        sweets.forEach(
            sweet => {

                sweet.addEventListener(
                    "click",
                    () => {

                        sweet.classList.remove(
                            "is-popping"
                        );

                        void sweet.offsetWidth;

                        sweet.classList.add(
                            "is-popping"
                        );

                        const icons = [
                            "🍬",
                            "🍭",
                            "🧁",
                            "🍓",
                            "🍰",
                            "💗"
                        ];

                        const icon =
                            icons[
                                Math.floor(
                                    Math.random() *
                                    icons.length
                                )
                            ];

                        showToast(
                            icon,
                            "A little sweetness! ✨"
                        );

                        window.setTimeout(
                            () => {

                                sweet.classList.remove(
                                    "is-popping"
                                );

                            },
                            900
                        );
                    }
                );
            }
        );
    }

    /* =====================================================
       CAKE STATE
    ===================================================== */

    function refreshCakeState() {

        if (
            !window.SweetCake ||
            typeof window.SweetCake.getState !==
                "function"
        ) {
            return;
        }

        const state =
            window.SweetCake.getState();

        cakeCompleted =
            Boolean(
                state &&
                state.boxed
            );
    }

    /* =====================================================
       CAKE ACHIEVEMENT EVENT
    ===================================================== */

    window.addEventListener(
        "sweetAchievement",
        event => {

            const detail =
                event.detail;

            if (!detail) {
                return;
            }

            if (
                detail.id
            ) {

                unlockAchievement(
                    detail.id
                );
            }
        }
    );

    /* =====================================================
       GACHA / CAKE EVENTS
    ===================================================== */

    window.addEventListener(
        "sweetCakeCompleted",
        () => {

            cakeCompleted =
                true;

            unlockAchievement(
                "little-baker"
            );
        }
    );

    /* =====================================================
       KEYBOARD SHORTCUTS
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeMobileMenu();

                const secret =
                    document.getElementById(
                        "secretRecipe"
                    );

                if (
                    secret &&
                    secret.classList.contains(
                        "show"
                    )
                ) {

                    secret.classList.remove(
                        "show"
                    );
                }
            }

            if (
                event.key ===
                "ArrowRight" &&
                !event.ctrlKey &&
                !event.metaKey &&
                !event.altKey &&
                document.activeElement ===
                    document.body
            ) {

                const index =
                    pageOrder.indexOf(
                        currentPage
                    );

                if (
                    index <
                    pageOrder.length - 1
                ) {

                    goToPage(
                        pageOrder[
                            index + 1
                        ]
                    );
                }
            }

            if (
                event.key ===
                "ArrowLeft" &&
                !event.ctrlKey &&
                !event.metaKey &&
                !event.altKey &&
                document.activeElement ===
                    document.body
            ) {

                const index =
                    pageOrder.indexOf(
                        currentPage
                    );

                if (index > 0) {

                    goToPage(
                        pageOrder[
                            index - 1
                        ]
                    );
                }
            }
        }
    );

    /* =====================================================
       PREVENT UNWANTED DRAGGING
    ===================================================== */

    document.addEventListener(
        "dragstart",
        event => {

            const target =
                event.target;

            if (
                target instanceof
                HTMLImageElement
            ) {

                event.preventDefault();
            }
        }
    );

    /* =====================================================
       LOADING SCREEN
    ===================================================== */

    function setLoadingProgress(
        percent,
        status
    ) {

        const value =
            Math.max(
                0,
                Math.min(
                    100,
                    percent
                )
            );

        if (loaderProgress) {

            loaderProgress.style.width =
                `${value}%`;
        }

        if (loaderPercent) {

            loaderPercent.textContent =
                `${Math.round(value)}%`;
        }

        if (loaderStatus) {

            loaderStatus.textContent =
                status || "Loading...";
        }
    }

    function wait(
        ms
    ) {

        return new Promise(
            resolve =>
                window.setTimeout(
                    resolve,
                    ms
                )
        );
    }

    async function runLoading() {

        if (
            loadingFinished
        ) {
            return;
        }

        loadingFinished =
            true;

        if (!loadingScreen) {

            activatePage(
                getInitialPage()
            );

            return;
        }

        const loadingSteps = [
            [
                10,
                "Mixing sweet colors..."
            ],
            [
                25,
                "Preparing candy..."
            ],
            [
                42,
                "Sprinkling sugar..."
            ],
            [
                60,
                "Adding a little magic..."
            ],
            [
                78,
                "Decorating the sweet world..."
            ],
            [
                92,
                "Almost ready..."
            ],
            [
                100,
                "Welcome to my sweet world!"
            ]
        ];

        for (
            const step of loadingSteps
        ) {

            setLoadingProgress(
                step[0],
                step[1]
            );

            await wait(
                180
            );
        }

        await wait(
            300
        );

        loadingScreen.classList.add(
            "is-complete"
        );

        await wait(
            700
        );

        /*
         * The loading screen disappears first.
         * The curtain remains available for navigation.
         */

        loadingScreen.classList.add(
            "is-hidden"
        );

        await wait(
            650
        );

        loadingScreen.hidden =
            true;

        activatePage(
            getInitialPage()
        );

        /*
         * First visit does not trigger a second
         * loading animation.
         */

        if (curtain) {

            curtain.classList.add(
                "is-open"
            );

            curtain.setAttribute(
                "aria-hidden",
                "true"
            );
        }

        announce(
            pageLabels[currentPage]
        );
    }

    /* =====================================================
       THEME EVENT
    ===================================================== */

    window.addEventListener(
        "sweetThemeChange",
        event => {

            const theme =
                event.detail?.theme;

            if (!theme) {
                return;
            }

            showToast(
                theme === "bakery"
                    ? "🥐"
                    : "🍭",
                theme === "bakery"
                    ? "เข้าสู่ Vintage Bakery"
                    : "กลับสู่ Candy Sweet Fantasy"
            );
        }
    );

    /* =====================================================
       VISIBILITY / MUSIC
    ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {
                return;
            }

            /*
             * Browsers may pause audio when the page
             * becomes hidden. Do not force autoplay.
             */

            if (
                musicStartedOnce &&
                backgroundMusic &&
                musicPlaying &&
                backgroundMusic.paused
            ) {

                playMusic();
            }
        }
    );

    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initialize() {

        loadSavedState();

        setupSecretSparkles();

        setupBackgroundSweets();

        activatePage(
            getInitialPage()
        );

        updateSauce();

        updateMusicUI();

        /*
         * Start loading animation after the DOM
         * has completely initialized.
         */

        window.setTimeout(
            runLoading,
            120
        );
    }

    /* =====================================================
       EXPOSE MAIN API
    ===================================================== */

    window.SweetMain = {

        goToPage,

        getCurrentPage() {
            return currentPage;
        },

        getPages() {
            return [
                ...pageOrder
            ];
        },

        showToast,

        unlockAchievement,

        getVisitedPages() {
            return Array.from(
                visitedPages
            );
        },

        openMenu:
            openMobileMenu,

        closeMenu:
            closeMobileMenu,

        playMusic,

        pauseMusic,

        toggleMusic,

        isMusicPlaying() {
            return musicPlaying;
        }

    };

    /* =====================================================
       START
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            {
                once: true
            }
        );

    } else {

        initialize();
    }

})();
