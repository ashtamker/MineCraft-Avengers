const hero = document.querySelector('.hero');
const slider = document.querySelector('.slider');
const logo = document.querySelector('#logo');
const inst = document.querySelector('#inst');

const tl = new TimelineMax();
tl.fromTo(hero,1, {height: "0%"}, {height: "90%", ease: Power2.easeInOut})
.fromTo(hero, 1.2, {width: "100%"}, {width: "90%",ease: Power2.easeInOut})

// .formTo(slider, 1.2, {x: "-200%"}, {x: "0%", ease: Power2.easeInOut}, "-=1.2")
// .formTo(logo, 0.5, {opacity: 0, x:30}, {opacity: 1, x:0}, "-=0.5")
// .formTo(inst, 0.5, {opacity: 0, x:30}, {opacity: 1, x:0}, "-=0.5");


const gameMap = document.querySelector('.game-board-map');
const lastMindedTileElement = document.querySelector('.tools-sidebar__lastMindedTile');
const tools = document.querySelectorAll('.tool');
const menu = document.querySelector('.menu');
const startBtn = document.querySelector('.menu__btn');


const state = {
    gameStart: false,
    worldMatrix: [],
    selectedTool: 8, 
    lastMindedTile: 8, 
}

const startGame = () => {
    menu.style.display = 'none';
}
const createWorld = (mat, tileOnClickHandler) => {
    for (let i = 0; i < mat.length; i++) {
        const line = document.createElement('div');
        line.classList.add('row');

        for (let j = 0; j < mat[i].length; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');

            for (const [key, value] of Object.entries(mat[i][j])) {
                tile.dataset[key] = value;
            }
            
            tile.addEventListener('click', tileOnClickHandler);
            line.appendChild(tile);
        }

        gameMap.appendChild(line);
    }
}

const createMatrix = (row, col) => {

    let mat = [];
    for (let i = 0; i < row; i++) {
        const board = [];
        for (let j = 0; j < col; j++) {
            board.push({})

        }
        mat.push(board);
    }

    const dirtLevel = row - parseInt((Math.floor((Math.random() * 4) ) * .1) * row);
    
    for (let i = row - 1; i >= 0; i--) {
      
        for (let j = 0; j < col; j++) {
            const tile = {};
            tile.col = j;
            tile.row = i;
            if (i >= dirtLevel) {
                tile.type = 0;
            } else if (i === dirtLevel - 1) {
                tile.type = 1;

            } else if (i === dirtLevel - 2) {
                if (j >= col - 2) {
                    mat[i][j] = {
                        type: -1,
                        col: j,
                        row: i
                    };
                    mat[i - 1][j] = {
                        type: -1,
                        col: j ,
                        row: i -1
                    };
                    mat[i - 2][j] = {
                        type: -1,
                        col: j ,
                        row: i -2
                    };

                } else {
                    const rand = getRandom9();
                    mat[i - 2][j] = {
                        type: rand[0],
                        col: j ,
                        row: i -2
                    };
                    mat[i - 2][j + 1] = {
                        type: rand[1],
                        col: j + 1,
                        row: i - 2
                    };
                    mat[i - 2][j + 2] = {
                        type: rand[2],
                        col: j + 2,
                        row: i - 2
                    };
                    mat[i - 1][j] = {
                        type: rand[3],
                        col: j ,
                        row: i -1
                    };
                    mat[i - 1][j + 1] = {
                        type: rand[4],
                        col: j + 1,
                        row: i - 1
                    };
                    mat[i - 1][j + 2] = {
                        type: rand[5],
                        col: j +2,
                        row: i -1
                    };
                    mat[i][j] = {
                        type: rand[6],
                        col: j,
                        row: i
                    };
                    mat[i][j + 1] = {
                        type: rand[7],
                        col: j+1,
                        row: i 
                    };
                    mat[i][j + 2] = {
                        type: rand[8],
                        col: j +2,
                        row: i 
                    };
                    j += 2;
                }

                continue;


            } else {
                tile.type = -1;
            }

            mat[i][j] = tile;

        }

        if (i === dirtLevel - 2) {
            i -= 2;

        };

    }
    console.log(mat);
    return mat;
}

