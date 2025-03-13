// Переключение темы
const toggleButton = document.getElementById('theme-toggle');
const body = document.body;
const icon = toggleButton.querySelector('.icon');

// Загрузка сохраненной темы
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
icon.textContent = savedTheme === 'light' ? '☀️' : '🌙';

// Обработчик переключения
toggleButton.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    icon.textContent = newTheme === 'light' ? '☀️' : '🌙';
});

// Логика калькулятора углеродного следа
const form = document.getElementById('carbon-form');
const results = document.getElementById('results');
const totalCo2 = document.getElementById('total-co2');
const tableBody = document.getElementById('carbon-table-body');
let chart;

// Константы для расчётов (в тоннах CO₂)
const MEAT_PER_MEAL = 0.027; // кг CO₂ на мясной приём пищи * 52 недели
const CAR_PER_KM = 0.000192; // т CO₂ на км
const FLIGHT_SHORT = 0.254; // т CO₂ на короткий перелёт
const FLIGHT_LONG = 0.653; // т CO₂ на длинный перелёт
const ELECTRICITY_PER_KWH = 0.000475; // т CO₂ на кВт·ч * 12 месяцев

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Получение данных из формы
    const meatMeals = parseInt(document.getElementById('meat').value) || 0;
    const carKm = parseInt(document.getElementById('car').value) || 0;
    const shortFlights = parseInt(document.getElementById('flights').value) || 0;
    const longFlights = parseInt(document.getElementById('long-flights').value) || 0;
    const electricityKwh = parseInt(document.getElementById('electricity').value) || 0;

    // Расчёты
    const meatCo2 = meatMeals * MEAT_PER_MEAL * 52 / 1000; // Перевод в тонны
    const carCo2 = carKm * CAR_PER_KM * 52;
    const flightCo2 = (shortFlights * FLIGHT_SHORT) + (longFlights * FLIGHT_LONG);
    const electricityCo2 = electricityKwh * ELECTRICITY_PER_KWH * 12;

    const total = meatCo2 + carCo2 + flightCo2 + electricityCo2;

    // Отображение результатов
    totalCo2.textContent = total.toFixed(2);
    results.style.display = 'block';

    // Данные для таблицы
    const categories = [
        { name: 'Meat Consumption', co2: meatCo2, tip: 'Reduce meat intake or try plant-based meals.' },
        { name: 'Car Usage', co2: carCo2, tip: 'Use public transport or carpool.' },
        { name: 'Flights', co2: flightCo2, tip: 'Minimize air travel or offset emissions.' },
        { name: 'Electricity', co2: electricityCo2, tip: 'Switch to renewable energy or reduce usage.' }
    ];

    tableBody.innerHTML = categories.map(cat => `
        <tr>
            <td>${cat.name}</td>
            <td>${cat.co2.toFixed(2)}</td>
            <td>${cat.tip}</td>
        </tr>
    `).join('');

    // Уничтожение старой диаграммы, если она есть
    if (chart) chart.destroy();

    // Создание круговой диаграммы
    chart = new Chart(document.getElementById('carbon-chart'), {
        type: 'pie',
        data: {
            labels: categories.map(cat => cat.name),
            datasets: [{
                data: categories.map(cat => cat.co2),
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'],
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Carbon Footprint Breakdown' }
            }
        }
    });
});

// Копирование Bitcoin-адреса
const copyBtcButton = document.querySelector('.btc-address .copy-btn');
copyBtcButton.addEventListener('click', () => {
    const btcCode = document.getElementById('btc-code').textContent;
    navigator.clipboard.writeText(btcCode).then(() => {
        copyBtcButton.textContent = 'Copied!';
        setTimeout(() => {
            copyBtcButton.textContent = 'Copy';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
});
