//get DOM elements by their IDs
const quizContainer = document.getElementById("quiz-container");
const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const startNextButton = document.getElementById("start-next-button");
const timerElement = document.getElementById("timer");
const endQuizButton = document.getElementById("end-quiz-button");

// create score element and append it to quizContainer
const scoreElement = document.createElement("p");
const homeButton = document.getElementById("home-button");
scoreElement.setAttribute("id", "score");
scoreElement.classList.add("hide");
quizContainer.appendChild(scoreElement);

//initialize variables
let shuffledQuestions,
  currentQuestionIndex,
  timer,
  score = 0;

//reload page when home button is clicked
homeButton.addEventListener("click", () => {
  location.reload();
});

//add event listener to startNextButton that starts quiz or sets next question
endQuizButton.addEventListener("click", endQuiz);

startNextButton.addEventListener("click", () => {
  if (startNextButton.innerText === "Start") {
    startQuiz();
  } else if (startNextButton.innerText === "Next") {
    currentQuestionIndex++;
    setNextQuestion();
  } else if (startNextButton.innerText === "Restart") {
    resetQuiz();
  }
});

//function to execute when endQuizButton is clicked

function endQuiz() {
  stopTimer();
  const name = document.getElementById("name").value;
  const number = document.getElementById("number").value;
  const scoreDisplay = `${score}/${questions.length}`;

  //create table row to display user's details and score
  const row = document.createElement("tr");
  const nameCell = document.createElement("td");
  const numberCell = document.createElement("td");
  const scoreCell = document.createElement("td");
  nameCell.textContent = name;
  numberCell.textContent = number;
  scoreCell.textContent = scoreDisplay;
  row.appendChild(nameCell);
  row.appendChild(numberCell);
  row.appendChild(scoreCell);
  const tbody = document.querySelector("#score-table tbody");
  tbody.appendChild(row);

  //display score and remarks
  scoreElement.textContent = `Score: ${scoreDisplay}`;
  scoreElement.classList.remove("hide");
  let remarks = "";
  if (score < questions.length * 0.3) {
    remarks = "That was bad!";
  } else if (
    score >= questions.length * 0.5 &&
    score < questions.length * 0.7
  ) {
    remarks = "OK!";
  } else {
    remarks = "Fantastic!";
  }
  alert(remarks);

  // change startNextButton text and show endQuizButton and startNextButton
  startNextButton.innerText = "Restart";
  startNextButton.classList.remove("hide");
  endQuizButton.classList.remove("hide");

  //display name, number and score

  const nameDisplay = document.createElement("p");
  nameDisplay.textContent = `Name: ${name}`;
  nameDisplay.classList.add("display");
  quizContainer.appendChild(nameDisplay);

  const numberDisplay = document.createElement("p");
  numberDisplay.textContent = `Number: ${number}`;
  numberDisplay.classList.add("display");
  quizContainer.appendChild(numberDisplay);

  const scoreDisplayElement = document.createElement("p");
  scoreDisplayElement.textContent = `Score: ${scoreDisplay}`;
  scoreDisplayElement.classList.add("display", "score");
  quizContainer.appendChild(scoreDisplayElement);

  createPieChart();
}
// function to create pie chart
function createPieChart() {
  const correctAnswers = score;
  const incorrectAnswers = questions.length - score;
  const data = [
    { label: "Correct Answers", count: correctAnswers },
    { label: "Incorrect Answers", count: incorrectAnswers },
  ];

  const width = 360;
  const height = 360;
  const radius = Math.min(width, height) / 2;

  const svg = d3
    .select("#pie-chart")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const color = d3.scaleOrdinal().range(["green", "red"]);

  const pie = d3
    .pie()
    .sort(null)
    .value(function (d) {
      return d.count;
    });

  const path = d3
    .arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  const legendSpacing = 20;
  const legendRectSize = 18;
  const legendHeight = legendRectSize + legendSpacing;

  const legend = svg
    .selectAll(".legend")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      const height = legendHeight * data.length;
      const offset = height / 2;
      const x = radius + 20;
      const y = i * legendHeight - offset;
      return `translate(${x}, ${y})`;
    });

  legend
    .append("rect")
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .style("fill", function (d) {
      return color(d.label);
    });

  legend
    .append("text")
    .attr("x", legendRectSize + 5)
    .attr("y", legendRectSize - 5)
    .style("font-size", "12px")
    .text(function (d) {
      return d.label;
    });

  const arc = svg
    .selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  arc
    .append("path")
    .attr("d", path)
    .attr("fill", function (d) {
      return color(d.data.label);
    });

  arc
    .append("text")
    .attr("transform", function (d) {
      return "translate(" + path.centroid(d) + ")";
    })
    .attr("dy", "0.35em")
    .style("font-size", "14px")
    .text(function (d) {
      return d.data.count;
    });
}

