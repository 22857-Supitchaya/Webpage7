/* =========================================================
   SWEET GAM PORTFOLIO
   transition.js
   Curtain page transition system
========================================================= */

(() => {
    "use strict";

    const curtain = document.getElementById("curtainTransition");

    if (!curtain) {
        console.warn("SweetTransition: #curtainTransition not found.");
        return;
    }

    const leftCurtain =
        curtain.querySelector(".curtain-left");

    const rightCurtain =
        curtain.querySelector(".curtain-right");

    const center =
        curtain.querySelector(".curtain-center");

    const decorations =
        curtain.querySelectorAll(".curtain-decoration");

    let busy = false;

    const reducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const TIMING = {
        close: reducedMotion ? 100 : 560,
        hold: reducedMotion ? 50 : 180,
        open: reducedMotion ? 100 : 620
    };

    /* =====================================================
       HELPERS
    ===================================================== */

    function wait(ms) {
        return new Promise(resolve => {
            window.setTimeout(resolve, ms);
        });
    }

    function setCurtainState(state) {
        curtain.dataset.state = state;

        curtain.classList.remove(
            "is-open",
            "is-closing",
            "is-closed",
            "is-opening"
        );

        curtain.classList.add(`is-${state}`);
    }

    function resetInlineStyles() {
        if (leftCurtain) {
            leftCurtain.style.removeProperty("transform");
        }

        if (rightCurtain) {
            rightCurtain.style.removeProperty("transform");
        }

        if (center) {
            center.style.removeProperty("opacity");
            center.style.removeProperty("transform");
        }

        decorations.forEach(item => {
            item.style.removeProperty("opacity");
            item.style.removeProperty("transform");
        });
    }

    /* =====================================================
       OPEN
    ===================================================== */

    async function open() {

        setCurtainState("opening");

        if (leftCurtain) {
            leftCurtain.style.transform =
                "translateX(-105%)";
        }

        if (rightCurtain) {
            rightCurtain.style.transform =
                "translateX(105%)";
        }

        if (center) {
            center.style.opacity = "0";
            center.style.transform =
                "translate(-50%, -50%) scale(.85)";
        }

        decorations.forEach((item, index) => {
            item.style.opacity = "0";

            const direction =
                index % 2 === 0 ? "-35px" : "35px";

            item.style.transform =
                `translateX(${direction}) scale(.7)`;
        });

        await wait(TIMING.open);

        curtain.classList.remove(
            "is-opening",
            "is-closing",
            "is-closed"
        );

        curtain.classList.add("is-open");

        curtain.setAttribute("aria-hidden", "true");

        resetInlineStyles();
    }

    /* =====================================================
       CLOSE
    ===================================================== */

    async function close() {

        setCurtainState("closing");

        curtain.removeAttribute("aria-hidden");

        if (leftCurtain) {
            leftCurtain.style.transform =
                "translateX(0)";
        }

        if (rightCurtain) {
            rightCurtain.style.transform =
                "translateX(0)";
        }

        if (center) {
            center.style.opacity = "1";
            center.style.transform =
                "translate(-50%, -50%) scale(1)";
        }

        decorations.forEach(item => {
            item.style.opacity = "1";
            item.style.transform =
                "translateX(0) scale(1)";
        });

        await wait(TIMING.close);

        setCurtainState("closed");

        await wait(TIMING.hold);
    }

    /* =====================================================
       FULL TRANSITION
    ===================================================== */

    async function play(callback) {

        if (busy) {
            return false;
        }

        busy = true;

        try {

            await close();

            if (typeof callback === "function") {
                await callback();
            }

            await open();

        } catch (error) {

            console.error(
                "SweetTransition error:",
                error
            );

            try {
                await open();
            } catch (_) {}

        } finally {
            busy = false;
        }

        return true;
    }

    /* =====================================================
       NAVIGATION TRANSITION
    ===================================================== */

    function navigate(callback) {
        return play(callback);
    }

    /* =====================================================
       CUSTOM EVENT
       
       Other files can trigger:
       
       window.dispatchEvent(
           new CustomEvent("sweetCurtainTransition", {
               detail: {
                   callback: () => {}
               }
           })
       );
    ===================================================== */

    window.addEventListener(
        "sweetCurtainTransition",
        event => {

            const callback =
                event.detail &&
                event.detail.callback;

            play(callback);
        }
    );

    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.SweetTransition = {

        play,

        navigate,

        open,

        close,

        isBusy() {
            return busy;
        },

        getTiming() {
            return {
                ...TIMING
            };
        }

    };

    /* =====================================================
       INITIAL STATE
       
       Loading screen will decide when the first curtain
       animation should happen.
    ===================================================== */

    curtain.classList.remove(
        "is-closing",
        "is-closed",
        "is-opening"
    );

    curtain.classList.add("is-open");

    curtain.setAttribute("aria-hidden", "true");

})();
