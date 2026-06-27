const baseLevel = document.getElementById('base-level');
const currentLevel = document.getElementById('current-level');
const successRate = document.getElementById('success-rate');
const calculateButton = document.getElementById('calculate');
const resultsSection = document.getElementById('results');
const successTreinos = document.getElementById('success-treinos');
const successPlates = document.getElementById('success-plates');
const failTreinos = document.getElementById('fail-treinos');
const failPlates = document.getElementById('fail-plates');
const avgTreinos = document.getElementById('avg-treinos');
const avgPlates = document.getElementById('avg-plates');

function platesPorTreino(level) {
  if (level >= 100) return 0;
  return Math.floor(level / 10);
}

function getGains(baseLevelValue) {
  const gains = {
    5: { success: 100, fail: 50 },
    20: { success: 100, fail: 50 },
    30: { success: 100, fail: 50 },
    50: { success: 125, fail: 65 },
    65: { success: 95, fail: 40 },
    80: { success: 60, fail: 25 },
    95: { success: 35, fail: 15 },
  };

  return gains[baseLevelValue] || gains[50];
}

function deterministic(baseLevelValue, currentLevelValue, success) {
  const gains = getGains(baseLevelValue);
  const gain = success ? gains.success : gains.fail;
  let level = currentLevelValue;
  let exp = 0;
  let plates = 0;
  let trainings = 0;

  while (level < 100) {
    plates += platesPorTreino(level);
    trainings += 1;
    exp += gain;

    while (exp >= 100 && level < 100) {
      exp -= 100;
      level += 1;
    }
  }

  return { plates, trainings };
}

function simulate(baseLevelValue, currentLevelValue, successRateValue) {
  const gains = getGains(baseLevelValue);

  let level = currentLevelValue;
  let exp = 0;
  let plates = 0;
  let trainings = 0;

  while (level < 100) {
    plates += platesPorTreino(level);
    trainings += 1;

    const gain = Math.random() < successRateValue ? gains.success : gains.fail;
    exp += gain;

    while (exp >= 100 && level < 100) {
      exp -= 100;
      level += 1;
    }
  }

  return { plates, trainings };
}

function calculateAverage(baseLevelValue, currentLevelValue, successRateValue) {
  const simulations = 2000;
  let totalPlates = 0;
  let totalTrainings = 0;

  for (let i = 0; i < simulations; i += 1) {
    const result = simulate(baseLevelValue, currentLevelValue, successRateValue);
    totalPlates += result.plates;
    totalTrainings += result.trainings;
  }

  return {
    plates: totalPlates / simulations,
    trainings: Math.ceil(totalTrainings / simulations),
  };
}

calculateButton.addEventListener('click', () => {
  const baseValue = Number(baseLevel.value);
  const currentValue = Number(currentLevel.value);
  const successValue = Number(successRate.value) / 100;

  if (Number.isNaN(currentValue) || currentValue < 5 || currentValue > 100) {
    alert('Informe um nível atual entre 5 e 100.');
    return;
  }

  const successResult = deterministic(baseValue, currentValue, true);
  const failResult = deterministic(baseValue, currentValue, false);

  if (successValue === 1) {
    successTreinos.textContent = successResult.trainings;
    successPlates.textContent = successResult.plates;
    failTreinos.textContent = failResult.trainings;
    failPlates.textContent = failResult.plates;
    avgTreinos.textContent = successResult.trainings;
    avgPlates.textContent = successResult.plates;
    resultsSection.classList.remove('hidden');
    return;
  }

  const averageResult = calculateAverage(baseValue, currentValue, successValue);

  successTreinos.textContent = successResult.trainings;
  successPlates.textContent = successResult.plates;
  failTreinos.textContent = failResult.trainings;
  failPlates.textContent = failResult.plates;
  avgTreinos.textContent = averageResult.trainings;
  avgPlates.textContent = averageResult.plates.toFixed(2);

  resultsSection.classList.remove('hidden');
});
