const $days = $('#days');
const $nameCity = $('#city');
const $temperatura = $('#temperatura');
const $form = $('#form');

$form.on('submit', async function(e) {
    e.preventDefault();
    const $enterCity = $('#enterCity');
    const city = $enterCity.val();
    $nameCity.text(city);
    await getCity(city);
});

async function getCity(city) {
    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`Ошибка! Status: ${response.status}`);

        const results = await response.json();
        const { latitude, longitude, timezone } = results.results[0];
        await getWeather([latitude, longitude, timezone]);
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
}

async function getWeather([latitude, longitude, timezone]) {
    reset();
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max&forecast_days=14&timezone=${timezone}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const json = await response.json();
        const { temperature_2m_max, time: days_ten } = json.daily;

        days_ten.forEach((element) => {
            const date = new Date(element);
            const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
            $days.append($('<div>').text(formattedDate).hide().fadeIn(500));
        });

        temperature_2m_max.forEach((temp) => {
            const formattedTemp = temp > 0 ? `+${temp}` : temp;
            $temperatura.append($('<div>').text(formattedTemp).hide().fadeIn(500));
        });
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
}

function reset() {
    $days.children().fadeOut(500, function() {
        $(this).remove();
    });
    $temperatura.children().fadeOut(500, function() {
        $(this).remove();
    });
}
