const newGameButton = document.querySelector("#new-game");
const restartButton = document.querySelector("#restart-game");
const player1InputField = document.querySelector("#player1");
const player2InputField = document.querySelector("#player2");

newGameButton.addEventListener("click", () => {
    Game.start();
    newGameButton.style.display = "none";
    player1InputField.style.display = "none";
    player2InputField.style.display = "none";
});

restartButton.addEventListener("click", () => {
    Game.restart();
    console.log(Gameboard.getGameboard());
});

const createPlayer = (name, symbol) => ({ name, symbol });

const checkWin = (board) => {
    const winningCombo = [
        [0, 1, 2], [0, 3, 6], [0, 4, 8],
        [1, 4, 7], [2, 4, 6], [2, 5, 8],
        [3, 4, 5], [6, 7, 8]
    ];
    return winningCombo.some(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
}

const checkTie = (board) => board.every(cell => cell !== "");

const Gameboard = (() => {
    let gameboard = Array(9).fill("");

    const render = () => {
        const boardHTML = gameboard.map((cell, index) => `<div class="cell" id="cell-${index}">${cell}</div>`).join("");
        document.querySelector("#gameboard").innerHTML = boardHTML;

        document.querySelectorAll(".cell").forEach(cell => {
            cell.addEventListener("click", Game.handleClick);
        });
    };

    const update = (index, symbol, force = false) => {
        if (force || gameboard[index] === "") {
            gameboard[index] = symbol;
            render();
            return true;
        }
        return false;
    };

    const getGameboard = () => gameboard;

    return { render, update, getGameboard };
})();

const Game = (() => {
    let players = [];
    let currentPlayer;
    let gameOver;

    const start = () => {
        players = [
            createPlayer(player1InputField.value, "X"), 
            createPlayer(player2InputField.value, "O")
        ];
        currentPlayer = 0;
        gameOver = false;
        Gameboard.render();
    };

    const handleClick = (event) => {
        const index = parseInt(event.target.id.split("-")[1]);
        if (gameOver || !Gameboard.update(index, players[currentPlayer].symbol)) return;

        if (checkWin(Gameboard.getGameboard())) {
            gameOver = true;
            alert(`${players[currentPlayer].name} won!`);
        } else if (checkTie(Gameboard.getGameboard())) {
            gameOver = true;
            alert("Draw!");
        }

        currentPlayer = (currentPlayer + 1) % 2;
    };

    const restart = () => {
        Gameboard.getGameboard().forEach((_, index) => Gameboard.update(index, "", true));
        gameOver = false;
    };

    return { start, handleClick, restart };
})();