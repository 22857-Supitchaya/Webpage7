/* =========================================================
   SWEET GAM PORTFOLIO
   gacha.js
   Cake Decoration Gacha System
========================================================= */

(() => {
    "use strict";

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const gachaButton =
        document.getElementById("gachaButton");

    const gachaDisplay =
        document.getElementById("gachaDisplay");

    const gachaResult =
        document.getElementById("gachaResult");

    const inventory =
        document.getElementById("decorationInventory");

    const inventoryEmpty =
        document.getElementById("inventoryEmpty");

    const toast =
        document.getElementById("toast");

    /* =====================================================
       DECORATION DATA
    ===================================================== */

    const decorations = [
        {
            id: "strawberry",
            name: "Strawberry",
            icon: "🍓",
            type: "fruit",
            className: "decoration-strawberry"
        },

        {
            id: "cherry",
            name: "Cherry",
            icon: "🍒",
            type: "fruit",
            className: "decoration-cherry"
        },

        {
            id: "blueberry",
            name: "Blueberry",
            icon: "🫐",
            type: "fruit",
            className: "decoration-blueberry"
        },

        {
            id: "chocolate",
            name: "Chocolate",
            icon: "🍫",
            type: "chocolate",
            className: "decoration-chocolate"
        },

        {
            id: "lollipop",
            name: "Lollipop",
            icon: "🍭",
            type: "candy",
            className: "decoration-lollipop"
        },

        {
            id: "candy",
            name: "Candy",
            icon: "🍬",
            type: "candy",
            className: "decoration-candy"
        },

        {
            id: "sprinkles",
            name: "Sprinkles",
            icon: "🌈",
            type: "sprinkles",
            className: "decoration-sprinkles"
        },

        {
            id: "heart",
            name: "Sweet Heart",
            icon: "💗",
            type: "special",
            className: "decoration-heart"
        },

        {
            id: "star",
            name: "Sugar Star",
            icon: "⭐",
            type: "special",
            className: "decoration-star"
        },

        {
            id: "flower",
            name: "Sugar Flower",
            icon: "🌸",
            type: "special",
            className: "decoration-flower"
        },

        {
            id: "cookie",
            name: "Cookie",
            icon: "🍪",
            type: "bakery",
            className: "decoration-cookie"
        },

        {
            id: "donut",
            name: "Donut",
            icon: "🍩",
            type: "bakery",
            className: "decoration-donut"
        }
    ];

    /* =====================================================
       STATE
    ===================================================== */

    let inventoryItems = [];

    let gachaCount = 0;

    let isRolling = false;

    const STORAGE_KEY =
        "sweet-gam-gacha-inventory";

    const COUNT_KEY =
        "sweet-gam-gacha-count";

    /* =====================================================
       LOAD SAVE DATA
    ===================================================== */

    function loadState() {

        try {

            const savedInventory =
                localStorage.getItem(STORAGE_KEY);

            const savedCount =
                localStorage.getItem(COUNT_KEY);

            if (savedInventory) {

                const parsed =
                    JSON.parse(savedInventory);

                if (Array.isArray(parsed)) {
                    inventoryItems = parsed;
                }
            }

            if (savedCount) {

                const count =
                    Number(savedCount);

                if (Number.isFinite(count)) {
                    gachaCount = count;
                }
            }

        } catch (error) {

            console.warn(
                "SweetGacha: Could not load saved state.",
                error
            );

        }

        renderInventory();
    }

    /* =====================================================
       SAVE STATE
    ===================================================== */

    function saveState() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(inventoryItems)
            );

            localStorage.setItem(
                COUNT_KEY,
                String(gachaCount)
            );

        } catch (error) {

            console.warn(
                "SweetGacha: Could not save state.",
                error
            );

        }
    }

    /* =====================================================
       RANDOM DECORATION
    ===================================================== */

    function getRandomDecoration() {

        const index =
            Math.floor(
                Math.random() * decorations.length
            );

        return {
            ...decorations[index]
        };
    }

    /* =====================================================
       CREATE INVENTORY ITEM
    ===================================================== */

    function createInventoryItem(item) {

        const wrapper =
            document.createElement("button");

        wrapper.type = "button";

        wrapper.className =
            "inventory-item";

        wrapper.dataset.decorationId =
            item.id;

        wrapper.dataset.decorationType =
            item.type;

        wrapper.setAttribute(
            "aria-label",
            `ใช้ ${item.name} ตกแต่งเค้ก`
        );

        wrapper.innerHTML = `
            <span class="inventory-item-icon">
                ${item.icon}
            </span>

            <span class="inventory-item-name">
                ${item.name}
            </span>
        `;

        wrapper.addEventListener(
            "click",
            () => {

                useDecoration(item);

            }
        );

        return wrapper;
    }

    /* =====================================================
       RENDER INVENTORY
    ===================================================== */

    function renderInventory() {

        if (!inventory) {
            return;
        }

        const items =
            inventory.querySelectorAll(
                ".inventory-item"
            );

        items.forEach(item => {
            item.remove();
        });

        if (
            inventoryItems.length === 0
        ) {

            if (inventoryEmpty) {
                inventoryEmpty.hidden = false;
            }

            return;
        }

        if (inventoryEmpty) {
            inventoryEmpty.hidden = true;
        }

        inventoryItems.forEach(item => {

            const element =
                createInventoryItem(item);

            inventory.appendChild(element);

        });
    }

    /* =====================================================
       ADD TO INVENTORY
    ===================================================== */

    function addToInventory(item) {

        inventoryItems.push({
            ...item,
            instanceId:
                `${item.id}-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 8)}`
        });

        saveState();
        renderInventory();

    }

    /* =====================================================
       REMOVE FROM INVENTORY
    ===================================================== */

    function removeFromInventory(
        instanceId
    ) {

        const index =
            inventoryItems.findIndex(
                item =>
                    item.instanceId === instanceId
            );

        if (index === -1) {
            return;
        }

        inventoryItems.splice(index, 1);

        saveState();
        renderInventory();
    }

    /* =====================================================
       GACHA DISPLAY
    ===================================================== */

    function displayResult(item) {

        if (!gachaDisplay) {
            return;
        }

        gachaDisplay.innerHTML = `
            <div class="gacha-result-item">
                <span class="gacha-result-icon">
                    ${item.icon}
                </span>

                <span class="gacha-result-name">
                    ${item.name}
                </span>
            </div>
        `;

        gachaDisplay.classList.remove(
            "gacha-result-pop",
            "gacha-result-rolling"
        );

        void gachaDisplay.offsetWidth;

        gachaDisplay.classList.add(
            "gacha-result-pop"
        );
    }

    /* =====================================================
       RESULT MESSAGE
    ===================================================== */

    function showResultMessage(item) {

        if (!gachaResult) {
            return;
        }

        gachaResult.innerHTML = `
            <span class="result-icon">
                ${item.icon}
            </span>

            <span>
                ได้รับ <strong>${item.name}</strong>!
            </span>
        `;

        gachaResult.classList.remove(
            "show"
        );

        void gachaResult.offsetWidth;

        gachaResult.classList.add(
            "show"
        );
    }

    /* =====================================================
       GACHA ANIMATION
    ===================================================== */

    async function rollGacha() {

        if (isRolling) {
            return;
        }

        isRolling = true;

        if (gachaButton) {
            gachaButton.disabled = true;
            gachaButton.classList.add(
                "is-rolling"
            );
        }

        if (gachaDisplay) {

            gachaDisplay.classList.remove(
                "gacha-result-pop"
            );

            gachaDisplay.classList.add(
                "gacha-result-rolling"
            );
        }

        /*
         * Small preview shuffle
         */

        const previewDuration = 850;

        const previewStart =
            Date.now();

        while (
            Date.now() - previewStart <
            previewDuration
        ) {

            const preview =
                getRandomDecoration();

            if (gachaDisplay) {

                gachaDisplay.innerHTML = `
                    <div class="gacha-result-item">
                        <span class="gacha-result-icon">
                            ${preview.icon}
                        </span>

                        <span class="gacha-result-name">
                            ${preview.name}
                        </span>
                    </div>
                `;
            }

            await wait(90);
        }

        /* Final result */

        const result =
            getRandomDecoration();

        gachaCount++;

        displayResult(result);

        showResultMessage(result);

        addToInventory(result);

        checkLuckyBaker();

        createGachaBurst();

        if (
            window.showToast &&
            typeof window.showToast === "function"
        ) {

            window.showToast(
                result.icon,
                `ได้รับ ${result.name} แล้ว!`
            );
        }

        saveState();

        await wait(500);

        if (gachaButton) {
            gachaButton.disabled = false;

            gachaButton.classList.remove(
                "is-rolling"
            );
        }

        isRolling = false;
    }

    /* =====================================================
       WAIT
    ===================================================== */

    function wait(ms) {

        return new Promise(
            resolve =>
                window.setTimeout(
                    resolve,
                    ms
                )
        );
    }

    /* =====================================================
       GACHA BURST
    ===================================================== */

    function createGachaBurst() {

        if (!gachaDisplay) {
            return;
        }

        const burst =
            document.createElement("div");

        burst.className =
            "gacha-burst";

        const icons = [
            "✨",
            "🍬",
            "🍭",
            "💗",
            "⭐",
            "🍓",
            "🧁",
            "🌸"
        ];

        icons.forEach(
            (icon, index) => {

                const particle =
                    document.createElement("span");

                particle.className =
                    "gacha-burst-particle";

                particle.textContent =
                    icon;

                const angle =
                    (360 / icons.length) *
                    index;

                particle.style.setProperty(
                    "--burst-angle",
                    `${angle}deg`
                );

                burst.appendChild(
                    particle
                );
            }
        );

        gachaDisplay.appendChild(
            burst
        );

        window.setTimeout(
            () => burst.remove(),
            1100
        );
    }

    /* =====================================================
       USE DECORATION
    ===================================================== */

    function useDecoration(item) {

        if (!item) {
            return;
        }

        /*
         * cake.js receives the decoration.
         */

        if (
            window.SweetCake &&
            typeof window.SweetCake.addDecoration ===
                "function"
        ) {

            const success =
                window.SweetCake.addDecoration(
                    item
                );

            if (success !== false) {

                if (item.instanceId) {
                    removeFromInventory(
                        item.instanceId
                    );
                }

                return;
            }
        }

        /*
         * If cake.js is not ready yet,
         * keep the item in inventory.
         */

        if (
            window.showToast &&
            typeof window.showToast === "function"
        ) {

            window.showToast(
                "🍰",
                "ไปที่พื้นที่ทำเค้กเพื่อใช้ของตกแต่งนะ!"
            );
        }
    }

    /* =====================================================
       LUCKY BAKER ACHIEVEMENT
    ===================================================== */

    function checkLuckyBaker() {

        if (gachaCount < 5) {
            return;
        }

        if (
            window.SweetAchievements &&
            typeof window.SweetAchievements.unlock ===
                "function"
        ) {

            window.SweetAchievements.unlock(
                "lucky-baker"
            );

            return;
        }

        /*
         * Fallback event for main.js
         */

        window.dispatchEvent(
            new CustomEvent(
                "sweetAchievement",
                {
                    detail: {
                        id: "lucky-baker",
                        title: "Lucky Baker",
                        description:
                            "สุ่มของตกแต่งครบ 5 ครั้งแล้ว!"
                    }
                }
            )
        );
    }

    /* =====================================================
       CLEAR INVENTORY
    ===================================================== */

    function clearInventory() {

        inventoryItems = [];

        saveState();
        renderInventory();
    }

    /* =====================================================
       GET INVENTORY
    ===================================================== */

    function getInventory() {

        return inventoryItems.map(
            item => ({ ...item })
        );
    }

    /* =====================================================
       GET GACHA COUNT
    ===================================================== */

    function getCount() {

        return gachaCount;
    }

    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.SweetGacha = {

        roll: rollGacha,

        add: addToInventory,

        remove: removeFromInventory,

        use: useDecoration,

        clear: clearInventory,

        getInventory,

        getCount,

        getDecorations() {
            return decorations.map(
                item => ({ ...item })
            );
        }

    };

    /* =====================================================
       BUTTON
    ===================================================== */

    if (gachaButton) {

        gachaButton.addEventListener(
            "click",
            rollGacha
        );
    }

    /* =====================================================
       THEME CHANGE
    ===================================================== */

    window.addEventListener(
        "sweetThemeChange",
        () => {

            /*
             * Re-render inventory so theme-dependent
             * classes/effects remain consistent.
             */

            renderInventory();
        }
    );

    /* =====================================================
       INITIALIZE
    ===================================================== */

    loadState();

})();