//return mat of 3*3 of environment options
getRandom9 = () => {
    const kind = Math.floor((Math.random() * 6));

    switch (kind) {
        case 0:
            return [2, 2, 2, 2, 2, 2, -1, 3, -1]; //tree
        case 1:
            return [-1, -1, -1, -1, -1, -1, 4, 4, -1]; //empty
        case 2:
            return [-1, -1, -1, -1, 2, -1, 2, 2, 2]; //empty

        case 3:
            return [-1, 2, -1, -1, 3, 4, -1, 3, 4]; //tree
        case 4:
            return [-1, -1, -1, 4, 4, 4, 4, 4, 4]; //tree

        default:
            return [-1, -1, -1, -1, -1, -1, -1, -1, -1]; //empty

    }

}

const updateLastMindedTIle = (type) => {
    state.lastMindedTile = type;
    lastMindedTileElement.dataset.type = type;
}
//validate tool can mine element
const validTool = (type, selectedTool) => {
    switch (selectedTool) {
        case 0: //p0-pickaxe => rock(4)i
            if (type == 4) 
            return true;
            break;
        case 1: // 1-shovel => dirt,dirt-grass(0,1)
            if (type == 0 || type == 1) 
            return true;
            break;
        case 2: // 2-axe => leaves,wood(2,3) 
            if (type == 2 || type == 3) 
            return true;
            break;
        default:
            console.error("invalid tool number");
            break;

    }

    return false;
};

//adds warning after invalid tool press;
const toolwarning = () => {
    tools.forEach(t => {
        t.classList.add('warning');
        setTimeout(removeAllWarning, 500);
    })
}

const removeAllWarning = () => {
    tools.forEach(t => {
        t.classList.remove('warning');
    })
}

//resets all active tools
const resetSelectedTools = () => {
    tools.forEach(t => {
        t.classList.remove('active');
    })
}

//events
const onStartGameClickHandler = (e) => {
    menu.style.display = 'none';
    gameMap.style.display = "block";

    state.worldMatrix = createMatrix(12, 18);
    createWorld(state.worldMatrix, tileOnClickHandler);
}

const resetGame = (e) => {
    menu.style.display = 'none';
    state.lastMindedTile = -1;
    state.selectedTool = -1;
    resetSelectedTools();
    lastMindedTileElement.dataset.type = -1;
    state.worldMatrix = createMatrix(12, 18);
    gameMap.innerHTML ="";
    createWorld(state.worldMatrix, tileOnClickHandler);
}
const toolOnClickHandler = (e) => {
    const tool = e.currentTarget;
    const toolType = parseInt(tool.dataset.tool);
    if (isNaN(toolType)) {
        console.error('invalid tool type');
        return;
    }
    resetSelectedTools();
    tool.classList.add('active');
    state.selectedTool = toolType;

}

const tileOnClickHandler = (e) => {
    console.log(e.currentTarget.dataset.type);
    const tile = e.currentTarget;
    let type = parseInt(tile.dataset.type);

    //check inputs 
    if (isNaN(type)) {
        console.error('invalid type');
        return;
    }


    if (type >= 0) { //mine tile

        if (!validTool(type, state.selectedTool)) {
            console.error('invalid tool');
            toolwarning();
            return;

        }

        tileStateObject = state.worldMatrix[tile.dataset.row][tile.dataset.col];
        if (!tileStateObject) {
            return;
        }
        tileStateObject.type = -1;
        tile.dataset.type = -1;
        updateLastMindedTIle(type);

    } else if (type == -1) { // plant tile
        if (state.lastMindedTile >= 0) {
            tile.dataset.type = state.lastMindedTile;
            state.lastMindedTile = -1;
            lastMindedTileElement.dataset.type = -1;
        }
    }

}

const addEventsToTools = (toolOnClickHandler) => {
    tools.forEach(tool => {
        tool.addEventListener('click', toolOnClickHandler)
    })
}

//main
gameMap.style.display = "none";
addEventsToTools(toolOnClickHandler);
startBtn.addEventListener('click', onStartGameClickHandler);
document.querySelector('.reset').addEventListener('click',resetGame);