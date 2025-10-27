// Étape 3: Données du quiz + garde-fou d'absence de questions
// Intention: définir le modèle minimal et éviter un état cassé si aucune donnée

// Données du quiz (MVP)
const questions = [
  { text: "JavaScript : que retourne '5' + 3 ?", answers: ["8","53","undefined","NaN"], correctIndex: 1 },
  { text: "Quel attribut HTML définit le texte alternatif d’une image ?", answers: ["title","aria-label","alt","desc"], correctIndex: 2 }
];

// États du quiz
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswerIndex = null; // mis à jour à la sélection (étape 5)
let questionChecked = false; // empêche de recompter plusieurs fois (étape 6)

// Utilitaires DOM (résolus au chargement)
function getEl(id) { return document.getElementById(id); }

function handleNoQuestions() {
  // Affiche un message clair dans la live region et désactive les actions
  const feedbackEl = getEl('feedback');
  const startBtn = getEl('start-btn');
  const nextBtn = getEl('next-btn');
  const progressEl = getEl('progress');

  feedbackEl.textContent = "Erreur : aucune question n’est disponible. Veuillez réessayer plus tard.";
  progressEl.textContent = 'Progression : 0/0';
  if (startBtn) startBtn.disabled = true;
  if (nextBtn) nextBtn.disabled = true;
}

document.addEventListener('DOMContentLoaded', () => {
  // Met à jour la progression initiale si des questions existent
  const progressEl = getEl('progress');
  if (!Array.isArray(questions) || questions.length === 0) {
    handleNoQuestions();
    return; // Stoppe toute logique future tant que les données sont absentes
  }
  if (progressEl) {
    progressEl.textContent = `Progression : 0/${questions.length}`;
  }
  // Branche le bouton Commencer
  const startBtn = getEl('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', startQuiz);
  }
  // Branche le bouton Question suivante (valider puis avancer)
  const nextBtn = getEl('next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', onNextButtonClick);
  }
  // Branche le bouton Rejouer
  const restartBtn = getEl('restart-btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', restartQuiz);
  }
});


// Démarre le quiz: réinitialise l'état, cache "Commencer", affiche la première question
function startQuiz() {
  score = 0;
  currentQuestionIndex = 0;
  questionChecked = false;

  const startBtn = getEl('start-btn');
  const nextBtn = getEl('next-btn');
  const restartBtn = getEl('restart-btn');
  const feedbackEl = getEl('feedback');
  const progressEl = getEl('progress');

  if (startBtn) startBtn.hidden = true;
  if (restartBtn) restartBtn.hidden = true; // on ne l'utilisera qu'en fin de quiz
  if (nextBtn) {
    nextBtn.disabled = true; // restera désactivé tant qu'aucune réponse n'est choisie
    nextBtn.textContent = 'Valider';
    nextBtn.dataset.state = 'validate';
    nextBtn.hidden = false;
  }

  if (feedbackEl) feedbackEl.textContent = '';
  if (progressEl) progressEl.textContent = `Progression : 1/${questions.length}`;

  renderQuestion(currentQuestionIndex);
}

// Affiche la question et génère des boutons de réponses (sélection unique gérée à l'étape 5)
function renderQuestion(index) {
  const question = questions[index];
  const questionTextEl = getEl('question-text');
  const answersEl = getEl('answers');
  const nextBtn = getEl('next-btn');
  const feedbackEl = getEl('feedback');

  if (!question || !questionTextEl || !answersEl) return;

  // Met à jour le texte de la question
  questionTextEl.textContent = question.text;

  // Vide et régénère les réponses
  answersEl.innerHTML = '';
  selectedAnswerIndex = null; // reset sélection
  questionChecked = false; // on n'a pas encore validé cette question
  question.answers.forEach((answerText, answerIndex) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'answer-btn';
    btn.textContent = answerText;
    btn.setAttribute('data-answer-index', String(answerIndex));
    // On prépare aria-pressed pour l'étape 5 (boutons toggle)
    btn.setAttribute('aria-pressed', 'false');
    // Sélectionne cette réponse au clic (clavier → Enter/Espace déclenchent click sur button)
    btn.addEventListener('click', () => selectAnswer(btn));
    answersEl.appendChild(btn);
  });

  // Nettoie le feedback et maintient "Suivante" désactivé jusqu'à la sélection (étape 5)
  if (feedbackEl) feedbackEl.textContent = '';
  if (nextBtn) {
    nextBtn.disabled = true;
    nextBtn.textContent = 'Valider';
    nextBtn.dataset.state = 'validate';
  }

  // Place le focus sur la première réponse pour un flux clavier naturel
  const firstAnswerBtn = answersEl.querySelector('button');
  if (firstAnswerBtn) {
    firstAnswerBtn.focus();
  }
}

