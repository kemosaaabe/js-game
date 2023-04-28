const rows = 13;
const cols = 20;

const rowsArray = [];
for (let i = 0; i < rows; i++) {
    rowsArray.push(i);
}

const colsArray = [];
for (let i = 0; i < cols; i++) {
    colsArray.push(i);
}

class Game {
    constructor() {
        this.heroHP = 100;
        this.heroATK = 20;

        this.enemyHP = 100;
        this.enemyATK = 10;
    }

    init() {
        $('.field').empty();

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                $('.field').append(
                    $(
                        `<div data-row=${j} data-col=${i} class="tile tileW" style="top: ${
                            j * 50
                        }px; left: ${i * 50}px"></div>`
                    )
                );
            }
        }

        createRoom();
        createPasses('col');
        createPasses('row');
        placeObject('swords');
        placeObject('health');
        placeObject('hero');
        placeObject('enemies');

        $(document).keydown((e) => {
            const currentPosCol = $('.tileP').data('col');
            const currentPosRow = $('.tileP').data('row');
            const hero = $('.tileP');
            let newPos;
            let newPosTile;

            switch (e.code) {
                case 'KeyW':
                    newPos = currentPosRow - 1;
                    if (
                        $(
                            `.tile[data-col=${currentPosCol}][data-row=${newPos}]`
                        ).hasClass('tileW') ||
                        $(
                            `.tile[data-col=${currentPosCol}][data-row=${newPos}]`
                        ).hasClass('tileE')
                    ) {
                        return false;
                    }

                    if (currentPosRow === 0) {
                        return false;
                    }

                    $(hero).empty();

                    $(hero).removeClass('tileP');

                    newPosTile = $(
                        `.tile[data-col=${currentPosCol}][data-row=${newPos}]`
                    );

                    $(newPosTile).addClass('tileP');

                    $(newPosTile).html(
                        `<div class="health" style="width: ${this.heroHP}%;">`
                    );

                    break;
                case 'KeyA':
                    newPos = currentPosCol - 1;
                    if (
                        $(
                            `.tile[data-col=${newPos}][data-row=${currentPosRow}]`
                        ).hasClass('tileW') ||
                        $(
                            `.tile[data-col=${newPos}][data-row=${currentPosRow}]`
                        ).hasClass('tileE')
                    ) {
                        return false;
                    }

                    if (currentPosCol === 0) {
                        return false;
                    }

                    $(hero).empty();

                    $(hero).removeClass('tileP');

                    newPosTile = $(
                        `.tile[data-col=${newPos}][data-row=${currentPosRow}]`
                    );

                    $(newPosTile).addClass('tileP');
                    $(newPosTile).html(
                        `<div class="health" style="width: ${this.heroHP}%;">`
                    );

                    break;
                case 'KeyS':
                    newPos = currentPosRow + 1;
                    if (
                        $(
                            `.tile[data-col=${currentPosCol}][data-row=${newPos}]`
                        ).hasClass('tileW') ||
                        $(
                            `.tile[data-col=${currentPosCol}][data-row=${newPos}]`
                        ).hasClass('tileE')
                    ) {
                        return false;
                    }

                    if (currentPosRow === rows - 1) {
                        return false;
                    }

                    $(hero).empty();

                    $(hero).removeClass('tileP');

                    newPosTile = $(
                        `.tile[data-col=${currentPosCol}][data-row=${newPos}]`
                    );

                    $(newPosTile).addClass('tileP');
                    $(newPosTile).html(
                        `<div class="health" style="width: ${this.heroHP}%;">`
                    );

                    break;
                case 'KeyD':
                    newPos = currentPosCol + 1;
                    if (
                        $(
                            `.tile[data-col=${newPos}][data-row=${currentPosRow}]`
                        ).hasClass('tileW') ||
                        $(
                            `.tile[data-col=${newPos}][data-row=${currentPosRow}]`
                        ).hasClass('tileE')
                    ) {
                        return false;
                    }

                    if (currentPosCol === cols - 1) {
                        return false;
                    }

                    $(hero).empty();

                    $(hero).removeClass('tileP');

                    newPosTile = $(
                        `.tile[data-col=${newPos}][data-row=${currentPosRow}]`
                    );

                    $(newPosTile).addClass('tileP');
                    $(newPosTile).html(
                        `<div class="health" style="width: ${this.heroHP}%;">`
                    );

                    break;
                case 'Space':
                    e.preventDefault();
            }
        });
    }
}

const createRoom = () => {
    for (let i = 0; i < Math.floor(Math.random() * 6) + 5; i++) {
        const randomCol = Math.floor(Math.random() * (cols + 1));
        const randomRow = Math.floor(Math.random() * (rows + 1));
        const randomWidth = Math.floor(Math.random() * (5 + 1)) + 3;
        const randomHeight = Math.floor(Math.random() * (5 + 1)) + 3;

        for (let i = randomRow + 1; i < randomHeight + randomRow; i++) {
            for (let j = randomCol + 1; j < randomWidth + randomCol; j++) {
                $(`.tile[data-col=${j}][data-row=${i}]`).removeClass('tileW');
            }
        }
    }
};

const createPasses = (type) => {
    const randomPasses = Math.floor(Math.random() * 3) + 3;
    const passArray = [];
    let passArrayLength = 0;

    let typeArray = [];
    switch (type) {
        case 'col':
            typeArray = colsArray;
            break;
        case 'row':
            typeArray = rowsArray;
            break;
    }

    while (passArrayLength != randomPasses) {
        const randomPass =
            typeArray[Math.floor(Math.random() * typeArray.length)];

        if (
            passArray.includes(randomPass) ||
            passArray.includes(randomPass + 1) ||
            passArray.includes(randomPass - 1)
        )
            continue;

        passArray.push(randomPass);
        passArrayLength++;
    }

    for (let i = 0; i < passArray.length; i++) {
        $(`.tile[data-${type}=${passArray[i]}]`).removeClass('tileW');
    }
};

const placeObject = (type, stats = null) => {
    let emptyTiles = [];
    let count = 0;
    let className = '';
    let html = '';

    switch (type) {
        case 'health':
            emptyTiles = $('.tile').not('.tileW').not('.tileSW');
            count = 10;
            className = 'tileHP';
            break;
        case 'swords':
            emptyTiles = $('.tile').not('.tileW').not('.tileHP');
            count = 2;
            className = 'tileSW';
            break;
        case 'hero':
            emptyTiles = $('.tile').not('.tileW').not('.tileSW').not('.tileHP');
            count = 1;
            className = 'tileP';

            html = `<div class="health" style="width: ${100}%;">`;

            break;
        case 'enemies':
            emptyTiles = $('.tile')
                .not('.tileW')
                .not('.tileHP')
                .not('.tileSW')
                .not('.tileP');
            count = 10;
            className = 'tileE';
            html = `<div class="health" style="width: ${100}%;">`;

            break;
    }

    const emptyTilesIndexes = [];

    let i = 0;
    while (i < count) {
        const randomIndex = Math.floor(Math.random() * emptyTiles.length);

        if (emptyTilesIndexes.includes(randomIndex)) continue;

        emptyTilesIndexes.push(randomIndex);
        i++;
    }

    for (let index of emptyTilesIndexes) {
        $(emptyTiles[index]).addClass(className);
        $(emptyTiles[index]).html(html);
    }
};
