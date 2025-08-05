// Variables globales
let countriesData = {};
let currentContinent = '';
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let incorrectAnswers = [];
let allAnswers = [];
let usedCountries = new Set();
let gameStats = {
    totalGames: 0,
    totalCorrect: 0,
    continentsPlayed: new Set()
};

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('data/countries.json');
        countriesData = await response.json();
        loadGameStats();
        updateWelcomeStats();
        loadAvailableContinents();
        loadContinentsMenu();
        
        // Agregar event listener para el botón de inicio
        document.getElementById('start-game-btn').addEventListener('click', function() {
            showScreen('menu-screen');
        });

        // Agregar event listener para el botón de Tic-Tac-Toe
        document.getElementById('tic-tac-toe-btn').addEventListener('click', function() {
            showScreen('tic-tac-toe-screen');
            initializeTicTacToe();
        });

        // Agregar event listener para volver al menú desde Tic-Tac-Toe
        document.getElementById('back-to-menu-btn').addEventListener('click', function() {
            showScreen('menu-screen');
            resetTicTacToe();
        });

        // Agregar event listener para salir del juego
        document.getElementById('quit-game-btn').addEventListener('click', function() {
            showScreen('welcome-screen');
            resetTicTacToe();
        });
    } catch (error) {
        console.error('Error cargando los datos:', error);
        alert('Error al cargar los datos de países. Por favor, recargue la página.');
    }
});

// Actualizar estadísticas de bienvenida
function updateWelcomeStats() {
    document.getElementById('total-games').textContent = gameStats.totalGames;
    document.getElementById('total-correct').textContent = gameStats.totalCorrect;
    document.getElementById('continents-played').textContent = gameStats.continentsPlayed.size;
}

// Cargar lista de continentes disponibles
function loadAvailableContinents() {
    const continentsList = document.getElementById('available-continents');
    continentsList.innerHTML = '';
    
    Object.keys(countriesData).forEach(continent => {
        const li = document.createElement('li');
        li.textContent = `${continent} (${Object.keys(countriesData[continent]).length} países)`;
        continentsList.appendChild(li);
    });
}

// Cargar estadísticas del juego
function loadGameStats() {
    const savedStats = localStorage.getItem('capitalsGameStats');
    if (savedStats) {
        const parsed = JSON.parse(savedStats);
        gameStats = {
            ...gameStats,
            ...parsed,
            continentsPlayed: new Set(parsed.continentsPlayed || [])
        };
    }
}

// Guardar estadísticas del juego
function saveGameStats() {
    const statsToSave = {
        ...gameStats,
        continentsPlayed: Array.from(gameStats.continentsPlayed)
    };
    localStorage.setItem('capitalsGameStats', JSON.stringify(statsToSave));
}

// Función para mostrar/ocultar pantallas
function showScreen(screenId) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Mostrar la pantalla solicitada
    document.getElementById(screenId).classList.remove('hidden');
}

// Cargar menú de continentes
function loadContinentsMenu() {
    const menuContainer = document.getElementById('continents-menu');
    menuContainer.innerHTML = '';
    
    Object.keys(countriesData).forEach(continent => {
        const button = document.createElement('button');
        button.className = 'continent-btn';
        button.textContent = continent;
        button.onclick = () => startGame(continent);
        menuContainer.appendChild(button);
    });
}

// Iniciar juego para un continente
function startGame(continent) {
    currentContinent = continent;
    currentQuestionIndex = 0;
    score = 0;
    incorrectAnswers = [];
    allAnswers = [];
    usedCountries = new Set();
    
    // Generar preguntas aleatorias
    generateQuestions();
    
    // Mostrar primera pregunta
    showQuestion();
    
    // Mostrar pantalla de juego
    showScreen('game-screen');
}

// Generar 5 preguntas aleatorias del continente seleccionado
function generateQuestions() {
    const countries = Object.entries(countriesData[currentContinent]);
    const availableCountries = countries.filter(([country]) => !usedCountries.has(country));
    
    // Si no hay suficientes países no usados, reiniciar el conjunto
    if (availableCountries.length < 5) {
        usedCountries.clear();
    }
    
    // Seleccionar 5 países aleatorios
    currentQuestions = [];
    const shuffled = [...availableCountries].sort(() => 0.5 - Math.random());
    const selectedCountries = shuffled.slice(0, 5);
    
    selectedCountries.forEach(([country, capital]) => {
        usedCountries.add(country);
        currentQuestions.push({
            country: country,
            correctAnswer: capital,
            options: generateOptions(capital, currentContinent)
        });
    });
}

