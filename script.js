// Инициализация переменных
let balance = 10000; // Начальный баланс

const spina = new Audio();
spina.src = 'spin.mp3';

const wina = new Audio();
wina.src = 'win.mp3';

const wina1 = new Audio();
wina1.src = 'win1.mp3';

const wina2 = new Audio();
wina2.src = 'win2.mp3';




document.addEventListener('DOMContentLoaded', () => {
    const spinButton = document.getElementById('spinButton');
    spinButton.addEventListener('click', spin); // Привязка события клика
});

// Замените эти строки на ваши изображения
const symbols = ['slot1.png', 'slot2.jpg', 'slot3.jpg', 'slot4.jpg', 'slot5.jpg', 'slot6.jpg', 'slot7.jpg', 'slot8.jpg', 'slot9.jpg', 'slot10.jpg'];

// Коэффициенты для символов: чем выше коэффициент, тем реже символ будет выпадать
const symbolProbabilities = {
    'slot1.png': { coefficient: 0.5, probability: 0.15 },
    'slot2.jpg': { coefficient: 0.5, probability: 0.15 },
    'slot3.jpg': { coefficient: 0.8, probability: 0.13 },
    'slot4.jpg': { coefficient: 3.4, probability: 0.1 },
    'slot5.jpg': { coefficient: 10, probability: 0.07 },
    'slot6.jpg': { coefficient: 15, probability: 0.05 },
    'slot7.jpg': { coefficient: 30, probability: 0.04 },
    'slot8.jpg': { coefficient: 50, probability: 0.03 },
    'slot9.jpg': { coefficient: 167, probability: 0.01 },
    'slot10.jpg': { coefficient: 0, probability: 0.3 }
};

function updateBetDisplay() {
    const betAmount = document.getElementById('betAmount').value;
    document.getElementById('currentBet').textContent = `$${betAmount}`;
}

// Привязка обработчика событий для ползунка
document.getElementById('betAmount').addEventListener('input', updateBetDisplay);

// Функция для получения случайного символа с учетом вероятности
function getRandomSymbol() {
    const rand = Math.random();
    let cumulativeProbability = 0;

    for (const [symbol, { probability }] of Object.entries(symbolProbabilities)) {
        cumulativeProbability += probability;
        if (rand < cumulativeProbability) {
            return symbol;
        }
    }
}

// Функция для сброса символов
function resetSlots() {
    const container = document.getElementById('slots-container');
    container.innerHTML = ''; // Очистка текущих символов
}

// Функция для создания матрицы слотов с анимацией
function createMatrix() {
    
    const container = document.getElementById('slots-container');
    const results = [];
    for (let i = 0; i < 4; i++) { // 4 строки
        const row = document.createElement('div');
        row.className = 'row'; 
        results[i] = [];
        for (let j = 0; j < 5; j++) { // 5 столбцов
            const symbol = getRandomSymbol();
            results[i][j] = symbol; 

            const symbolElement = document.createElement('div');
            symbolElement.className = 'symbol';

            const imgElement = document.createElement('img');
            imgElement.src = symbol; 
            imgElement.alt = 'slot image';
            imgElement.style.width = '100%'; 
            imgElement.style.height = '100%'; 
            imgElement.style.objectFit = 'cover'; 

            symbolElement.appendChild(imgElement);
            symbolElement.style.opacity = '0'; 
            symbolElement.style.transform = 'translateY(-100%)'; 

            const randomDelay = Math.random() * 300; // Рандомная задержка до 300 мс
            setTimeout(() => {
                symbolElement.style.opacity = '1'; 
                symbolElement.style.transform = 'translateY(0)'; 
            }, (i * 200) + (j * 100) + randomDelay); // Увеличиваем задержку и добавляем рандом
            row.appendChild(symbolElement);
        }
        container.appendChild(row);
    }
    return results; 
}

// Функция для подсветки выигрышных ячеек
function highlightWinningCells(i, j, dx, dy, count) {
    const container = document.getElementById('slots-container');
    let x = i;
    let y = j;

    // Подсветка ячеек с выигрышными символами
    for (let k = 0; k < count; k++) {
        const symbolElement = container.children[x].children[y];
        symbolElement.style.backgroundColor = 'yellow'; // Подсветка цвета
        x += dy; // Перемещаем по вертикали
        y += dx; // Перемещаем по горизонтали
    }
}