function startTimer() {
  let time = 0;
  timerElement.innerText = "0:00";

  timer = setInterval(() => {
    time++;
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerElement.innerText = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function startQuiz() {
  startNextButton.innerText = "Next";
  startNextButton.classList.remove("hide");
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  questionContainer.classList.remove("hide");
  setNextQuestion();
  startTimer();
}

function setNextQuestion() {
  resetState();
  if (currentQuestionIndex < shuffledQuestions.length) {
    showQuestion(shuffledQuestions[currentQuestionIndex]);
  } else {
    stopTimer();
  }
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("answer-button");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

function resetQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  resetState();
  clearInterval(timer);
  timerElement.innerHTML = "0:00";
  startQuiz();
  scoreElement.textContent = "";
  scoreElement.classList.add("hide");
}

function resetState() {
  clearStatusClass(document.body);
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct;
  setStatusClass(document.body, correct);
  Array.from(answerButtonsElement.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct);
  });
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    startNextButton.innerText = "Next";
  } else {
    startNextButton.innerText = "Restart";
  }
  if (shuffledQuestions.length === currentQuestionIndex + 1) {
    stopTimer();
  }
  if (correct) {
    score++;
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}
// questions for the quiz.
const questions = [
  {
    question: "What is the capital city of France?",
    answers: [
      { text: "Madrid", correct: false },
      { text: "Berlin", correct: false },
      { text: "Paris", correct: true },
      { text: "Rome", correct: false },
    ],
  },
  {
    question: 'Which planet is known as the "Red Planet"?',
    answers: [
      { text: "Venus", correct: false },
      { text: "Jupiter", correct: false },
      { text: "Mars", correct: true },
      { text: "Saturn", correct: false },
    ],
  },
  {
    question: "What is the smallest country in the world by land area?",
    answers: [
      { text: "Vatican City", correct: true },
      { text: "Monaco", correct: false },
      { text: "San Marino", correct: false },
      { text: "Liechtenstein", correct: false },
    ],
  },
  {
    question: 'Who wrote the famous novel "Pride and Prejudice"?',
    answers: [
      { text: "Charles Dickens", correct: false },
      { text: "Jane Austen", correct: true },
      { text: "Emily Bronte", correct: false },
      { text: "Virginia Woolf", correct: false },
    ],
  },
  {
    question: "What is the largest planet in our solar system?",
    answers: [
      { text: "Jupiter", correct: true },
      { text: "Neptune", correct: false },
      { text: "Saturn", correct: false },
      { text: "Uranus", correct: false },
    ],
  },
  {
    question: 'Which animal is known as the "King of the Jungle"?',
    answers: [
      { text: "Lion", correct: true },
      { text: "Tiger", correct: false },
      { text: "Leopard", correct: false },
      { text: "Panther", correct: false },
    ],
  },
  {
    question: "What is the highest mountain in the world?",
    answers: [
      { text: "Mount Kilimanjaro", correct: false },
      { text: "Mount Everest", correct: true },
      { text: "Mount Fuji", correct: false },
      { text: "Mount Denali", correct: false },
    ],
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: [
      { text: "Au", correct: true },
      { text: "Ag", correct: false },
      { text: "Cu", correct: false },
      { text: "Fe", correct: false },
    ],
  },
  {
    question: "What is the largest ocean in the world?",
    answers: [
      { text: "Atlantic Ocean", correct: false },
      { text: "Arctic Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Pacific Ocean", correct: true },
    ],
  },
  {
    question: "What is the unit of measurement for electric current?",
    answers: [
      { text: "Volt", correct: false },
      { text: "Watt", correct: false },
      { text: "Ampere", correct: true },
      { text: "Ohm", correct: false },
    ],
  },
];
