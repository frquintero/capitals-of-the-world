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
        showScreen('welcome-screen');
        updateWelcomeStats();
        loadAvailableContinents();
        loadContinentsMenu();
        
        // Agregar event listener para el botón de inicio
        document.getElementById('start-game-btn').addEventListener('click', function() {
            showScreen('menu-screen');
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
document.getElementById('play-again-btn').addEventListener('click', function() {
    startGame(currentContinent);
});

document.getElementById('back-to-menu-btn').addEventListener('click', function() {
    updateWelcomeStats();
    showScreen('menu-screen');
});

// Función para obtener estadísticas (opcional)
function getGameStats() {
    return {
        totalPlayed: usedCountries.size,
        continentsPlayed: currentContinent ? [currentContinent] : [],
        currentScore: score,
        totalQuestions: currentQuestions.length
    };
}