// Функция для показа анимации выигрыша с изменением стилей
function showWinPopup(totalMultiplier, winAmount) {
    const winPopup = document.getElementById('win-popup');
    const winText = document.getElementById('win-text');

    // Настройка текста и цвета в зависимости от коэффициента
    let popupClass;

    if (totalMultiplier < 3) {
        wina.play();
        winText.textContent = `Фимоз Win $${winAmount}!`;
        winText.classList.add('low'); // Добавляем класс 'low'
    }
     else if (totalMultiplier < 9) {
        wina1.play();
        winText.textContent = `Парафимоз Win $${winAmount}!`;
        popupClass = 'win-popup.medium'; // Средний коэффициент
    } else {
        wina2.play();
        winText.textContent = `Баланопостит Win $${winAmount}!`;
        popupClass = 'win-popup.high'; // Высокий коэффициент
    }

    // Удаляем все предыдущие классы

    // Добавляем новый класс для стилей
    winPopup.classList.add(popupClass);
    winPopup.style.display = 'flex';
    winPopup.style.opacity = '1'; // Делаем видимым

    // Через заданное время скрываем всплывающее окно
    setTimeout(() => {
        winPopup.style.opacity = '0'; // Начинаем анимацию исчезновения
        setTimeout(() => {
            winPopup.style.display = 'none'; // Скрываем полностью после завершения анимации
        }, 5000); // Задержка на время анимации исчезновения
    }, 5000); // Устанавливаем время, через которое уведомление исчезнет
}
// Функция для анимации лопания выигрышных символов
function popAndFadeWinningCells(i, j, dx, dy, count) {
    const container = document.getElementById('slots-container');
    let x = i;
    let y = j;

    // Подсветка и анимация лопания выигрышных ячеек
    for (let k = 0; k < count; k++) {
        const symbolElement = container.children[x].children[y];

        // Через некоторое время запускаем анимацию лопания
        setTimeout(() => {
            symbolElement.classList.add('pop-and-fade');
        }, 400); 
        
        x += dy; // Перемещаем по вертикали
        y += dx; // Перемещаем по горизонтали
    }
}

// Функция для проверки выигрыша
function checkWin(results, betAmount) {
    const winningCombinations = [];
    let winAmount = 0;
    let totalMultiplier = 0;

    const directions = [
        { dx: 1, dy: 0 }, // Горизонтально
        { dx: 0, dy: 1 }, // Вертикально
        { dx: 1, dy: 1 }, // По диагонали вниз вправо
        { dx: 1, dy: -1 } // По диагонали вверх вправо
    ];

    const checkedSymbols = new Set(); // Хранит символы, для которых мы уже нашли выигрыш

    for (let i = 0; i < results.length; i++) {
        for (let j = 0; j < results[i].length; j++) {
            const symbol = results[i][j];
            if (symbol === 'slot10.jpg') continue; // Игнорируем пустышку
            if (checkedSymbols.has(symbol)) continue; // Пропускаем, если символ уже был проверен

            let count = 1;
            let multiplier = symbolProbabilities[symbol].coefficient;

            // Проверяем каждое направление
            for (const { dx, dy } of directions) {
                count = 1; // Сбрасываем счетчик перед проверкой направления
                let x = i + dy; // Изменяем по вертикали
                let y = j + dx; // Изменяем по горизонтали

                while (x >= 0 && x < results.length && y >= 0 && y < results[i].length && results[x][y] === symbol) {
                    count++;
                    y += dx; // Увеличиваем по горизонтали
                    x += dy; // Увеличиваем по вертикали
                }

                if (count >= 3) {
                    // Подсветим выигрышные символы
                    highlightWinningCells(i, j, dx, dy, count);

                    // Через некоторое время запускаем анимацию "лопания" выигрышных символов
                    popAndFadeWinningCells(i, j, dx, dy, count);

                    const totalWin = (multiplier * count * betAmount).toFixed(1);
                    winAmount += parseFloat(totalWin);
                    totalMultiplier += multiplier; // Суммируем коэффициенты
                    winningCombinations.push(symbol);
                    checkedSymbols.add(symbol); // Добавляем символ в набор проверенных
                }
            }
        }
    }

    // Если есть выигрыш, показываем всплывающее окно
    if (winAmount > 0) {
        balance += winAmount; // Обновление баланса
        document.getElementById('balance').textContent = `Баланс: $${balance}`;
        showWinPopup(totalMultiplier, winAmount); // Вызов функции показа выигрыша
    } 
}

// Функция для вращения слотов
function spin() {
   // spina.stop();
    spina.play();
    const betAmount = parseInt(document.getElementById('betAmount').value);

    if (betAmount > balance) {
        alert("Недостаточно средств!");
        return;
    }

    balance -= betAmount; // Вычитаем ставку из баланса
    document.getElementById('balance').textContent = `Баланс: $${balance}`;

    resetSlots(); // Сбрасываем предыдущие символы

    // Запускаем анимацию слотов
    const results = createMatrix(); // Создаем новую матрицу символов
    setTimeout(() => {
        checkWin(results, betAmount); // Проверяем на выигрыш
    }, 2000); // Задержка перед проверкой выигрыша
}

window.onload = function() {
    createMatrix(); // Создаем случайные слоты при загрузке
   
}
