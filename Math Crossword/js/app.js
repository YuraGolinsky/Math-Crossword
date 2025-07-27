// ==================== Level Data ====================

const levels = [
  {
    grid: [
      ['10', '+', '', '=', '14'],
      ['15', '+', '', '=', '19'],
      ['19', '-', '', '=', '11'],
      ['15', '÷', '', '=', '5'],
    ],
    answers: { '0-2': '4', '1-2': '4', '2-2': '8', '3-2': '3' }
  },
  {
    grid: [
      ['8', '-', '', '=', '3'],
      ['12', '÷', '', '=', '4'],
      ['5', '×', '', '=', '20'],
    ],
    answers: { '0-2': '5', '1-2': '3', '2-2': '4' }
  },
  {
    grid: [
      ['7', '+', '', '=', '13'],
      ['9', '-', '', '=', '4'],
      ['6', '×', '', '=', '18'],
    ],
    answers: { '0-2': '6', '1-2': '5', '2-2': '3' }
  },
  {
    grid: [
      ['20', '-', '', '=', '12'],
      ['14', '+', '', '=', '19'],
      ['8', '×', '', '=', '56'],
    ],
    answers: { '0-2': '8', '1-2': '5', '2-2': '7' }
  },
  {
    grid: [
      ['30', '÷', '', '=', '6'],
      ['11', '+', '', '=', '13'],
      ['13', '-', '', '=', '10'],
      ['9', '×', '', '=', '27'],
    ],
    answers: { '0-2': '5', '1-2': '2', '2-2': '3', '3-2': '3' }
  },
  {
    grid: [
      ['18', '-', '', '=', '9'],
      ['7', '+', '', '=', '15'],
      ['16', '÷', '', '=', '4'],
    ],
    answers: { '0-2': '9', '1-2': '8', '2-2': '4' }
  },
  {
    grid: [
      ['25', '-', '', '=', '17'],
      ['13', '+', '', '=', '18'],
      ['18', '-', '', '=', '14'],
      ['6', '×', '', '=', '30'],
    ],
    answers: { '0-2': '8', '1-2': '5', '2-2': '4', '3-2': '5' }
  },
  {
    grid: [
      ['40', '÷', '', '=', '8'],
      ['9', '-', '', '=', '3'],
      ['7', '+', '', '=', '16'],
    ],
    answers: { '0-2': '5', '1-2': '6', '2-2': '9' }
  },
  {
    grid: [
      ['21', '-', '', '=', '12'],
      ['14', '+', '', '=', '19'],
      ['5', '×', '', '=', '25'],
    ],
    answers: { '0-2': '9', '1-2': '5', '2-2': '5' }
  },
  {
    grid: [
      ['50', '÷', '', '=', '10'],
      ['8', '+', '', '=', '10'],
      ['10', '-', '', '=', '7'],
      ['9', '×', '', '=', '36'],
    ],
    answers: { '0-2': '5', '1-2': '2', '2-2': '3', '3-2': '4' }
  },
];

// ==================== State Variables ====================
let currentLevel = 0;          // Current selected level index
let activeCell = null;         // Currently selected cell for input
let currentLang = 'uk';        // Current UI language ('uk' or 'en')

// ==================== DOM Elements ====================
const grid = document.getElementById('puzzle-grid');
const levelSelect = document.getElementById('levelSelect');
const result = document.getElementById('result');

// ==================== Grid Creation ====================
/**
 * Build the grid based on the current level.
 * Empty cells are interactive and can accept numbers.
 */
function createGrid() {
  const level = levels[currentLevel];
  grid.innerHTML = '';

  level.grid.forEach((row, r) => {
    row.forEach((cellValue, c) => {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      const key = `${r}-${c}`;
      if (cellValue === '') {
        // Empty cell, user can click and input number
        cell.classList.add('input');
        cell.setAttribute('id', key);
        cell.addEventListener('click', () => setActiveCell(cell));
      } else {
        // Fixed value cell
        cell.textContent = cellValue;
      }
      grid.appendChild(cell);
    });
  });
  activeCell = null; // Clear active cell on grid rebuild
}

// ==================== Cell Activation ====================
/**
 * Highlight clicked cell as active.
 */
function setActiveCell(cell) {
  if (activeCell) activeCell.classList.remove('active');
  activeCell = cell;
  cell.classList.add('active');
}

// ==================== Number Insertion ====================
/**
 * Insert a number into the active cell.
 */
function insertNumber(num) {
  if (!activeCell) return;
  activeCell.textContent = num;
  activeCell.classList.add('pop');
  setTimeout(() => activeCell.classList.remove('pop'), 300);
}

// ==================== Number Buttons ====================
/**
 * Create numeric buttons for input (1–9 and backspace).
 */
function createNumberButtons() {
  const container = document.getElementById('number-buttons');
  container.innerHTML = '';

  for (let i = 1; i <= 9; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.onclick = () => insertNumber(i);
    container.appendChild(btn);
  }

  // Backspace button
  const delBtn = document.createElement('button');
  delBtn.textContent = '⌫';
  delBtn.onclick = () => {
    if (activeCell) activeCell.textContent = '';
  };
  container.appendChild(delBtn);
}
document.getElementById('check-btn').addEventListener('click', checkAnswers);

