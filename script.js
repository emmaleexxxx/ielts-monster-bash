function cleanWord(text) {
  return text
    .trim()
    .replace(/^\s*\d+[\.\、\)]\s*/, "")
    .replace(/\s+/g, " ");
}
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
let monsterHP = 100;

const monsterColors = [
  "#A8B8C8",
  "#D8B4A0",
  "#A8B5A2",
  "#B8A9C9"
];

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
    <div class="status-bar">
      <div id="score">⭐ Score: ${score}</div>
      <div id="combo">🔥 Combo: ${combo}</div>
    </div>

    <div class="monster-body">
      <div class="eye left"></div>
      <div class="eye right"></div>
      <div class="mouth"></div>
    </div>

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

 const lines = text
  .split("\n")
  .map(line => line.trim())
  .filter(line => line.includes(","))
  .map(line => line.replace(/^\d+[\.\、\)]\s*/, ""));
  const newWords = [];

  for (let line of lines) {
    const parts = line.split(",");

    if (parts.length !== 3) {
      alert("格式错误！必须使用：英文单词,词性,中文释义");
      return;
    }

    const word = cleanWord(parts[0]);
    const type = parts[1].trim();
    const meaning = parts[2].trim();

    if (word === "" || type === "" || meaning === "") {
      alert("格式错误！单词、词性、中文释义都不能为空。");
      return;
    }

    newWords.push({ word, type, meaning });
  }

  words = words.concat(newWords);
words = words.map(item => ({
  ...item,
  word: cleanWord(item.word)
}));
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

  words.forEach((item, index) => {
    const isLearned = learnedWords.some(learned => learned.word === item.word);

    if (!isLearned) {
      const li = document.createElement("li");

      li.innerHTML = `
        <div class="word-info">
          <strong>${index + 1}. ${item.word}</strong>
          <span>${item.type} ${item.meaning}</span>
        </div>

        <div class="word-actions">
          <button class="small-btn edit-btn" onclick="editWord(${index})">修改</button>
          <button class="small-btn delete-btn" onclick="deleteWord(${index})">删除</button>
        </div>
      `;

      todoList.appendChild(li);
    }
  });
}

showWord();