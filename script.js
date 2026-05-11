const input = document.querySelector("input");
const monster = document.getElementById("monster");
const importBox = document.getElementById("word-import");
const importBtn = document.getElementById("import-btn");
const exportBtn = document.getElementById("export-btn");
const learnedList = document.getElementById("learned-list");
const todoList = document.getElementById("todo-list");

let words = [
  { word: "facilitate", type: "v.", meaning: "促进；使容易" },
  { word: "academic", type: "adj.", meaning: "学术的" },
  { word: "evidence", type: "n.", meaning: "证据" },
  { word: "conclusion", type: "n.", meaning: "结论" },
  { word: "method", type: "n.", meaning: "方法" }
];

let learnedWords = [];
let currentWord = "";
let currentType = "";
let currentMeaning = "";
let currentIndex = 0;
let score = 0;
let combo = 0;

function showWord() {
  const unlearned = words.filter(item => {
    return !learnedWords.some(learned => learned.word === item.word);
  });

  const wordPool = unlearned.length > 0 ? unlearned : words;
  const randomItem = wordPool[Math.floor(Math.random() * wordPool.length)];

  currentWord = randomItem.word;
  currentType = randomItem.type;
  currentMeaning = randomItem.meaning;
  currentIndex = 0;

  monster.innerHTML = `
    <div id="score">⭐ Score: ${score}</div>
    <div id="combo">🔥 Combo: ${combo}</div>
    <div id="current-word">${currentWord}</div>
    <div id="meaning">${currentType} ${currentMeaning}</div>
  `;

  input.value = "";
  input.focus();

  renderLearnedList();
  renderTodoList();
}

input.addEventListener("input", () => {
  const typed = input.value;

  if (typed[currentIndex] === currentWord[currentIndex]) {
    currentIndex++;

    let display = "";

    for (let i = 0; i < currentWord.length; i++) {
      if (i < currentIndex) {
        display += `<span class="correct-letter">${currentWord[i]}</span>`;
      } else {
        display += currentWord[i];
      }
    }

    document.getElementById("current-word").innerHTML = display;
  }

  if (currentIndex === currentWord.length) {
    score += 10;
    combo += 1;

    if (!learnedWords.some(item => item.word === currentWord)) {
      learnedWords.push({
        word: currentWord,
        type: currentType,
        meaning: currentMeaning
      });
    }

    monster.innerHTML = `
      <div class="defeated">💥 Monster Defeated!</div>
      <div class="reward">+10 分</div>
      <div class="reward">🔥 Combo ${combo}</div>
    `;

    renderLearnedList();
    renderTodoList();

    setTimeout(showWord, 800);
  }
});

importBtn.addEventListener("click", () => {
  const text = importBox.value.trim();

  if (text === "") {
    alert("请先输入单词。格式：英文单词,词性,中文释义");
    return;
  }

  const lines = text.split("\n");
  const newWords = [];

  for (let line of lines) {
    const parts = line.split(",");

    if (parts.length !== 3) {
      alert("格式错误！必须使用：英文单词,词性,中文释义");
      return;
    }

    const word = parts[0].trim();
    const type = parts[1].trim();
    const meaning = parts[2].trim();

    if (word === "" || type === "" || meaning === "") {
      alert("格式错误！单词、词性、中文释义都不能为空。");
      return;
    }

    newWords.push({ word, type, meaning });
  }

  words = words.concat(newWords);

  alert("导入成功！");
  importBox.value = "";

  renderTodoList();
  showWord();
});

exportBtn.addEventListener("click", () => {
  let csv = "单词,词性,中文释义\n";

  words.forEach(item => {
    csv += `${item.word},${item.type},${item.meaning}\n`;
  });

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "IELTS单词表.csv";
  link.click();
});

function renderLearnedList() {
  learnedList.innerHTML = "";

  learnedWords.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `✅ ${item.word} - ${item.type} ${item.meaning}`;
    learnedList.appendChild(li);
  });
}

function renderTodoList() {
  todoList.innerHTML = "";

  words.forEach(item => {
    const isLearned = learnedWords.some(learned => learned.word === item.word);

    if (!isLearned) {
      const li = document.createElement("li");
      li.textContent = `${item.word} - ${item.type} ${item.meaning}`;
      todoList.appendChild(li);
    }
  });
}

showWord();