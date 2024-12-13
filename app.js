let rawDataDino = [];

fetch('./dino.json')
  .then((res) => res.json())
  .then((data) => {
    rawDataDino = data.Dinos;
  })
  .catch((error) => {});

function DinoConstructor(dinoData) {
  this.species = dinoData.species;
  this.diet = dinoData.diet;
  this.where = dinoData.where;
  this.when = dinoData.when;
  this.fact = dinoData.fact;
  this.weight = dinoData.weight;
  this.height = dinoData.height;
}

const comparedDino = {
  compareWeight: function (humanWeight) {
    const weightRatio = (this.weight / humanWeight).toFixed(1);
    if (weightRatio > 1) {
      return `${this.species} weighed ${weightRatio} times more than you!`;
    }
    if (weightRatio < 1) {
      return `You weigh ${(humanWeight / this.weight).toFixed(
        1
      )} times more than ${this.species}!`;
    }
    return `You weigh the same as ${this.species}!`;
  },
  compareHeight: function (humanHeight) {
    const heightRatio = (this.height / humanHeight).toFixed(1);
    if (heightRatio > 1) {
      return `${this.species} was ${heightRatio} times taller than you!`;
    }
    if (heightRatio < 1) {
      return `You are ${(humanHeight / this.height).toFixed(
        1
      )} times taller than ${this.species}!`;
    }
    return `You are the same height as ${this.species}!`;
  },
  compareDiet: function (humanDiet) {
    //'An' omnivore or 'a' herbivore/carnivore
    const article = humanDiet === 'omnivore' ? 'an' : 'a';

    if (humanDiet === this.diet) {
      return `You are ${article} ${humanDiet} and ${this.species} was too!`;
    } else {
      return `You are ${article} ${humanDiet}, but ${this.species} was a ${this.diet}.`;
    }
  },
};

DinoConstructor.prototype = comparedDino;

function createHuman(humanData) {
  const newDiv = document.createElement('div');
  newDiv.className = 'grid-item';
  newDiv.innerHTML = `<h3>${humanData.name}</h3><img src="images/human.png" alt="Human's image">`;

  return newDiv;
}

function createDino(dinoData, humanData) {
  let fact;

  const facts = [
    dinoData.fact,
    `The ${dinoData.species} lived in the ${dinoData.when} period.`,
    `The ${dinoData.species} lived in ${dinoData.where}.`,
    dinoData.compareWeight(humanData.weight),
    dinoData.compareHeight(humanData.height),
    dinoData.compareDiet(humanData.diet),
  ];

  randomNumber =
    dinoData.species === 'Pigeon' ? 0 : Math.round(Math.random() * 5);

  fact = facts[randomNumber];

  const newDiv = document.createElement('div');
  newDiv.className = 'grid-item';
  newDiv.innerHTML = `<h3>${
    dinoData.species
  }</h3><img src="images/${dinoData.species.toLowerCase()}.png" alt="image of ${
    dinoData.species
  } and a fact"><p>${fact}</p>`;

  return newDiv;
}

function handleValidate(e) {
  e.preventDefault();

  const humanData = getHumanData();
  const errorMessage = document.getElementById('error-message');

  if (humanData.name === '') {
    errorMessage.innerHTML = '<p>Please input a name</p>';
    return;
  } else if (humanData.height < 1) {
    errorMessage.innerHTML = '<p>Please input a height more than 0</p>';
    return;
  } else if (humanData.weight < 1) {
    errorMessage.innerHTML = '<p>Please input a weight more than 0</p>';
    return;
  }

  const dinoArray = createComparedDinoArray(humanData);

  updateUI(dinoArray, humanData);
}

function getHumanData() {
  const height =
    Number(document.getElementById('feet').value) * 12 +
    Number(document.getElementById('inches').value);

  const humanData = {
    name: document.getElementById('name').value,
    height: height,
    weight: Number(document.getElementById('weight').value),
    diet: document.getElementById('diet').value,
  };

  return humanData;
}

function createComparedDinoArray() {
  const dinos = JSON.parse(JSON.stringify(rawDataDino));
  if (dinos) {
    return dinos
      .map((dino) => new DinoConstructor(dino))
      .slice(0, 4)
      .concat(['human placeholder'])
      .concat(dinos.map((dino) => new DinoConstructor(dino)).slice(4));
  }
}

function handleTryAgain() {
  document.getElementById('error-message').innerHTML = '';
  document.getElementById('grid').innerHTML = '';
  document.getElementById('repeat-btn').style.display = 'none';
  document.querySelector('form').style.display = 'block';
}

function updateUI(dinoArray, humanData) {
  document.querySelector('form').style.display = 'none';

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 9; i++) {
    let gridSquare =
      i === 4 ? createHuman(humanData) : createDino(dinoArray[i], humanData);

    fragment.appendChild(gridSquare);
  }
  document.getElementById('grid').appendChild(fragment);
  document.getElementById('repeat-btn').style.display = 'block';
}

(function () {
  document
    .getElementById('compare-btn')
    .addEventListener('click', handleValidate);
  document
    .getElementById('repeat-btn')
    .addEventListener('click', handleTryAgain);
})();