// Generar opciones para una pregunta
function generateOptions(correctAnswer, continent) {
    const options = [correctAnswer];
    const allCapitals = [];
    
    // Recolectar todas las capitales del continente
    Object.entries(countriesData[continent]).forEach(([country, capital]) => {
        if (capital !== correctAnswer && !usedCountries.has(country)) {
            allCapitals.push(capital);
        }
    });
    
    // Si no hay suficientes capitales, usar de otros continentes
    if (allCapitals.length < 2) {
        Object.keys(countriesData).forEach(cont => {
            if (cont !== continent) {
                Object.values(countriesData[cont]).forEach(capital => {
                    if (capital !== correctAnswer && !allCapitals.includes(capital)) {
                        allCapitals.push(capital);
                    }
                });
            }
        });
    }
    
    // Seleccionar 2 opciones incorrectas aleatorias
    const shuffled = [...allCapitals].sort(() => 0.5 - Math.random());
    options.push(...shuffled.slice(0, 2));
    
    // Mezclar todas las opciones
    return options.sort(() => 0.5 - Math.random());
}

// Mostrar pregunta actual
function showQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        showResults();
        return;
    }
    
    const question = currentQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / 5) * 100;
    
    // Actualizar UI
    document.getElementById('continent-title').textContent = currentContinent;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('question-counter').textContent = `${currentQuestionIndex + 1}/5`;
    document.getElementById('country-question').textContent = `¿Cuál es la capital de ${question.country}?`;
    
    // Generar opciones
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => checkAnswer(option, question.correctAnswer, question.country);
        optionsContainer.appendChild(button);
    });
}

// Verificar respuesta
function checkAnswer(selectedAnswer, correctAnswer, country) {
    const options = document.querySelectorAll('.option-btn');
    
    // Deshabilitar botones
    options.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctAnswer) {
            btn.classList.add('correct');
        } else if (btn.textContent === selectedAnswer && selectedAnswer !== correctAnswer) {
            btn.classList.add('incorrect');
        }
    });
    
    // Registrar respuesta
    allAnswers.push({
        country: country,
        correctAnswer: correctAnswer,
        userAnswer: selectedAnswer,
        isCorrect: selectedAnswer === correctAnswer
    });
    
    // Actualizar puntaje
    if (selectedAnswer === correctAnswer) {
        score++;
    } else {
        incorrectAnswers.push({
            country: country,
            correctAnswer: correctAnswer,
            userAnswer: selectedAnswer
        });
    }
    
    // Pasar a la siguiente pregunta después de un delay
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 1500);
}

// Mostrar resultados
function showResults() {
    const percentage = Math.round((score / 5) * 100);
    
    // Actualizar estadísticas
    gameStats.totalGames++;
    gameStats.totalCorrect += score;
    gameStats.continentsPlayed.add(currentContinent);
    saveGameStats();
    
    document.getElementById('correct-count').textContent = score;
    document.getElementById('percentage').textContent = percentage;
    
    // Mostrar resumen completo de todas las respuestas
    const allAnswersList = document.getElementById('all-answers-list');
    allAnswersList.innerHTML = '';
    allAnswers.forEach(answer => {
        const li = document.createElement('li');
        if (answer.isCorrect) {
            li.innerHTML = `<span class="correct-answer">${answer.country}: ${answer.correctAnswer}</span>`;
        } else {
            li.innerHTML = `<span class="incorrect-answer">${answer.country}: ${answer.correctAnswer} (Tu respuesta: ${answer.userAnswer})</span>`;
        }
        allAnswersList.appendChild(li);
    });
    
    // Mostrar respuestas incorrectas
    const incorrectList = document.getElementById('incorrect-list');
    const incorrectContainer = document.getElementById('incorrect-answers');
    
    if (incorrectAnswers.length > 0) {
        incorrectContainer.style.display = 'block';
        incorrectList.innerHTML = '';
        incorrectAnswers.forEach(answer => {
            const li = document.createElement('li');
            li.textContent = `${answer.country}: ${answer.correctAnswer} (Tu respuesta: ${answer.userAnswer})`;
            incorrectList.appendChild(li);
        });
    } else {
        incorrectContainer.style.display = 'none';
    }
    
    showScreen('results-screen');
}