// ==================== Answer Checking ====================
/**
 * Compare user's input with correct answers.
 * Highlight correct cells green, incorrect cells red.
 * Show results in selected language.
 */
function checkAnswers() {
  const level = levels[currentLevel];
  let correct = 0;
  const total = Object.keys(level.answers).length;

  for (const key in level.answers) {
    const cell = document.getElementById(key);
    if (cell && cell.textContent.trim() === level.answers[key]) {
      cell.style.backgroundColor = '#c7f9cc'; // Green for correct
      correct++;
    } else if(cell) {
      cell.style.backgroundColor = '#ffcccc'; // Red for wrong
    }
  }

  result.textContent = currentLang === 'uk' 
    ? `Правильно: ${correct} з ${total}` 
    : `Correct: ${correct} of ${total}`;
}

// ==================== Level Selector ====================
/**
 * Fill level dropdown and bind change event.
 */
function populateLevelSelect() {
  levels.forEach((_, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = currentLang === 'uk' ? `Рівень ${i + 1}` : `Level ${i + 1}`;
    levelSelect.appendChild(option);
  });
}

// ==================== Theme Toggle ====================
document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.getElementById('themeToggle').textContent =
    document.body.classList.contains('dark') ? '☀️' : '🌙';
});

// ==================== Level Change ====================
levelSelect.addEventListener('change', (e) => {
  currentLevel = parseInt(e.target.value);
  createGrid();
  result.textContent = ''; // Clear previous result on level change
});

// ==================== Keyboard Support ====================
document.addEventListener('keydown', (e) => {
  if (!activeCell) return;
  if (e.key >= '1' && e.key <= '9') insertNumber(e.key);
  if (e.key === 'Backspace' || e.key === 'Delete') activeCell.textContent = '';
});

// ==================== Help Modal ====================
const helpToggle = document.getElementById('helpToggle');
const helpModal = document.getElementById('helpModal');
const closeHelp = document.getElementById('closeHelp');

helpToggle.addEventListener('click', () => helpModal.classList.remove('hidden'));
closeHelp.addEventListener('click', () => helpModal.classList.add('hidden'));
helpModal.addEventListener('click', (e) => { if (e.target === helpModal) helpModal.classList.add('hidden'); });

// ==================== Translations ====================
const translations = {
  uk: {
    title: "Математичний Кросворд",
    level: "Рівень:",
    helpTitle: "Як грати в Математичний Кросворд",
    helpText: `Обирай рівень гри у випадаючому списку.<br />
                Перед тобою - рядки з прикладами, в яких пропущені числа.<br />
                Твоє завдання - заповнити порожні клітинки, використовуючи кнопки з цифрами внизу.<br />
                Після заповнення всіх клітинок натискай кнопку <strong>Перевірити</strong>.<br />
                Якщо всі відповіді правильні - отримаєш вітання і зможеш перейти далі.<br />
                Насолоджуйся грою і прокачуй свої математичні навички!`,
    checkBtn: "Перевірити",
    helpBtnTitle: "Допомога",
    themeBtnTitle: "Змінити тему"
  },
  en: {
    title: "Math Crossword",
    level: "Level:",
    helpTitle: "How to play Math Crossword",
    helpText: `Choose the game level from the dropdown menu.<br />
                You will see rows with math problems where numbers are missing.<br />
                Your task is to fill in the missing cells using the number buttons below.<br />
                After filling all cells, press <strong>Check</strong>.<br />
                If all answers are correct, you will get a congratulation and can move to the next level.<br />
                Enjoy the game and improve your math skills!`,
    checkBtn: "Check",
    helpBtnTitle: "Help",
    themeBtnTitle: "Change theme"
  }
};

// ==================== Language Switch ====================
document.getElementById('langToggle').addEventListener('click', () => {
  currentLang = currentLang === 'uk' ? 'en' : 'uk';
  moveLangSlider();
  updateLanguageUI();
});

/**
 * Move slider inside language switch.
 */
function moveLangSlider() {
  const slider = document.getElementById('langSlider');
  const eng = document.getElementById('langEng');
  const ukr = document.getElementById('langUkr');

  if (currentLang === 'en') {
    slider.style.left = '43px';
    eng.classList.add('active');
    ukr.classList.remove('active');
  } else {
    slider.style.left = '3px';
    eng.classList.remove('active');
    ukr.classList.add('active');
  }
}


/**
 * Update UI texts based on the selected language.
 */
function updateLanguageUI() {
  const t = translations[currentLang];
  document.getElementById('page-title').textContent = t.title;
  document.getElementById('game-title').textContent = t.title;
  document.getElementById('level-label').textContent = t.level;

  // Update help modal content
  document.getElementById('help-title').textContent = t.helpTitle;
  document.getElementById('help-text').innerHTML = t.helpText;

  // Update buttons text and tooltips
  document.getElementById('check-btn').textContent = t.checkBtn;
  document.getElementById('helpToggle').title = t.helpBtnTitle;
  document.getElementById('themeToggle').title = t.themeBtnTitle;

  // Update level select options text
  levelSelect.innerHTML = '';
  populateLevelSelect();

  // Clear result text on language change
  result.textContent = '';
}

// ==================== Initialization ====================
populateLevelSelect();
createGrid();
createNumberButtons();
updateLanguageUI();
moveLangSlider();
