/* =========================================================
   SWEET GAM PORTFOLIO
   cake.js
   Interactive Cake Studio
========================================================= */

(() => {
    "use strict";

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const cakeStudio =
        document.getElementById("cakeStudio");

    const cakeCanvas =
        document.getElementById("cakeCanvas");

    const cake =
        document.getElementById("cake");

    const cakeCream =
        document.getElementById("cakeCream");

    const cakeDrip =
        document.getElementById("cakeDrip");

    const cakeToppings =
        document.getElementById("cakeToppings");

    const cakeDecorations =
        document.getElementById("cakeDecorations");

    const cakeSparkles =
        document.getElementById("cakeSparkles");

    const cakeHint =
        document.getElementById("cakeHint");

    const finishButton =
        document.getElementById("finishCakeButton");

    const resetButton =
        document.getElementById("resetCakeButton");

    const cakeBoxSection =
        document.getElementById("cakeBoxSection");

    const cakeBox =
        document.getElementById("cakeBox");

    const finalGiftMessage =
        document.getElementById("finalGiftMessage");

    /* =====================================================
       CONTROLS
    ===================================================== */

    const layerButtons =
        document.querySelectorAll(
            '[data-cake-layer]'
        );

    const flavorButtons =
        document.querySelectorAll(
            '[data-cake-flavor]'
        );

    const creamButtons =
        document.querySelectorAll(
            '[data-cake-cream]'
        );

    const toppingButtons =
        document.querySelectorAll(
            '[data-cake-topping]'
        );

    const dripToggle =
        document.getElementById(
            "dripToggle"
        );

    /* =====================================================
       STATE
    ===================================================== */

    const STORAGE_KEY =
        "sweet-gam-cake-state";

    const defaultState = {
        layer: 3,
        flavor: "vanilla",
        cream: "strawberry",
        topping: "fruit",
        drip: true,
        decorations: [],
        finished: false,
        boxed: false
    };

    let state = loadState();

    let draggingDecoration = null;

    let cakeHasBeenFinished = false;

    let cakeHasBeenBoxed = false;

    /* =====================================================
       DATA
    ===================================================== */

    const flavorData = {

        vanilla: {
            name: "Vanilla",
            emoji: "🍦",
            colors: [
                "#fff4dc",
                "#ffe8bd",
                "#fff8ea"
            ]
        },

        chocolate: {
            name: "Chocolate",
            emoji: "🍫",
            colors: [
                "#6f402c",
                "#8d553a",
                "#b87851"
            ]
        },

        strawberry: {
            name: "Strawberry",
            emoji: "🍓",
            colors: [
                "#ff9fb8",
                "#ff739a",
                "#ffd0dc"
            ]
        }

    };

    const creamData = {

        strawberry: {
            name: "Strawberry",
            icon: "🍓"
        },

        chocolate: {
            name: "Chocolate",
            icon: "🍫"
        },

        vanilla: {
            name: "Vanilla",
            icon: "🍦"
        },

        rainbow: {
            name: "Rainbow",
            icon: "🌈"
        }

    };

    const toppingData = {

        fruit: {
            name: "Fruit",
            icon: "🍓🍒🫐"
        },

        chocolate: {
            name: "Chocolate",
            icon: "🍫"
        },

        candy: {
            name: "Candy",
            icon: "🍬🍭"
        },

        sprinkles: {
            name: "Sprinkles",
            icon: "🌈"
        }

    };

    /* =====================================================
       UTILITIES
    ===================================================== */

    function cloneDefaultState() {

        return {
            layer: defaultState.layer,
            flavor: defaultState.flavor,
            cream: defaultState.cream,
            topping: defaultState.topping,
            drip: defaultState.drip,
            decorations: [],
            finished: false,
            boxed: false
        };
    }

    function wait(ms) {

        return new Promise(
            resolve =>
                window.setTimeout(
                    resolve,
                    ms
                )
        );
    }

    function saveState() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(state)
            );

        } catch (error) {

            console.warn(
                "SweetCake: unable to save state.",
                error
            );
        }
    }

    function loadState() {

        try {

            const saved =
                localStorage.getItem(
                    STORAGE_KEY
                );

            if (!saved) {
                return cloneDefaultState();
            }

            const parsed =
                JSON.parse(saved);

            return {
                ...cloneDefaultState(),
                ...parsed,
                decorations:
                    Array.isArray(
                        parsed.decorations
                    )
                        ? parsed.decorations
                        : []
            };

        } catch (error) {

            console.warn(
                "SweetCake: unable to load state.",
                error
            );

            return cloneDefaultState();
        }
    }

    /* =====================================================
       CONTROL ACTIVE STATE
    ===================================================== */

    function updateActiveButtons() {

        layerButtons.forEach(
            button => {

                const value =
                    Number(
                        button.dataset.cakeLayer
                    );

                button.classList.toggle(
                    "active",
                    value === Number(state.layer)
                );
            }
        );

        flavorButtons.forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.cakeFlavor ===
                    state.flavor
                );
            }
        );

        creamButtons.forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.cakeCream ===
                    state.cream
                );
            }
        );

        toppingButtons.forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.cakeTopping ===
                    state.topping
                );
            }
        );

        if (dripToggle) {

            dripToggle.checked =
                Boolean(state.drip);
        }
    }

    /* =====================================================
       CAKE LAYERS
    ===================================================== */

    function updateLayers() {

        if (!cake) {
            return;
        }

        const layers =
            cake.querySelectorAll(
                ".cake-layer"
            );

        layers.forEach(
            (layer, index) => {

                const layerNumber =
                    index + 1;

                layer.hidden =
                    layerNumber >
                    Number(state.layer);

                layer.classList.toggle(
                    "is-visible",
                    layerNumber <=
                    Number(state.layer)
                );
            }
        );

        cake.dataset.layers =
            String(state.layer);
    }

    /* =====================================================
       CAKE FLAVOR
    ===================================================== */

    function updateFlavor() {

        if (!cake) {
            return;
        }

        const data =
            flavorData[state.flavor] ||
            flavorData.vanilla;

        cake.dataset.flavor =
            state.flavor;

        cake.style.setProperty(
            "--cake-flavor-1",
            data.colors[0]
        );

        cake.style.setProperty(
            "--cake-flavor-2",
            data.colors[1]
        );

        cake.style.setProperty(
            "--cake-flavor-3",
            data.colors[2]
        );
    }

    /* =====================================================
       CREAM
    ===================================================== */

    function updateCream() {

        if (!cakeCream) {
            return;
        }

        cakeCream.dataset.cream =
            state.cream;

        const data =
            creamData[state.cream] ||
            creamData.strawberry;

        cakeCream.setAttribute(
            "aria-label",
            `${data.name} cream`
        );

        cakeCream.innerHTML = `
            <span class="cream-swirl">
                ${data.icon}
            </span>
        `;
    }

    /* =====================================================
       TOPPINGS
    ===================================================== */

    function updateToppings() {

        if (!cakeToppings) {
            return;
        }

        const data =
            toppingData[state.topping] ||
            toppingData.fruit;

        cakeToppings.dataset.topping =
            state.topping;

        cakeToppings.innerHTML = `
            <span class="topping-main">
                ${data.icon}
            </span>
        `;
    }

    /* =====================================================
       DRIP
    ===================================================== */

    function updateDrip() {

        if (!cakeDrip) {
            return;
        }

        cakeDrip.classList.toggle(
            "is-active",
            Boolean(state.drip)
        );

        cakeDrip.hidden =
            !state.drip;

        cakeDrip.dataset.flavor =
            state.cream;
    }

    /* =====================================================
       RENDER DECORATIONS
    ===================================================== */

    function renderDecorations() {

        if (!cakeDecorations) {
            return;
        }

        cakeDecorations.innerHTML = "";

        state.decorations.forEach(
            decoration => {

                const item =
                    document.createElement("button");

                item.type = "button";

                item.className =
                    "placed-decoration";

                item.dataset.decorationId =
                    decoration.id;

                item.dataset.instanceId =
                    decoration.instanceId || "";

                item.dataset.type =
                    decoration.type || "";

                item.textContent =
                    decoration.icon || "✨";

                item.setAttribute(
                    "aria-label",
                    decoration.name ||
                    "Cake decoration"
                );

                item.style.left =
                    `${decoration.x}%`;

                item.style.top =
                    `${decoration.y}%`;

                item.style.transform =
                    `translate(-50%, -50%) rotate(${decoration.rotation || 0}deg)`;

                enablePlacedDecorationDrag(
                    item,
                    decoration
                );

                cakeDecorations.appendChild(
                    item
                );
            }
        );
    }

    /* =====================================================
       CREATE DECORATION
    ===================================================== */

    function addDecoration(
        decoration
    ) {

        if (!decoration) {
            return false;
        }

        const item = {

            id:
                decoration.id ||
                "sweet",

            name:
                decoration.name ||
                "Sweet",

            icon:
                decoration.icon ||
                "✨",

            type:
                decoration.type ||
                "special",

            instanceId:
                decoration.instanceId ||
                `${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 8)}`,

            x:
                50 +
                (Math.random() * 30 - 15),

            y:
                38 +
                (Math.random() * 28 - 14),

            rotation:
                Math.random() * 24 - 12
        };

        state.decorations.push(
            item
        );

        renderDecorations();

        saveState();

        sparkleAtCake(
            item.x,
            item.y
        );

        return true;
    }

    /* =====================================================
       REMOVE DECORATION
    ===================================================== */

    function removeDecoration(
        instanceId
    ) {

        const index =
            state.decorations.findIndex(
                item =>
                    item.instanceId ===
                    instanceId
            );

        if (index === -1) {
            return;
        }

        state.decorations.splice(
            index,
            1
        );

        renderDecorations();

        saveState();
    }

    /* =====================================================
       DRAG PLACED DECORATION
    ===================================================== */

    function enablePlacedDecorationDrag(
        element,
        data
    ) {

        let pointerId = null;

        function move(event) {

            if (
                pointerId === null ||
                event.pointerId !== pointerId
            ) {
                return;
            }

            if (!cakeCanvas) {
                return;
            }

            const rect =
                cakeCanvas.getBoundingClientRect();

            let x =
                ((event.clientX - rect.left) /
                    rect.width) *
                100;

            let y =
                ((event.clientY - rect.top) /
                    rect.height) *
                100;

            x = Math.max(
                8,
                Math.min(92, x)
            );

            y = Math.max(
                8,
                Math.min(82, y)
            );

            data.x = x;
            data.y = y;

            element.style.left =
                `${x}%`;

            element.style.top =
                `${y}%`;
        }

        function stop(event) {

            if (
                pointerId === null ||
                event.pointerId !== pointerId
            ) {
                return;
            }

            pointerId = null;

            element.releasePointerCapture?.(
                event.pointerId
            );

            saveState();

            element.classList.remove(
                "is-dragging"
            );

            window.removeEventListener(
                "pointermove",
                move
            );

            window.removeEventListener(
                "pointerup",
                stop
            );

            window.removeEventListener(
                "pointercancel",
                stop
            );
        }

        element.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                pointerId =
                    event.pointerId;

                element.setPointerCapture?.(
                    pointerId
                );

                element.classList.add(
                    "is-dragging"
                );

                window.addEventListener(
                    "pointermove",
                    move
                );

                window.addEventListener(
                    "pointerup",
                    stop
                );

                window.addEventListener(
                    "pointercancel",
                    stop
                );
            }
        );

        element.addEventListener(
            "dblclick",
            () => {

                removeDecoration(
                    data.instanceId
                );
            }
        );
    }

    /* =====================================================
       DRAG FROM GACHA INVENTORY
    ===================================================== */

    function enableInventoryDrag() {

        if (!cakeCanvas) {
            return;
        }

        document.addEventListener(
            "pointerdown",
            event => {

                const item =
                    event.target.closest(
                        ".inventory-item"
                    );

                if (!item) {
                    return;
                }

                draggingDecoration = {
                    id:
                        item.dataset.decorationId
                };
            }
        );

        document.addEventListener(
            "pointerup",
            event => {

                if (!draggingDecoration) {
                    return;
                }

                const rect =
                    cakeCanvas.getBoundingClientRect();

                const inside =
                    event.clientX >= rect.left &&
                    event.clientX <= rect.right &&
                    event.clientY >= rect.top &&
                    event.clientY <= rect.bottom;

                if (inside) {

                    const inventory =
                        window.SweetGacha?.getInventory?.() ||
                        [];

                    const found =
                        inventory.find(
                            item =>
                                item.instanceId ===
                                draggingDecoration.instanceId
                        );

                    if (found) {

                        addDecoration(
                            found
                        );

                        window.SweetGacha?.remove?.(
                            found.instanceId
                        );
                    }
                }

                draggingDecoration = null;
            }
        );
    }

    /* =====================================================
       DROP USING CUSTOM DRAG
    ===================================================== */

    function setupInventoryDrag() {

        document.addEventListener(
            "dragstart",
            event => {

                const item =
                    event.target.closest(
                        ".inventory-item"
                    );

                if (!item) {
                    return;
                }

                draggingDecoration = {
                    instanceId:
                        item.dataset.instanceId,
                    id:
                        item.dataset.decorationId
                };

                event.dataTransfer?.setData(
                    "text/plain",
                    item.dataset.instanceId || ""
                );
            }
        );

        if (cakeCanvas) {

            cakeCanvas.addEventListener(
                "dragover",
                event => {
                    event.preventDefault();
                }
            );

            cakeCanvas.addEventListener(
                "drop",
                event => {

                    event.preventDefault();

                    if (!draggingDecoration) {
                        return;
                    }

                    const inventory =
                        window.SweetGacha?.getInventory?.() ||
                        [];

                    const found =
                        inventory.find(
                            item =>
                                item.instanceId ===
                                draggingDecoration.instanceId
                        );

                    if (found) {

                        const rect =
                            cakeCanvas.getBoundingClientRect();

                        const x =
                            ((event.clientX - rect.left) /
                                rect.width) *
                            100;

                        const y =
                            ((event.clientY - rect.top) /
                                rect.height) *
                            100;

                        found.x =
                            Math.max(
                                8,
                                Math.min(92, x)
                            );

                        found.y =
                            Math.max(
                                8,
                                Math.min(82, y)
                            );

                        state.decorations.push(
                            found
                        );

                        window.SweetGacha?.remove?.(
                            found.instanceId
                        );

                        renderDecorations();

                        sparkleAtCake(
                            found.x,
                            found.y
                        );

                        saveState();
                    }

                    draggingDecoration = null;
                }
            );
        }
    }

    /* =====================================================
       CAKE SPARKLES
    ===================================================== */

    function sparkleAtCake(
        x = 50,
        y = 45
    ) {

        if (!cakeSparkles) {
            return;
        }

        const sparkle =
            document.createElement("span");

        sparkle.className =
            "cake-sparkle-particle";

        sparkle.textContent =
            ["✨", "✦", "♡", "⭐"][
                Math.floor(
                    Math.random() * 4
                )
            ];

        sparkle.style.left =
            `${x}%`;

        sparkle.style.top =
            `${y}%`;

        cakeSparkles.appendChild(
            sparkle
        );

        window.setTimeout(
            () => sparkle.remove(),
            1000
        );
    }

    /* =====================================================
       FINISH CAKE
    ===================================================== */

    async function finishCake() {

        if (cakeHasBeenFinished) {
            return;
        }

        cakeHasBeenFinished = true;

        state.finished = true;

        saveState();

        if (cake) {

            cake.classList.add(
                "cake-finished"
            );
        }

        if (cakeHint) {

            cakeHint.textContent =
                "เค้กเสร็จแล้ว! ลากเค้กลงกล่องของขวัญได้เลย 🎁";
        }

        createCelebration();

        await wait(900);

        if (cakeBoxSection) {

            cakeBoxSection.hidden =
                false;

            cakeBoxSection.classList.add(
                "is-visible"
            );

            cakeBoxSection.scrollIntoView({
                behavior:
                    "smooth",
                block:
                    "center"
            });
        }

        showToast(
            "🎂",
            "เค้กของแก้มเสร็จแล้ว! 💗"
        );
    }

    /* =====================================================
       CELEBRATION
    ===================================================== */

    function createCelebration() {

        const container =
            cakeCanvas ||
            cakeStudio ||
            document.body;

        const icons = [
            "✨",
            "💗",
            "🍓",
            "🍭",
            "🍰",
            "🌸",
            "⭐",
            "🍬"
        ];

        for (
            let i = 0;
            i < 24;
            i++
        ) {

            const particle =
                document.createElement("span");

            particle.className =
                "cake-celebration-particle";

            particle.textContent =
                icons[
                    Math.floor(
                        Math.random() *
                        icons.length
                    )
                ];

            particle.style.left =
                `${40 + Math.random() * 20}%`;

            particle.style.top =
                `${35 + Math.random() * 20}%`;

            particle.style.setProperty(
                "--x",
                `${(Math.random() - .5) * 280}px`
            );

            particle.style.setProperty(
                "--y",
                `${(Math.random() - .5) * 240}px`
            );

            container.appendChild(
                particle
            );

            window.setTimeout(
                () => particle.remove(),
                1500
            );
        }
    }

    /* =====================================================
       CAKE BOX
    ===================================================== */

    function setupCakeBox() {

        if (!cakeBox) {
            return;
        }

        cakeBox.addEventListener(
            "dragover",
            event => {

                if (
                    !cakeHasBeenFinished
                ) {
                    return;
                }

                event.preventDefault();

                cakeBox.classList.add(
                    "is-drag-over"
                );
            }
        );

        cakeBox.addEventListener(
            "dragleave",
            () => {

                cakeBox.classList.remove(
                    "is-drag-over"
                );
            }
        );

        cakeBox.addEventListener(
            "drop",
            event => {

                event.preventDefault();

                cakeBox.classList.remove(
                    "is-drag-over"
                );

                if (
                    !cakeHasBeenFinished
                ) {
                    return;
                }

                boxCake();
            }
        );

        /*
         * Also allow tapping/clicking the box
         * after the cake is finished.
         */

        cakeBox.addEventListener(
            "click",
            () => {

                if (
                    cakeHasBeenFinished &&
                    !cakeHasBeenBoxed
                ) {
                    boxCake();
                }
            }
        );
    }

    /* =====================================================
       DRAG CAKE INTO BOX
    ===================================================== */

    function setupCakeDragging() {

        if (!cake) {
            return;
        }

        cake.draggable = true;

        cake.addEventListener(
            "dragstart",
            event => {

                if (
                    !cakeHasBeenFinished
                ) {
                    event.preventDefault();
                    return;
                }

                event.dataTransfer?.setData(
                    "text/plain",
                    "finished-cake"
                );

                cake.classList.add(
                    "is-dragging"
                );
            }
        );

        cake.addEventListener(
            "dragend",
            () => {

                cake.classList.remove(
                    "is-dragging"
                );
            }
        );
    }

    /* =====================================================
       BOX THE CAKE
    ===================================================== */

    async function boxCake() {

        if (
            cakeHasBeenBoxed ||
            !cakeHasBeenFinished
        ) {
            return;
        }

        cakeHasBeenBoxed = true;

        state.boxed = true;

        saveState();

        if (cake) {

            cake.classList.add(
                "cake-boxed"
            );
        }

        if (cakeBox) {

            cakeBox.classList.add(
                "box-open"
            );
        }

        await wait(500);

        if (cakeBox) {

            cakeBox.classList.add(
                "box-complete"
            );
        }

        createCelebration();

        await wait(600);

        if (finalGiftMessage) {

            finalGiftMessage.hidden =
                false;

            finalGiftMessage.classList.add(
                "show"
            );

            finalGiftMessage.scrollIntoView({
                behavior:
                    "smooth",
                block:
                    "center"
            });
        }

        unlockLittleBaker();

        showToast(
            "🎁",
            "ส่งเค้กเป็นของขวัญเรียบร้อยแล้ว! 💗"
        );
    }

    /* =====================================================
       LITTLE BAKER ACHIEVEMENT
    ===================================================== */

    function unlockLittleBaker() {

        if (
            window.SweetAchievements &&
            typeof window.SweetAchievements.unlock ===
                "function"
        ) {

            window.SweetAchievements.unlock(
                "little-baker"
            );

            return;
        }

        window.dispatchEvent(
            new CustomEvent(
                "sweetAchievement",
                {
                    detail: {
                        id: "little-baker",
                        title: "Little Baker",
                        description:
                            "สร้างและส่งเค้กสำเร็จแล้ว!"
                    }
                }
            )
        );
    }

    /* =====================================================
       RESET
    ===================================================== */

    function resetCake() {

        state =
            cloneDefaultState();

        cakeHasBeenFinished =
            false;

        cakeHasBeenBoxed =
            false;

        saveState();

        renderAll();

        if (cakeBoxSection) {

            cakeBoxSection.hidden =
                true;

            cakeBoxSection.classList.remove(
                "is-visible"
            );
        }

        if (finalGiftMessage) {

            finalGiftMessage.hidden =
                true;

            finalGiftMessage.classList.remove(
                "show"
            );
        }

        if (cake) {

            cake.classList.remove(
                "cake-finished",
                "cake-boxed"
            );
        }

        if (cakeHint) {

            cakeHint.textContent =
                "เลือกของตกแต่งจากด้านข้าง แล้วลากลงบนเค้กได้เลย ✨";
        }

        showToast(
            "🧁",
            "เริ่มทำเค้กใหม่แล้ว!"
        );
    }

    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(
        icon,
        message
    ) {

        if (
            window.showToast &&
            typeof window.showToast ===
                "function"
        ) {

            window.showToast(
                icon,
                message
            );

            return;
        }

        const toastElement =
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
            !toastElement ||
            !toastIcon ||
            !toastMessage
        ) {
            return;
        }

        toastIcon.textContent =
            icon;

        toastMessage.textContent =
            message;

        toastElement.classList.add(
            "show"
        );

        window.setTimeout(
            () => {

                toastElement.classList.remove(
                    "show"
                );

            },
            2600
        );
    }

    /* =====================================================
       CONTROL EVENTS
    ===================================================== */

    layerButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const value =
                        Number(
                            button.dataset.cakeLayer
                        );

                    if (
                        value >= 1 &&
                        value <= 3
                    ) {

                        state.layer =
                            value;

                        updateLayers();
                        updateActiveButtons();
                        saveState();
                    }
                }
            );
        }
    );

    flavorButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const value =
                        button.dataset.cakeFlavor;

                    if (
                        flavorData[value]
                    ) {

                        state.flavor =
                            value;

                        updateFlavor();
                        updateActiveButtons();
                        saveState();
                    }
                }
            );
        }
    );

    creamButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const value =
                        button.dataset.cakeCream;

                    if (
                        creamData[value]
                    ) {

                        state.cream =
                            value;

                        updateCream();
                        updateDrip();
                        updateActiveButtons();
                        saveState();
                    }
                }
            );
        }
    );

    toppingButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const value =
                        button.dataset.cakeTopping;

                    if (
                        toppingData[value]
                    ) {

                        state.topping =
                            value;

                        updateToppings();
                        updateActiveButtons();
                        saveState();
                    }
                }
            );
        }
    );

    if (dripToggle) {

        dripToggle.addEventListener(
            "change",
            () => {

                state.drip =
                    dripToggle.checked;

                updateDrip();
                saveState();
            }
        );
    }

    if (finishButton) {

        finishButton.addEventListener(
            "click",
            finishCake
        );
    }

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetCake
        );
    }

    /* =====================================================
       DRAG SUPPORT
    ===================================================== */

    enableInventoryDrag();
    setupInventoryDrag();
    setupCakeDragging();
    setupCakeBox();

    /* =====================================================
       RENDER ALL
    ===================================================== */

    function renderAll() {

        updateLayers();
        updateFlavor();
        updateCream();
        updateToppings();
        updateDrip();
        updateActiveButtons();
        renderDecorations();

        cakeHasBeenFinished =
            Boolean(state.finished);

        cakeHasBeenBoxed =
            Boolean(state.boxed);

        if (cake) {

            cake.classList.toggle(
                "cake-finished",
                cakeHasBeenFinished
            );

            cake.classList.toggle(
                "cake-boxed",
                cakeHasBeenBoxed
            );
        }

        if (cakeBoxSection) {

            cakeBoxSection.hidden =
                !cakeHasBeenFinished;
        }

        if (finalGiftMessage) {

            finalGiftMessage.hidden =
                !cakeHasBeenBoxed;
        }
    }

    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.SweetCake = {

        addDecoration,

        removeDecoration,

        finish:
            finishCake,

        reset:
            resetCake,

        box:
            boxCake,

        getState() {

            return {
                ...state,
                decorations:
                    state.decorations.map(
                        item => ({ ...item })
                    )
            };
        },

        isFinished() {

            return cakeHasBeenFinished;
        },

        isBoxed() {

            return cakeHasBeenBoxed;
        }

    };

    /* =====================================================
       INIT
    ===================================================== */

    renderAll();

})();