// Event listeners para botones
if (typeof document !== 'undefined') {
    const playAgainBtn = document.getElementById('play-again-btn');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', function() {
            startGame(currentContinent);
        });
    }

    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', function() {
            updateWelcomeStats();
            showScreen('menu-screen');
        });
    }
}

// Función para obtener estadísticas (opcional)
function getGameStats() {
    return {
        totalPlayed: usedCountries.size,
        continentsPlayed: currentContinent ? [currentContinent] : [],
        currentScore: score,
        totalQuestions: currentQuestions.length
    };
}

// Funciones para Tic-Tac-Toe
let ticTacToeBoard = null;
let currentPlayer = 'X';
let gameMode = 'easy';
let gameActive = false;

function initializeTicTacToe() {
    // Crear el tablero si no existe
    if (!document.getElementById('tic-tac-toe-board')) {
        const board = document.createElement('div');
        board.id = 'tic-tac-toe-board';
        board.className = 'tic-tac-toe-board';
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            board.appendChild(cell);
        }
        
        document.querySelector('.game-options').appendChild(board);
        
        // Agregar botones de acción
        const actions = document.createElement('div');
        actions.className = 'game-actions';
        
        const restartBtn = document.createElement('button');
        restartBtn.id = 'restart-game-btn';
        restartBtn.className = 'btn primary';
        restartBtn.textContent = 'Reiniciar Juego';
        actions.appendChild(restartBtn);
        
        const status = document.createElement('div');
        status.id = 'game-status';
        status.className = 'game-status';
        actions.appendChild(status);
        
        document.querySelector('.game-options').appendChild(actions);
        
        // Agregar event listeners
        document.getElementById('restart-game-btn').addEventListener('click', resetTicTacToe);
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
    }
    
    ticTacToeBoard = Array.from(document.querySelectorAll('.cell'));
    currentPlayer = 'X';
    gameActive = true;
    document.getElementById('game-status').textContent = 'Tu turno (X)';
    ticTacToeBoard.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '';
        cell.classList.remove('highlight');
    });
}

function resetTicTacToe() {
    if (ticTacToeBoard) {
        ticTacToeBoard.forEach(cell => {
            cell.textContent = '';
            cell.style.backgroundColor = '';
            cell.classList.remove('highlight');
        });
        currentPlayer = 'X';
        gameActive = true;
        document.getElementById('game-status').textContent = 'Tu turno (X)';
    }
}

function handleCellClick(e) {
    const cell = e.target;
    if (!gameActive || cell.textContent !== '') return;
    
    cell.textContent = currentPlayer;
    cell.style.backgroundColor = currentPlayer === 'X' ? '#4facfe' : '#f44336';
    cell.style.color = 'white';

    // Check if player wins or draw
    if (checkWinBoard(getBoardState(), 'X')) {
        document.getElementById('game-status').textContent = `¡Ganaste! 🎉`;
        gameActive = false;
        return;
    }
    if (checkDrawBoard(getBoardState())) {
        document.getElementById('game-status').textContent = `Empate 😊`;
        gameActive = false;
        return;
    }

    currentPlayer = 'O';
    document.getElementById('game-status').textContent = 'Turno de la computadora (O)';

    setTimeout(() => {
        let move;
        if (gameMode === 'minimax') {
            move = getBestMoveAI();
            if (move !== undefined) {
                ticTacToeBoard[move].textContent = 'O';
                ticTacToeBoard[move].style.backgroundColor = '#f44336';
                ticTacToeBoard[move].style.color = 'white';
            }
        } else {
            move = makeComputerMoveEasy();
        }

        if (checkWinBoard(getBoardState(), 'O')) {
            document.getElementById('game-status').textContent = `La computadora gana 😕`;
            gameActive = false;
        } else if (checkDrawBoard(getBoardState())) {
            document.getElementById('game-status').textContent = `Empate 😊`;
            gameActive = false;
        } else {
            currentPlayer = 'X';
            document.getElementById('game-status').textContent = 'Tu turno (X)';
        }
    }, 500);
}

function makeComputerMove() {
    // Deprecated: replaced by makeComputerMoveEasy
}

function checkWinDOM() {
    // Deprecated: replaced by checkWinBoard
}

