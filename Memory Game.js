const gameContainer = document.getElementById("game");
const startButton = document.getElementById("start");
const restartButton = document.getElementById("restart");
const scoreDisplay = document.getElementById("score");
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);

let cards = [];
let flippedCards = [];
let score = 0;
let lowestScore = localStorage.getItem("lowestScore") || Infinity;

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "yellow",
  "cyan",
  "magenta",
  "lightgreen",
  "brown",
];

function shuffle(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);

    counter--;

    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

function startGame() {
  cards = [];
  flippedCards = [];
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  gameContainer.innerHTML = "";
  createCards(20);
}

function restartGame() {
  cards = [];
  flippedCards = [];
  score = 0;
  lowestScore = localStorage.getItem("lowestScore") || Infinity;
  scoreDisplay.textContent = `Score: ${score}`;
  gameContainer.innerHTML = "";
  createCards(20);
}

function createCards(numCards) {
  let shuffledColors = shuffle(COLORS.slice(0, numCards / 2));
  let cardPairs = shuffledColors.concat(shuffledColors);

  for (let color of cardPairs) {
    const newDiv = document.createElement("div");

    newDiv.classList.add("card");
    newDiv.classList.add(color);
    newDiv.style.backgroundColor = "black"; // Set the initial background color to black

    newDiv.addEventListener("click", handleCardClick);

    gameContainer.append(newDiv);
    cards.push(newDiv);
  }
}

function flipCard(card) {
  if (flippedCards.length < 2) {
    card.classList.toggle("hidden-color");
    flippedCards.push(card);

    // Set the background color of the flipped card to its class color
    card.style.backgroundColor = card.classList[1];
    // Flip the card back to black after 2 seconds
    setTimeout(function () {
      card.style.backgroundColor = "black";
      card.classList.toggle("hidden-color");
      flippedCards.pop();
    }, 500);
  }
}

function showModal() {
  // Get the modal element
  const modal = document.querySelector(".modal");

  if (!modal) {
    console.error("Modal element not found");
    return;
  }

  // Get the <span> element that closes the modal
  const closeBtn = document.querySelector(".close");

  // Get the score display element
  const modalScore = document.querySelector(".modal-score");

  if (!modalScore) {
    console.error("Score display element not found");
    return;
  }

  // Update the score display element with the final score
  modalScore.textContent = `Your score is ${score}`;

  // Show the modal
  modal.style.display = "block";

  // When the user clicks on <span> (x), close the modal
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

let timerId;

function endGame() {
  clearInterval(timerId);

  const modal = document.querySelector(".modal");
  const modalText = modal.querySelector(".modal-text"); // Declare modalText within the endGame function

  if (!modalText) {
    console.error("Text display element not found");
    return;
  }

  if (cards.length === 0) {
    modalText.textContent = `YOU WON!`;
  } else {
    modalText.textContent = `Your score is`;
  }

  modal.style.display = "block";
}

// ... other functions ...

function checkMatch() {
  if (flippedCards.length !== 2) return;

  // Get the class of each flipped card
  const firstClass = flippedCards[0].classList[1];
  const secondClass = flippedCards[1].classList[1];

  if (firstClass === secondClass) {
    // Cards match
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;

    // Remove matched cards from the cards array
    cards = cards.filter((card) => !flippedCards.includes(card));

    // Check if the game is over
    if (cards.length === 0) {
      endGame();
    }

    flippedCards[0].style.visibility = "hidden";
    flippedCards[1].style.visibility = "hidden";
  } else {
    // Cards do not match
    flippedCards.forEach((card) => {
      setTimeout(function () {
        card.style.backgroundColor = "black";
        card.classList.toggle("hidden-color");
        card.isFlipped = false; // Reset the isFlipped property
      }, 500);
    });
  }
  flippedCards = [];
}

function handleCardClick(event) {
  let card = event.target;
  if (flippedCards.includes(card) || flippedCards.length === 2) return;

  flipCard(card);
  checkMatch();
}
