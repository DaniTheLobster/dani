const canvas = document.getElementById('sandCanvas');
const ctx = canvas.getContext('2d');
const width = 200;
const height = 200;
const cellSize = 3;

canvas.width = width * cellSize;
canvas.height = height * cellSize;

let grid = make2DArray(width, height);
let colorGrid = make2DArray(width, height);
let currentType = 1; // 1: Sand, 2: Water, 3: Wall, 4: Fire

function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows).fill(0);
    }
    return arr;
}

// Color management for variation
let colorGrid = make2DArray(width, height);
// Store particle lifetime/state for fire
let lifeGrid = make2DArray(width, height);
let isMouseDown = false;
canvas.addEventListener('mousedown', () => isMouseDown = true);
canvas.addEventListener('mouseup', () => isMouseDown = false);
canvas.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
        let rect = canvas.getBoundingClientRect();
        let x = Math.floor((e.clientX - rect.left) / cellSize);
        let y = Math.floor((e.clientY - rect.top) / cellSize);
        
        let matrix = 3;
        let extent = Math.floor(matrix / 2);
        for (let i = -extent; i <= extent; i++) {
            for (let j = -extent; j <= extent; j++) {
                let col = x + i;
                let row = y + j;
                if (col >= 0 && col < width && row >= 0 && row < height) {
                    if (currentType === 3) {
                        grid[col][row] = 3;
                    } else if (currentType === 4) {
                        grid[col][row] = 4;
                        lifeGrid[col][row] = 10 + Math.random() * 20;
                    } else if (grid[col][row] === 0) {
                        grid[col][row] = currentType;
                    }
                }
            }
        }
    }
});

// Controls
document.getElementById('sandBtn').onclick = () => { setType(1, 'sandBtn'); };
document.getElementById('waterBtn').onclick = () => { setType(2, 'waterBtn'); };
document.getElementById('wallBtn').onclick = () => { setType(3, 'wallBtn'); };
document.getElementById('fireBtn').onclick = () => { setType(4, 'fireBtn'); };
document.getElementById('clearBtn').onclick = () => {
    grid = make2DArray(width, height);
};

function setType(t, id) {
    currentType = t;
    document.querySelectorAll('.controls button').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function update() {
    let nextGrid = make2DArray(width, height);
    let nextLife = make2DArray(width, height);
    
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let state = grid[x][y];
            if (state === 1) { // Sand
                if (y < height - 1) {
                    let below = grid[x][y + 1];
                    let dir = Math.random() < 0.5 ? 1 : -1;
                    let belowA = -1;
                    let belowB = -1;
                    if (x + dir >= 0 && x + dir < width) belowA = grid[x + dir][y + 1];
                    if (x - dir >= 0 && x - dir < width) belowB = grid[x - dir][y + 1];

                    if (below === 0 || below === 2) {
                        nextGrid[x][y + 1] = 1;
                        if (below === 2) nextGrid[x][y] = 2; // Displacement
                    } else if (belowA === 0 || belowA === 2) {
                        nextGrid[x + dir][y + 1] = 1;
                        if (belowA === 2) nextGrid[x][y] = 2;
                    } else if (belowB === 0 || belowB === 2) {
                        nextGrid[x - dir][y + 1] = 1;
                        if (belowB === 2) nextGrid[x][y] = 2;
                    } else {
                        nextGrid[x][y] = 1;
                    }
                } else {
                    nextGrid[x][y] = 1;
                }
            } else if (state === 2) { // Water
                if (y < height - 1) {
                    let below = grid[x][y + 1];
                    let dir = Math.random() < 0.5 ? 1 : -1;
                    let sideA = -1;
                    let sideB = -1;
                    if (x + dir >= 0 && x + dir < width) sideA = grid[x + dir][y];
                    if (x - dir >= 0 && x - dir < width) sideB = grid[x - dir][y];

                    if (below === 0) {
                        nextGrid[x][y + 1] = 2;
                    } else if (x + dir >= 0 && x + dir < width && grid[x + dir][y + 1] === 0) {
                        nextGrid[x + dir][y + 1] = 2;
                    } else if (x - dir >= 0 && x - dir < width && grid[x - dir][y + 1] === 0) {
                        nextGrid[x - dir][y + 1] = 2;
                    } else if (sideA === 0) {
                        nextGrid[x + dir][y] = 2;
                    } else if (sideB === 0) {
                        nextGrid[x - dir][y] = 2;
                    } else {
                        nextGrid[x][y] = 2;
                    }
                } else {
                    nextGrid[x][y] = 2;
                }
            } else if (state === 3) { // Wall
                nextGrid[x][y] = 3;
            } else if (state === 4) { // Fire
                let life = lifeGrid[x][y];
                if (life > 0) {
                    let dirX = Math.floor(Math.random() * 3) - 1;
                    let dirY = -1;
                    let nx = x + dirX;
                    let ny = y + dirY;
                    
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        if (grid[nx][ny] === 0) {
                            nextGrid[nx][ny] = 4;
                            nextLife[nx][ny] = life - 1;
                        } else if (grid[nx][ny] === 2) {
                            // Steam effect or just cancel
                            nextGrid[nx][ny] = 0;
                        } else {
                            nextGrid[x][y] = 4;
                            nextLife[x][y] = life - 1;
                        }
                    }
                }
            }
        }
    }
    grid = nextGrid;
    lifeGrid = nextLife;
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let state = grid[x][y];
            if (state === 1) {
                ctx.fillStyle = `hsl(45, 100%, 50%)`;
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            } else if (state === 2) {
                ctx.fillStyle = `hsl(200, 100%, 50%)`;
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            } else if (state === 3) {
                ctx.fillStyle = '#888';
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            } else if (state === 4) {
                let life = lifeGrid[x][y];
                ctx.fillStyle = `hsl(${life * 2}, 100%, 50%)`;
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
