const createStatisticsTemplate = () => (
  `<section class="trip-events  trip-events--hidden">
    <h2 class="visually-hidden">Trip events</h2>
  </section>

  <section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <!-- Пример диаграмм -->
    <img src="img/big-trip-stats-markup.png" alt="Пример диаграмм">

    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="time" width="900"></canvas>
    </div>
  </section>`
);

export { createStatisticsTemplate };