// Gère la sélection d'une réponse (état visuel + accessibilité)
function selectAnswer(clickedBtn) {
  const answersEl = getEl('answers');
  const nextBtn = getEl('next-btn');
  if (!answersEl) return;

  const buttons = answersEl.querySelectorAll('button');
  buttons.forEach((b) => {
    b.classList.remove('selected');
    b.setAttribute('aria-pressed', 'false');
  });

  clickedBtn.classList.add('selected');
  clickedBtn.setAttribute('aria-pressed', 'true');
  selectedAnswerIndex = Number(clickedBtn.getAttribute('data-answer-index'));

  if (nextBtn) nextBtn.disabled = false; // activé une fois une réponse choisie
}

// Vérifie la réponse choisie, met à jour le score et annonce le feedback
function checkAnswer() {
  const feedbackEl = getEl('feedback');
  const answersEl = getEl('answers');
  const nextBtn = getEl('next-btn');
  if (!answersEl || selectedAnswerIndex === null) return;
  if (questionChecked) return; // évite double comptage

  const { correctIndex, answers } = questions[currentQuestionIndex];
  const isCorrect = selectedAnswerIndex === correctIndex;
  if (isCorrect) {
    score += 1;
  }

  // Message de feedback accessible (annoncé poliment)
  if (feedbackEl) {
    feedbackEl.textContent = isCorrect
      ? 'Bonne réponse !'
      : `Mauvaise réponse. La bonne réponse était « ${answers[correctIndex]} ».`;
  }

  // Verrouille les réponses
  const buttons = answersEl.querySelectorAll('button');
  buttons.forEach((b) => {
    b.disabled = true;
  });

  questionChecked = true;
  // Prépare le bouton pour passer à la question suivante
  if (nextBtn) {
    nextBtn.disabled = false;
    nextBtn.textContent = 'Question suivante';
    nextBtn.dataset.state = 'next';
    nextBtn.focus();
  }
}

// Gère le flux du bouton "Suivante": valider d'abord, puis avancer
function onNextButtonClick() {
  const nextBtn = getEl('next-btn');
  const state = nextBtn ? nextBtn.dataset.state : 'validate';
  if (state === 'validate') {
    checkAnswer();
  } else {
    goToNextQuestion();
  }
}

// Met à jour la progression "Question X/Y"
function updateProgress() {
  const progressEl = getEl('progress');
  if (progressEl) {
    progressEl.textContent = `Progression : ${currentQuestionIndex + 1}/${questions.length}`;
  }
}

// Passe à la question suivante ou affiche le score final
function goToNextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex += 1;
    updateProgress();
    renderQuestion(currentQuestionIndex);
  } else {
    showFinalScore();
  }
}

// Affiche le score final et le bouton Rejouer (branché à l'étape 8)
function showFinalScore() {
  const questionTextEl = getEl('question-text');
  const answersEl = getEl('answers');
  const feedbackEl = getEl('feedback');
  const nextBtn = getEl('next-btn');
  const restartBtn = getEl('restart-btn');

  if (questionTextEl) questionTextEl.textContent = 'Résultats du quiz';
  if (answersEl) {
    answersEl.innerHTML = '';
    const summary = document.createElement('p');
    summary.textContent = `Score final : ${score}/${questions.length}`;
    answersEl.appendChild(summary);
  }
  if (feedbackEl) feedbackEl.textContent = '';
  if (nextBtn) nextBtn.hidden = true;
  if (restartBtn) {
    restartBtn.hidden = false;
    restartBtn.focus();
  }
}

// Relance le quiz (étape 8)
function restartQuiz() {
  const startBtn = getEl('start-btn');
  if (startBtn) startBtn.hidden = false; // option A: ré-afficher Commencer, ou lancer directement
  startQuiz(); // relance directement pour une UX fluide
}