function checkDrawDOM() {
    // Deprecated: replaced by checkDrawBoard
}

function checkWinMinimax(board) {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8], // Filas
        [0,3,6], [1,4,7], [2,5,8], // Columnas
        [0,4,8], [2,4,6] // Diagonales
    ];
    
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return (
            board[a] === currentPlayer &&
            board[b] === currentPlayer &&
            board[c] === currentPlayer
        );
    });
}

function checkDrawMinimax(board) {
    return board.every(cell => cell !== '') && !checkWinMinimax(board);
}

function getBestMove() {
    // Deprecated: replaced by getBestMoveAI
}

function minimax(board, depth, isMaximizing) {
    // Deprecated: replaced by minimaxAI
}

function checkWin(board) {
    // Deprecated: replaced by checkWinBoard
}

function checkDraw(board) {
    // Deprecated: replaced by checkDrawBoard
}

// Event listeners para botones de Tic-Tac-Toe
if (typeof document !== 'undefined') {
    const easyModeBtn = document.getElementById('easy-mode-btn');
    if (easyModeBtn) {
        easyModeBtn.addEventListener('click', function() {
            gameMode = 'easy';
            document.getElementById('easy-mode-btn').classList.add('selected');
            document.getElementById('minimax-mode-btn').classList.remove('selected');
            startTicTacToe();
        });
    }

    const minimaxModeBtn = document.getElementById('minimax-mode-btn');
    if (minimaxModeBtn) {
        minimaxModeBtn.addEventListener('click', function() {
            gameMode = 'minimax';
            document.getElementById('minimax-mode-btn').classList.add('selected');
            document.getElementById('easy-mode-btn').classList.remove('selected');
            startTicTacToe();
        });
    }
}

function startTicTacToe() {
    showScreen('tic-tac-toe-screen');
    initializeTicTacToe();
    document.getElementById('game-status').textContent = 'Selecciona una celda para comenzar';
}

// --- Tic-Tac-Toe Helper Functions ---
function getBoardState() {
    return ticTacToeBoard.map(cell => cell.textContent);
}

function checkWinBoard(board, player) {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return (
            board[a] === player &&
            board[b] === player &&
            board[c] === player
        );
    });
}

function checkDrawBoard(board) {
    return board.every(cell => cell !== '') && !checkWinBoard(board, 'X') && !checkWinBoard(board, 'O');
}

function makeComputerMoveEasy() {
    const board = getBoardState();
    const emptyCells = board
        .map((value, index) => value === '' ? index : null)
        .filter(val => val !== null);
    if (emptyCells.length === 0) return;
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    ticTacToeBoard[randomIndex].textContent = 'O';
    ticTacToeBoard[randomIndex].style.backgroundColor = '#f44336';
    ticTacToeBoard[randomIndex].style.color = 'white';
    return randomIndex;
}

function getBestMoveAI() {
    const board = getBoardState();
    let bestScore = -Infinity;
    let move;
    const emptyCells = board
        .map((value, index) => value === '' ? index : null)
        .filter(val => val !== null);
    for (let i = 0; i < emptyCells.length; i++) {
        const index = emptyCells[i];
        board[index] = 'O';
        const score = minimaxAI(board, 0, false);
        board[index] = '';
        if (score > bestScore) {
            bestScore = score;
            move = index;
        }
    }
    return move;
}

function minimaxAI(board, depth, isMaximizing) {
    if (checkWinBoard(board, 'O')) return 10 - depth;
    if (checkWinBoard(board, 'X')) return -10 + depth;
    if (checkDrawBoard(board)) return 0;

    const emptyCells = board
        .map((value, index) => value === '' ? index : null)
        .filter(val => val !== null);

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < emptyCells.length; i++) {
            const index = emptyCells[i];
            board[index] = 'O';
            const score = minimaxAI(board, depth + 1, false);
            board[index] = '';
            bestScore = Math.max(score, bestScore);
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < emptyCells.length; i++) {
            const index = emptyCells[i];
            board[index] = 'X';
            const score = minimaxAI(board, depth + 1, true);
            board[index] = '';
            bestScore = Math.min(score, bestScore);
        }
        return bestScore;
    }
}

// Export functions for testing in Node.js environment
if (typeof module !== 'undefined') {
    module.exports = { checkWinBoard, checkDrawBoard };
}
