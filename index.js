const rows = 13;
const cols = 20;

const enemies = [];
let player;

const rowsArray = [];
for (let i = 0; i < rows; i++) {
    rowsArray.push(i);
}

const colsArray = [];
for (let i = 0; i < cols; i++) {
    colsArray.push(i);
}

class Enemy {
    constructor(row, col) {
        this.HP = 100;
        this.ATK = 25;
        this.row = row;
        this.col = col;
        this.playerIsNear = false;

        $(`.tileE[data-row=${this.row}][data-col=${this.col}]`).html(
            `<div class="health" style="width: ${this.HP}%;">`
        );

        setInterval(() => this.observe(), 100);
        setInterval(() => this.attack(), 800);
        setInterval(() => this.move(), 1000);
    }

    observe() {
        this.playerIsNear = false;
        const enemyTilesAround = [
            $(`.tile[data-row=${this.row - 1}][data-col=${this.col}]`),
            $(`.tile[data-row=${this.row + 1}][data-col=${this.col}]`),
            $(`.tile[data-row=${this.row}][data-col=${this.col + 1}]`),
            $(`.tile[data-row=${this.row}][data-col=${this.col - 1}]`),
        ];

        enemyTilesAround.some((tile) => {
            if (tile.hasClass('tileP')) this.playerIsNear = true;
        });
    }

    attack() {
        if (this.HP <= 0) return;
        const enemyTilesAround = [
            $(`.tile[data-row=${this.row - 1}][data-col=${this.col}]`),
            $(`.tile[data-row=${this.row + 1}][data-col=${this.col}]`),
            $(`.tile[data-row=${this.row}][data-col=${this.col + 1}]`),
            $(`.tile[data-row=${this.row}][data-col=${this.col - 1}]`),
        ];

        enemyTilesAround.forEach((tile) => {
            if ($(tile).hasClass('tileP')) {
                player.HP = player.HP - this.ATK;
                if (player.HP <= 0) $(tile).removeClass('tileP');

                $(tile).children('.health').css('width', `${player.HP}%`);
            }
        });
    }

    move() {
        if (this.HP <= 0) return;
        if (this.playerIsNear) return;

        const enemyTile = $(
            `.tileE[data-row=${this.row}][data-col=${this.col}]`
        );

        let randomWays = [
            $(`.tile[data-row=${this.row - 1}][data-col=${this.col}]`),
            $(`.tile[data-row=${this.row + 1}][data-col=${this.col}]`),
            $(`.tile[data-row=${this.row}][data-col=${this.col - 1}]`),
            $(`.tile[data-row=${this.row}][data-col=${this.col + 1}]`),
        ];

        randomWays = randomWays.filter(
            (way) =>
                way.data('col') >= 0 &&
                way.data('row') >= 0 &&
                way.data('col') < cols &&
                way.data('row') < rows &&
                !way.hasClass('tileW') &&
                !way.hasClass('tileE')
        );

        if (!randomWays.length) return;

        const randomWayTile =
            randomWays[Math.floor(Math.random() * randomWays.length)];

        $(enemyTile).empty();

        $(enemyTile).removeClass('tileE');

        $(randomWayTile).addClass('tileE');

        this.col = $(randomWayTile).data('col');
        this.row = $(randomWayTile).data('row');

        $(randomWayTile).html(
            `<div class="health" style="width: ${this.HP}%;">`
        );
    }
}

class Hero {
    static HeroHP = 100;
    static HeroATK = 20;

    constructor(row, col) {
        this.HP = Hero.HeroHP;
        this.ATK = Hero.HeroATK;
        this.row = row;
        this.col = col;

        $(`.tileP[data-row=${this.row}][data-col=${this.col}]`).html(
            `<div class="health" style="width: ${this.HP}%;">`
        );
    }

    attack(currentPosCol, currentPosRow) {
        if (!this.HP) return;

        const heroTilesAround = [
            $(
                `.tile[data-row=${
                    currentPosRow - 1
                }][data-col=${currentPosCol}]`
            ),
            $(
                `.tile[data-row=${
                    currentPosRow + 1
                }][data-col=${currentPosCol}]`
            ),
            $(
                `.tile[data-row=${currentPosRow}][data-col=${
                    currentPosCol + 1
                }]`
            ),
            $(
                `.tile[data-row=${currentPosRow}][data-col=${
                    currentPosCol - 1
                }]`
            ),
        ];

        heroTilesAround.forEach((tile) => {
            if ($(tile).hasClass('tileE')) {
                const row = $(tile).data('row');
                const col = $(tile).data('col');

                const enemy = enemies.find((e) => e.row == row && e.col == col);

                enemy.HP = enemy.HP - player.ATK;
                if (enemy.HP <= 0) {
                    $(tile).removeClass('tileE');
                }

                $(tile).children('.health').css('width', `${enemy.HP}%`);
            }
        });
    }

    move(heroTile, newPosTile) {
        if (!this.HP) return;
        $(heroTile).empty();

        $(heroTile).removeClass('tileP');

        if (newPosTile.hasClass('tileHP')) {
            if (player.HP != Hero.HeroHP) {
                player.HP += 20;

                newPosTile.removeClass('tileHP');
            }

            if (player.HP > Hero.HeroHP) {
                player.HP = Hero.HeroHP;
            }
        }

        if (newPosTile.hasClass('tileSW')) {
            player.ATK += 10;
            newPosTile.removeClass('tileSW');
        }

        $(newPosTile).addClass('tileP');

        $(newPosTile).html(`<div class="health" style="width: ${this.HP}%;">`);
    }
}

class Game {
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
            const currentPosCol = player.col;
            const currentPosRow = player.row;
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

                    newPosTile = $(
                        `.tile[data-col=${currentPosCol}][data-row=${newPos}]`
                    );

                    player.row = newPos;

                    player.move(hero, newPosTile);

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

                    newPosTile = $(
                        `.tile[data-col=${newPos}][data-row=${currentPosRow}]`
                    );

                    player.col = newPos;

                    player.move(hero, newPosTile);

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

                    newPosTile = $(
                        `.tile[data-col=${currentPosCol}][data-row=${newPos}]`
                    );

                    player.row = newPos;

                    player.move(hero, newPosTile);

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

                    newPosTile = $(
                        `.tile[data-col=${newPos}][data-row=${currentPosRow}]`
                    );

                    player.col = newPos;

                    player.move(hero, newPosTile);

                    break;
                case 'Space':
                    e.preventDefault();
                    player.attack(currentPosCol, currentPosRow);
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

const placeObject = (type) => {
    let emptyTiles = [];
    let count = 0;
    let className = '';

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

            break;
        case 'enemies':
            emptyTiles = $('.tile')
                .not('.tileW')
                .not('.tileHP')
                .not('.tileSW')
                .not('.tileP');
            count = 10;
            className = 'tileE';

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

        switch (type) {
            case 'enemies':
                enemies.push(
                    new Enemy(
                        $(emptyTiles[index]).data('row'),
                        $(emptyTiles[index]).data('col')
                    )
                );
                break;

            case 'hero':
                player = new Hero(
                    $(emptyTiles[index]).data('row'),
                    $(emptyTiles[index]).data('col')
                );
                break;
        }
    }
};
