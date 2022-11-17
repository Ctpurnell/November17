
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// variables to reference DOM elements
var questionsEl = document.getElementById("questions");
var timerEl = document.getElementById("time");
var choicesEl = document.getElementById("choices");
var submitBtn = document.getElementById("submit");
var startBtn = document.getElementById("start");
var initialsEl = document.getElementById("initials");
var feedbackEl = document.getElementById("feedback");
var timeLeft = 75;
var downloadTimer;
var quizOver = false; //<-----------------------------------added var to stop clock.
// sound effects
var sfxRight = new Audio("./style/sfx/correct.wav");
var sfxWrong = new Audio("./style/sfx/incorrect.wav");

function showNextQuestion() {
  //clear out any previous question

  //get next question
  var nextQuestion = questions[currentQuestionIndex];
}

function startQuiz() {
  // hide start screen

  var startScreenEl = document.getElementById("start-screen");
  startScreenEl.setAttribute("class", "hide");
  showNextQuestion();
  // un-hide questions section
  questionsEl.removeAttribute("class");
  //Trying to create a timer..........................................................................................
  downloadTimer = setInterval(function () {
    if (timeLeft <= 0 || currentQuestionIndex === questions.length) {
      clearInterval(downloadTimer);
      timerEl.innerHTML = "Game Over";
    } else {
      timerEl.innerHTML = timeLeft + " seconds remaining";
    }
    if (quizOver) {
      clearInterval(downloadTimer);
      downloadTimer = null;
    }
    timeLeft--;
  }, 1000);
}

startBtn.addEventListener("click", function (event) {
  event.stopPropagation();
  startQuiz();
});

// show starting time
timerEl.textContent = timeLeft;

getQuestion();

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  var titleEl = document.getElementById("question-title");
  titleEl.textContent = currentQuestion.title; //getting questions to appear............................................

  // clear out any old question choices
  choicesEl.innerHTML = "";

  // loop over choices
  for (var i = 0; i < currentQuestion.choices.length; i++) {
    // create new button for each choice
    var choice = currentQuestion.choices[i];
    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);

    choiceNode.textContent = i + 1 + ". " + choice;

    // display on the page
    choicesEl.appendChild(choiceNode);
  }
}

function questionClick(event) {
  var buttonEl = event.target;

  // if the clicked element is not a choice button, do nothing.
  if (!buttonEl.matches(".choice")) {
    return;
  }

  // check if user guessed wrong
  if (buttonEl.value !== questions[currentQuestionIndex].answer) {
    // penalize time
    timeLeft -= 15;

    if (timeLeft < 0) {
      timeLeft = 0;
    }

    // display new time on page
    timerEl.textContent = timeLeft;

    // play "wrong" sound effect
    sfxWrong.play();

    feedbackEl.textContent = "Wrong!";
  } else {
    // play "right" sound effect
    sfxRight.play();

    feedbackEl.textContent = "Correct!";
  }

  // flash right/wrong feedback on page for half a second
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function () {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);

  // move to next question
  currentQuestionIndex++;

  // check if we've run out of questions
  if (time <= 0 || currentQuestionIndex === questions.length) {
    quizEnd();
    clearInterval(downloadTimer);
    quizOver = true; //<----------------------------------one of several attempts to stop a clock!
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(downloadTimer);
  score = timeLeft;
  // show end screen
  var endScreenEl = document.getElementById("end-screen");
  endScreenEl.removeAttribute("class");

  // show final score
  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = timeLeft;

  // hide questions section
  questionsEl.setAttribute("class", "hide");
}

function saveHighscore() {
  // get value of input box
  var initials = initialsEl.value.trim();

  // make sure value wasn't empty
  if (initials !== "") {
    // get saved scores from localstorage, or if not any, set to empty array
    var highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];

    // format new score object for current user
    var newScore = {
      score: score,
      initials: initials,
    };

    // save to localstorage
    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));

    // redirect to next page
    window.location.href = "highscores.html";
  }
}

function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === "Enter") {
    saveHighscore();
  }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighscore;

// user clicks button to start quiz
// startBtn.onclick = startQuiz;<-------------------------------------not needed. 

// user clicks on element containing choices
choicesEl.onclick = questionClick;

initialsEl.onkeyup = checkForEnter;
