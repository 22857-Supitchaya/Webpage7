/* =========================================================
   MY SWEET PORTFOLIO
   EFFECTS.JS
   Cursor / Trail / Click Burst / Floating Sweets
========================================================= */

(() => {

    "use strict";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const cursor =
        document.getElementById("customCursor");

    const trailLayer =
        document.getElementById("mouseTrail");

    const burstLayer =
        document.getElementById("clickBurstLayer");

    const background =
        document.getElementById("globalBackground");


    /* =====================================================
       STATE
    ===================================================== */

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let cursorX = mouseX;
    let cursorY = mouseY;

    let lastTrailTime = 0;

    let trailIndex = 0;

    const MAX_TRAIL =
        18;


    /* =====================================================
       SWEET COLLECTIONS
    ===================================================== */

    const candySweets = [
        "🍭",
        "🍬",
        "🍫",
        "🍩",
        "🧁",
        "🍰",
        "🍓",
        "🍒",
        "🍪",
        "🍡"
    ];


    const bakerySweets = [
        "🥐",
        "🍞",
        "🥨",
        "🍪",
        "🍫",
        "🧁",
        "🍰",
        "🥧",
        "🌰",
        "🍩"
    ];


    /* =====================================================
       GET CURRENT THEME
    ===================================================== */

    function getTheme() {

        if (
            document.body.classList.contains(
                "theme-bakery"
            )
        ) {

            return "bakery";

        }

        return "candy";

    }


    function getSweetSet() {

        return getTheme() === "bakery"
            ? bakerySweets
            : candySweets;

    }


    function randomSweet() {

        const sweets =
            getSweetSet();

        return sweets[
            Math.floor(
                Math.random() * sweets.length
            )
        ];

    }


    /* =====================================================
       MOUSE POSITION
    ===================================================== */

    document.addEventListener(
        "mousemove",
        event => {

            mouseX =
                event.clientX;

            mouseY =
                event.clientY;


            createMouseTrail();

        },
        {
            passive: true
        }
    );


    /* =====================================================
       TOUCH SUPPORT
    ===================================================== */

    document.addEventListener(
        "touchmove",
        event => {

            const touch =
                event.touches[0];

            if (!touch) {
                return;
            }

            mouseX =
                touch.clientX;

            mouseY =
                touch.clientY;

        },
        {
            passive: true
        }
    );


    /* =====================================================
       CUSTOM SPOON CURSOR
    ===================================================== */

    function animateCursor() {

        cursorX +=
            (mouseX - cursorX) *
            0.18;

        cursorY +=
            (mouseY - cursorY) *
            0.18;


        if (cursor) {

            cursor.style.transform =
                `translate3d(
                    ${cursorX}px,
                    ${cursorY}px,
                    0
                )`;

        }


        requestAnimationFrame(
            animateCursor
        );

    }


    animateCursor();


    /* =====================================================
       CURSOR HOVER
    ===================================================== */

    document.addEventListener(
        "mouseover",
        event => {

            const target =
                event.target.closest(
                    "button, a, .tilt-card, .tilt-text, .choice-button, .gacha-button"
                );


            if (
                target &&
                cursor
            ) {

                cursor.classList.add(
                    "cursor-hover"
                );

            }

        }
    );


    document.addEventListener(
        "mouseout",
        event => {

            const target =
                event.target.closest(
                    "button, a, .tilt-card, .tilt-text, .choice-button, .gacha-button"
                );


            if (
                target &&
                cursor
            ) {

                cursor.classList.remove(
                    "cursor-hover"
                );

            }

        }
    );


    /* =====================================================
       CREATE MOUSE TRAIL
    ===================================================== */

    function createMouseTrail() {

        if (!trailLayer) {
            return;
        }


        const now =
            performance.now();


        if (
            now - lastTrailTime <
            55
        ) {

            return;

        }


        lastTrailTime =
            now;


        const sweet =
            document.createElement(
                "span"
            );


        sweet.className =
            "trail-sweet";


        sweet.textContent =
            randomSweet();


        sweet.style.left =
            `${mouseX}px`;


        sweet.style.top =
            `${mouseY}px`;


        sweet.style.setProperty(
            "--trail-rotate",
            `${Math.random() * 50 - 25}deg`
        );


        sweet.style.setProperty(
            "--trail-scale",
            `${0.65 + Math.random() * 0.55}`
        );


        trailLayer.appendChild(
            sweet
        );


        trailIndex++;


        if (
            trailLayer.children.length >
            MAX_TRAIL
        ) {

            trailLayer.firstElementChild
                ?.remove();

        }


        window.setTimeout(
            () => {

                sweet.classList.add(
                    "trail-fade"
                );

            },
            10
        );


        window.setTimeout(
            () => {

                sweet.remove();

            },
            850
        );

    }


    /* =====================================================
       CLICK BURST
    ===================================================== */

    document.addEventListener(
        "click",
        event => {

            createClickBurst(
                event.clientX,
                event.clientY
            );

        }
    );


    function createClickBurst(
        x,
        y
    ) {

        if (!burstLayer) {
            return;
        }


        const amount =
            9;


        for (
            let i = 0;
            i < amount;
            i++
        ) {

            const sweet =
                document.createElement(
                    "span"
                );


            sweet.className =
                "burst-sweet";


            sweet.textContent =
                randomSweet();


            sweet.style.left =
                `${x}px`;


            sweet.style.top =
                `${y}px`;


            const angle =
                (
                    Math.PI * 2 *
                    i / amount
                ) +
                (
                    Math.random() * .45
                );


            const distance =
                45 +
                Math.random() * 85;


            sweet.style.setProperty(
                "--burst-x",
                `${Math.cos(angle) * distance}px`
            );


            sweet.style.setProperty(
                "--burst-y",
                `${Math.sin(angle) * distance}px`
            );


            sweet.style.setProperty(
                "--burst-rotate",
                `${Math.random() * 360}deg`
            );


            sweet.style.setProperty(
                "--burst-scale",
                `${.65 + Math.random() * .55}`
            );


            burstLayer.appendChild(
                sweet
            );


            window.setTimeout(
                () => {

                    sweet.classList.add(
                        "burst-active"
                    );

                },
                10
            );


            window.setTimeout(
                () => {

                    sweet.remove();

                },
                900
            );

        }

    }


    /* =====================================================
       BACKGROUND SWEET INTERACTION
    ===================================================== */

    function setupBackgroundSweets() {

        if (!background) {
            return;
        }


        const sweets =
            background.querySelectorAll(
                ".background-sweet, .floating-candy"
            );


        sweets.forEach(
            sweet => {

                sweet.addEventListener(
                    "mouseenter",
                    () => {

                        sweet.classList.add(
                            "sweet-hover"
                        );

                    }
                );


                sweet.addEventListener(
                    "mouseleave",
                    () => {

                        sweet.classList.remove(
                            "sweet-hover"
                        );

                    }
                );


                sweet.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        popBackgroundSweet(
                            sweet
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       BACKGROUND SWEET POP
    ===================================================== */

    function popBackgroundSweet(
        element
    ) {

        if (
            !element ||
            element.dataset.popping === "true"
        ) {

            return;

        }


        element.dataset.popping =
            "true";


        element.classList.add(
            "sweet-pop"
        );


        createClickBurst(
            mouseX,
            mouseY
        );


        window.setTimeout(
            () => {

                element.classList.remove(
                    "sweet-pop"
                );


                element.dataset.popping =
                    "false";


            },
            700
        );

    }


    setupBackgroundSweets();


    /* =====================================================
       FLOATING SWEETS REACT TO MOUSE
    ===================================================== */

    function updateFloatingSweetMotion() {

        if (!background) {
            return;
        }


        const elements =
            background.querySelectorAll(
                ".background-sweet, .floating-candy"
            );


        elements.forEach(
            (element, index) => {

                const rect =
                    element.getBoundingClientRect();


                const centerX =
                    rect.left +
                    rect.width / 2;


                const centerY =
                    rect.top +
                    rect.height / 2;


                const dx =
                    centerX -
                    mouseX;


                const dy =
                    centerY -
                    mouseY;


                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                const influenceRadius =
                    170;


                if (
                    distance <
                    influenceRadius
                ) {

                    const strength =
                        (
                            influenceRadius -
                            distance
                        ) /
                        influenceRadius;


                    const safeDistance =
                        Math.max(
                            distance,
                            1
                        );


                    const pushX =
                        (
                            dx /
                            safeDistance
                        ) *
                        strength *
                        22;


                    const pushY =
                        (
                            dy /
                            safeDistance
                        ) *
                        strength *
                        22;


                    element.style.setProperty(
                        "--mouse-push-x",
                        `${pushX}px`
                    );


                    element.style.setProperty(
                        "--mouse-push-y",
                        `${pushY}px`
                    );

                } else {

                    element.style.setProperty(
                        "--mouse-push-x",
                        "0px"
                    );


                    element.style.setProperty(
                        "--mouse-push-y",
                        "0px"
                    );

                }

            }
        );


        requestAnimationFrame(
            updateFloatingSweetMotion
        );

    }


    updateFloatingSweetMotion();


    /* =====================================================
       TILT CARDS
    ===================================================== */

    function setupTiltCards() {

        const cards =
            document.querySelectorAll(
                ".tilt-card"
            );


        cards.forEach(
            card => {

                card.addEventListener(
                    "mousemove",
                    event => {

                        const rect =
                            card.getBoundingClientRect();


                        const x =
                            event.clientX -
                            rect.left;


                        const y =
                            event.clientY -
                            rect.top;


                        const centerX =
                            rect.width / 2;


                        const centerY =
                            rect.height / 2;


                        const rotateY =
                            (
                                x -
                                centerX
                            ) /
                            centerX *
                            7;


                        const rotateX =
                            (
                                centerY -
                                y
                            ) /
                            centerY *
                            7;


                        card.style.setProperty(
                            "--tilt-x",
                            `${rotateX}deg`
                        );


                        card.style.setProperty(
                            "--tilt-y",
                            `${rotateY}deg`
                        );

                    }
                );


                card.addEventListener(
                    "mouseleave",
                    () => {

                        card.style.setProperty(
                            "--tilt-x",
                            "0deg"
                        );


                        card.style.setProperty(
                            "--tilt-y",
                            "0deg"
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       TEXT TILT
    ===================================================== */

    function setupTextTilt() {

        const cards =
            document.querySelectorAll(
                ".tilt-text"
            );


        cards.forEach(
            card => {

                card.addEventListener(
                    "mousemove",
                    event => {

                        const rect =
                            card.getBoundingClientRect();


                        const x =
                            event.clientX -
                            rect.left;


                        const y =
                            event.clientY -
                            rect.top;


                        const centerX =
                            rect.width / 2;


                        const centerY =
                            rect.height / 2;


                        const rotateY =
                            (
                                x -
                                centerX
                            ) /
                            centerX *
                            4;


                        const rotateX =
                            (
                                centerY -
                                y
                            ) /
                            centerY *
                            4;


                        card.style.setProperty(
                            "--text-tilt-x",
                            `${rotateX}deg`
                        );


                        card.style.setProperty(
                            "--text-tilt-y",
                            `${rotateY}deg`
                        );

                    }
                );


                card.addEventListener(
                    "mouseleave",
                    () => {

                        card.style.setProperty(
                            "--text-tilt-x",
                            "0deg"
                        );


                        card.style.setProperty(
                            "--text-tilt-y",
                            "0deg"
                        );

                    }
                );

            }
        );

    }


    setupTiltCards();

    setupTextTilt();


    /* =====================================================
       SCROLL SWEET PARALLAX
    ===================================================== */

    let scrollTicking =
        false;


    window.addEventListener(
        "scroll",
        () => {

            if (
                scrollTicking
            ) {

                return;

            }


            scrollTicking =
                true;


            requestAnimationFrame(
                () => {

                    updateScrollEffects();

                    scrollTicking =
                        false;

                }
            );

        },
        {
            passive: true
        }
    );


    function updateScrollEffects() {

        const scrollY =
            window.scrollY;


        const sweets =
            document.querySelectorAll(
                ".background-sweet, .floating-candy"
            );


        sweets.forEach(
            (sweet, index) => {

                const speed =
                    (
                        index % 2 === 0
                            ? .025
                            : -.018
                    );


                sweet.style.setProperty(
                    "--scroll-shift",
                    `${scrollY * speed}px`
                );

            }
        );

    }


    /* =====================================================
       SECRET SPARKLE HOVER
    ===================================================== */

    function setupSecretSparkles() {

        const sparkles =
            document.querySelectorAll(
                ".secret-sparkle"
            );


        sparkles.forEach(
            sparkle => {

                sparkle.addEventListener(
                    "mouseenter",
                    () => {

                        const message =
                            sparkle.dataset.message;


                        if (
                            message &&
                            typeof window.showToast ===
                            "function"
                        ) {

                            window.showToast(
                                "✨",
                                message
                            );

                        }

                    }
                );

            }
        );

    }


    setupSecretSparkles();


    /* =====================================================
       THEME CHANGE
    ===================================================== */

    window.addEventListener(
        "sweetThemeChange",
        () => {

            /*
             * ให้ background sweets
             * เปลี่ยนอารมณ์ตาม theme
             */

            document
                .querySelectorAll(
                    ".background-sweet, .floating-candy"
                )
                .forEach(
                    element => {

                        element.classList.add(
                            "theme-refresh"
                        );


                        window.setTimeout(
                            () => {

                                element.classList.remove(
                                    "theme-refresh"
                                );

                            },
                            700
                        );

                    }
                );

        }
    );


    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            mouseX =
                Math.min(
                    mouseX,
                    window.innerWidth
                );


            mouseY =
                Math.min(
                    mouseY,
                    window.innerHeight
                );

        }
    );


    /* =====================================================
       PUBLIC EFFECTS API
    ===================================================== */

    window.SweetEffects = {

        burst(
            x = window.innerWidth / 2,
            y = window.innerHeight / 2
        ) {

            createClickBurst(
                x,
                y
            );

        },


        trail() {

            createMouseTrail();

        },


        sweet() {

            return randomSweet();

        }

    };


})();
