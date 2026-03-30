speechSynthesis.onvoiceschanged = () => {
  console.log("voices loaded");
};

require('dotenv').config();
// const API = "http://localhost:3000";
const API = "";
let allSongs = [];
let recognition = null;
let currentLang = "th";
let translateCache = {};

const moodTheme = {
  "😊": {
    bg: "#f5f0ff",
    border: "#e0d4ff",
    tagBg: "#f3eeff",
    tagBorder: "#ddd0f8",
    tagColor: "#7c5cbf",
    dot: "#a78bfa",
    moodLabel: "#b09fd0",
    moodName: "#5a4480",
    line: "#f0eaf8",
    flag: "#c3b5dc",
    text: "#7a6a96",
    bar: "#c4b0ff",
    foot: "#f0eaf8",
    footLabel: "#c3b5dc",
  },
  "😢": {
    bg: "#eef6ff",
    border: "#c8dff8",
    tagBg: "#eef6ff",
    tagBorder: "#c8dff8",
    tagColor: "#4a82c4",
    dot: "#7ab8f5",
    moodLabel: "#9dbfe0",
    moodName: "#4a6e9a",
    line: "#e4f0fc",
    flag: "#9dbfe0",
    text: "#607a96",
    bar: "#a8d0f0",
    foot: "#e4f0fc",
    footLabel: "#9dbfe0",
  },
  "🔥": {
    bg: "#fff8ec",
    border: "#f8dfa0",
    tagBg: "#fff8ec",
    tagBorder: "#f8dfa0",
    tagColor: "#b07d1a",
    dot: "#f5b942",
    moodLabel: "#d4a84b",
    moodName: "#8a5c10",
    line: "#faecd0",
    flag: "#d4a84b",
    text: "#7a5a30",
    bar: "#f5ce80",
    foot: "#faecd0",
    footLabel: "#d4a84b",
  },
  "❤️": {
    bg: "#fff0f3",
    border: "#f8c8d0",
    tagBg: "#fff0f3",
    tagBorder: "#f8c8d0",
    tagColor: "#c0395a",
    dot: "#f07090",
    moodLabel: "#e090a0",
    moodName: "#8a2040",
    line: "#fce8ec",
    flag: "#e090a0",
    text: "#8a506a",
    bar: "#f0a0b8",
    foot: "#fce8ec",
    footLabel: "#e090a0",
  },
  "🙂": {
    bg: "#f0fbf5",
    border: "#b8e8cc",
    tagBg: "#f0fbf5",
    tagBorder: "#b8e8cc",
    tagColor: "#2e8a58",
    dot: "#60c888",
    moodLabel: "#80c8a0",
    moodName: "#1e6040",
    line: "#d8f2e4",
    flag: "#80c8a0",
    text: "#407858",
    bar: "#90d8b0",
    foot: "#d8f2e4",
    footLabel: "#80c8a0",
  },
  // เพิ่มใหม่
  "😡": {
    bg: "#fff2f0",
    border: "#fcc8c0",
    tagBg: "#fff2f0",
    tagBorder: "#fcc8c0",
    tagColor: "#c03a28",
    dot: "#f07060",
    moodLabel: "#e09888",
    moodName: "#8a2a18",
    line: "#fde0d8",
    flag: "#e09888",
    text: "#8a4a40",
    bar: "#f4a898",
    foot: "#fde0d8",
    footLabel: "#e09888",
  },
  "😐": {
    bg: "#f5f4f2",
    border: "#dddad4",
    tagBg: "#f5f4f2",
    tagBorder: "#dddad4",
    tagColor: "#6a6560",
    dot: "#aaa598",
    moodLabel: "#b0ada8",
    moodName: "#4a4540",
    line: "#eceae6",
    flag: "#b0ada8",
    text: "#6a6560",
    bar: "#c8c4bc",
    foot: "#eceae6",
    footLabel: "#b0ada8",
  },
  "😰": {
    bg: "#f0f4ff",
    border: "#c0ccf4",
    tagBg: "#f0f4ff",
    tagBorder: "#c0ccf4",
    tagColor: "#3a52b8",
    dot: "#6880e8",
    moodLabel: "#8898d8",
    moodName: "#2a3880",
    line: "#dce4f8",
    flag: "#8898d8",
    text: "#4a5888",
    bar: "#a0b0e8",
    foot: "#dce4f8",
    footLabel: "#8898d8",
  },
  "🤩": {
    bg: "#fef8ff",
    border: "#f0d0f8",
    tagBg: "#fef8ff",
    tagBorder: "#f0d0f8",
    tagColor: "#a030c0",
    dot: "#d870f0",
    moodLabel: "#c890d8",
    moodName: "#700888",
    line: "#f8e8fc",
    flag: "#c890d8",
    text: "#805890",
    bar: "#e0a8f0",
    foot: "#f8e8fc",
    footLabel: "#c890d8",
  },
  "😴": {
    bg: "#f2f0fa",
    border: "#ccc8e8",
    tagBg: "#f2f0fa",
    tagBorder: "#ccc8e8",
    tagColor: "#5048a0",
    dot: "#9890d0",
    moodLabel: "#a8a0c8",
    moodName: "#382870",
    line: "#e4e0f4",
    flag: "#a8a0c8",
    text: "#605878",
    bar: "#b8b0d8",
    foot: "#e4e0f4",
    footLabel: "#a8a0c8",
  },
};
const emojiName = {
  "😊": "สุข",
  "😢": "เศร้า",
  "🔥": "สนุก",
  "❤️": "รัก",
  "🙂": "สงบ · ผ่อนคลาย",
  "😡": "โกรธ",
  "😐": "เฉย ๆ",
  "😰": "เครียด · กังวล",
  "🤩": "ตื่นเต้น",
  "😴": "เหนื่อย",
};

const categoryName = {
  เศร้า: "เพลงเศร้า",
  รัก: "เพลงรัก",
  สนุก: "เพลงสนุก",
  กำลังใจ: "เพลงกำลังใจ",
  สุข: "เพลงมีความสุข",
  ผ่อนคลาย: "เพลงผ่อนคลาย",
  คิดถึง: "เพลงคิดถึง",
  ก่อนนอน: "เพลงก่อนนอน",
  ปลุกพลัง: "เพลงปลุกพลัง",
  เหงา: "เพลงเหงา",
  สมาธิ: "เพลงสมาธิ",
  เช้า: "เพลงยามเช้า",
  ขับรถ: "เพลงขับรถ",
  หนังสือ: "เพลงอ่านหนังสือ",
};

const defaultTheme = moodTheme["😊"];

let cardCount = 0;

async function createCard(d) {
  cardCount++;
  const num = String(cardCount).padStart(3, "0");
  const desc = await translateText(d.description, "en");
  const t = moodTheme[d.emoji] || defaultTheme;

  const barHeights = [5, 10, 14, 7, 12, 4, 9];

  return `
  <div class="card">
    <div class="card-top">
      <div class="card-no">No. ${num}</div>
      <div class="card-title">${d.song_name}</div>
      <div class="card-tag" style="background:${t.tagBg};border-color:${t.tagBorder}">
        <div class="card-tag-dot" style="background:${t.dot}"></div>
        <span class="card-tag-text" style="color:${t.tagColor}">${categoryName[d.category] || d.category}</span>
      </div>
    </div>

    <div class="card-mood-strip">
      <div class="mood-face" style="background:${t.bg};border-color:${t.border}">${d.emoji}</div>
      <div>
        <div class="mood-name" style="color:${t.moodName}">${emojiName[d.emoji] || d.emoji}</div>
      </div>
    </div>

    <div class="card-desc">
      <div>
        <div class="desc-lang">
   
          <div class="desc-line" style="background:${t.line}"></div>
        </div>
        <p class="desc-text" style="color:${t.text}">${d.description}</p>
      </div>
      <div>
        <div class="desc-lang">

          <div class="desc-line" style="background:${t.line}"></div>
        </div>
        <p class="desc-text" style="color:${t.text}">${desc}</p>
      </div>
    </div>

    <div class="card-foot" style="border-color:${t.foot}">
      <span class="foot-label" style="color:${t.footLabel}">Music Museum</span>
      <div class="card-bars">
        ${barHeights.map((h) => `<span style="height:${h}px;background:${t.bar}"></span>`).join("")}
      </div>
    </div>
  </div>`;
}

async function translateText(text, targetLang) {
  const key = text + "_" + targetLang;

  // ถ้าเคยแปลแล้ว ใช้ cache
  if (translateCache[key]) {
    return translateCache[key];
  }

  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" +
    targetLang +
    "&dt=t&q=" +
    encodeURIComponent(text);

  const res = await fetch(url);
  const data = await res.json();

  const translated = data[0][0][0];

  // เก็บลง cache
  translateCache[key] = translated;

  return translated;
}

function setLanguage(lang) {
  currentLang = lang;
  const emojiFilter = document.getElementById("emojiFilter");
  const categoryFilter = document.getElementById("categoryFilter");
  const emojiPopup = document.getElementById("emoji");
  const categoryPopup = document.getElementById("category");
  const emoji = document.getElementById("emoji");
  if (lang === "th") {
    document.querySelector("h1").innerText = "หนึ่งเพลง หลายเรื่องราว";
    document.getElementById("search").placeholder = "ค้นหาเพลง";
    document.getElementById("addSongButton").innerText = "เพิ่มเพลง";
    document.getElementById("saveButton").innerText = "บันทึก";
    document.getElementById("fabAdd").innerText = "🎵 เพิ่มเพลง";
    document.getElementById("fabVoice").innerText = "🎤 กรอกข้อมูลด้วยเสียง";
    document.getElementById("mipage").innerText = "🎤 กรอกข้อมูลด้วยเสียง";

    // popup
    document.getElementById("popupTitle").innerText = "เพิ่มเพลง";
    document.getElementById("songName").placeholder = "ชื่อเพลง";
    document.getElementById("emojiDefault").innerText = "อารมณ์ความรู้สึก";
    document.getElementById("categoryDefault").innerText = "หมวดหมู่";
    document.getElementById("desc").placeholder = "คำอธิบาย";
    document.getElementById("saveButton").innerText = "บันทึก";

    /* emoji filter */
    emojiFilter.options[0].text = "ทั้งหมด";
    emojiFilter.options[1].text = "😊 สุข";
    emojiFilter.options[2].text = "😢 เศร้า";
    emojiFilter.options[3].text = "🔥 สนุก";
    emojiFilter.options[4].text = "❤️ รัก";
    emojiFilter.options[5].text = "🙂 สงบ ผ่อนคลาย";
    emojiFilter.options[6].text = "😡 โกรธ";
    emojiFilter.options[7].text = "😐 เฉย ๆ";
    emojiFilter.options[8].text = "😰 เครียด กังวล";
    emojiFilter.options[9].text = "🤩 ตื่นเต้น";
    emojiFilter.options[10].text = "😴 เหนื่อย";

    emoji.options[0].text = "ทั้งหมด";
    emoji.options[1].text = "😊 สุข";
    emoji.options[2].text = "😢 เศร้า";
    emoji.options[3].text = "🔥 สนุก";
    emoji.options[4].text = "❤️ รัก";
    emoji.options[5].text = "🙂 สงบ ผ่อนคลาย";
    emoji.options[6].text = "😡 โกรธ";
    emoji.options[7].text = "😐 เฉย ๆ";
    emoji.options[8].text = "😰 เครียด กังวล";
    emoji.options[9].text = "🤩 ตื่นเต้น";
    emoji.options[10].text = "😴 เหนื่อย";

    /* category filter */
    categoryFilter.options[0].text = "ทุกหมวด";
    categoryFilter.options[1].text = "เพลงเศร้า";
    categoryFilter.options[2].text = "เพลงรัก";
    categoryFilter.options[3].text = "เพลงสนุก";
    categoryFilter.options[4].text = "เพลงกำลังใจ";
    categoryFilter.options[5].text = "เพลงมีความสุข";
    categoryFilter.options[6].text = "เพลงผ่อนคลาย";
    categoryFilter.options[7].text = "เพลงคิดถึง";
    categoryFilter.options[8].text = "เพลงก่อนนอน";
    categoryFilter.options[9].text = "เพลงปลุกพลัง";
    categoryFilter.options[10].text = "เพลงเหงา";
    categoryFilter.options[11].text = "เพลงสมาธิ";
    categoryFilter.options[12].text = "เพลงยามเช้า";
    categoryFilter.options[13].text = "เพลงขับรถ";
    categoryFilter.options[14].text = "เพลงอ่านหนังสือ";

    /* popup */
    emojiPopup.options[0].text = "อารมณ์ความรู้สึก";
    categoryPopup.options[0].text = "หมวดหมู่";

    categoryPopup.options[1].text = "เพลงเศร้า";
    categoryPopup.options[2].text = "เพลงรัก";
    categoryPopup.options[3].text = "เพลงสนุก";
    categoryPopup.options[4].text = "เพลงกำลังใจ";
    categoryPopup.options[5].text = "เพลงมีความสุข";
    categoryPopup.options[6].text = "เพลงผ่อนคลาย";
    categoryPopup.options[7].text = "เพลงคิดถึง";
    categoryPopup.options[8].text = "เพลงก่อนนอน";
    categoryPopup.options[9].text = "เพลงปลุกพลัง";
    categoryPopup.options[10].text = "เพลงเหงา";
    categoryPopup.options[11].text = "เพลงสมาธิ";
    categoryPopup.options[12].text = "เพลงยามเช้า";
    categoryPopup.options[13].text = "เพลงขับรถ";
    categoryPopup.options[14].text = "เพลงอ่านหนังสือ";
  }

  if (lang === "en") {
    document.querySelector("h1").innerText = "One Song Many Stories";
    document.getElementById("search").placeholder = "Search song";
    document.getElementById("addSongButton").innerText = "Add Song";
    document.getElementById("saveButton").innerText = "Save";
    document.getElementById("fabAdd").innerText = "🎵 Add Song";
    document.getElementById("fabVoice").innerText = "🎤 Voice Input";
    document.getElementById("mipage").innerText = "🎤 Voice Input";

    // popup
    document.getElementById("popupTitle").innerText = "Add Song";
    document.getElementById("songName").placeholder = "Song name";
    document.getElementById("emojiDefault").innerText = "Emotion";
    document.getElementById("categoryDefault").innerText = "Category";
    document.getElementById("desc").placeholder = "Description";
    document.getElementById("saveButton").innerText = "Save";

    /* emoji filter */
    emojiFilter.options[0].text = "All";
    emojiFilter.options[1].text = "😊 Happy";
    emojiFilter.options[2].text = "😢 Sad";
    emojiFilter.options[3].text = "🔥 Fun";
    emojiFilter.options[4].text = "❤️ Love";
    emojiFilter.options[5].text = "🙂 Calm";
    emojiFilter.options[6].text = "😡 Angry";
    emojiFilter.options[7].text = "😐 Neutral";
    emojiFilter.options[8].text = "😰 Stress";
    emojiFilter.options[9].text = "🤩 Excited";
    emojiFilter.options[10].text = "😴 Tired";

    emoji.options[0].text = "All";
    emoji.options[1].text = "😊 Happy";
    emoji.options[2].text = "😢 Sad";
    emoji.options[3].text = "🔥 Fun";
    emoji.options[4].text = "❤️ Love";
    emoji.options[5].text = "🙂 Calm";
    emoji.options[6].text = "😡 Angry";
    emoji.options[7].text = "😐 Neutral";
    emoji.options[8].text = "😰 Stress";
    emoji.options[9].text = "🤩 Excited";
    emoji.options[10].text = "😴 Tired";

    /* category filter */
    categoryFilter.options[0].text = "All Categories";
    categoryFilter.options[1].text = "Sad Songs";
    categoryFilter.options[2].text = "Love Songs";
    categoryFilter.options[3].text = "Fun Songs";
    categoryFilter.options[4].text = "Motivation";
    categoryFilter.options[5].text = "Happy Songs";
    categoryFilter.options[6].text = "Relax";
    categoryFilter.options[7].text = "Missing Someone";
    categoryFilter.options[8].text = "Before Sleep";
    categoryFilter.options[9].text = "Energy Boost";
    categoryFilter.options[10].text = "Lonely";
    categoryFilter.options[11].text = "Focus";
    categoryFilter.options[12].text = "Morning";
    categoryFilter.options[13].text = "Driving";
    categoryFilter.options[14].text = "Reading";

    /* popup */
    emojiPopup.options[0].text = "Emotion";
    categoryPopup.options[0].text = "Category";

    categoryPopup.options[1].text = "Sad Songs";
    categoryPopup.options[2].text = "Love Songs";
    categoryPopup.options[3].text = "Fun Songs";
    categoryPopup.options[4].text = "Motivation";
    categoryPopup.options[5].text = "Happy Songs";
    categoryPopup.options[6].text = "Relax";
    categoryPopup.options[7].text = "Missing Someone";
    categoryPopup.options[8].text = "Before Sleep";
    categoryPopup.options[9].text = "Energy Boost";
    categoryPopup.options[10].text = "Lonely";
    categoryPopup.options[11].text = "Focus";
    categoryPopup.options[12].text = "Morning";
    categoryPopup.options[13].text = "Driving";
    categoryPopup.options[14].text = "Reading";
  }
  showSongs(allSongs);
}

// function loadAll() {
//   fetch(API + "/songs")
//     .then((r) => r.json())

//     .then((data) => {
//       allSongs = data;

//       showSongs(data);
//     });
// }

async function loadAll() {
  const r = await fetch(API + "/songs");
  const data = await r.json();

  allSongs = data;

  showSongs(data);
}

// function loadRandom() {
//   setInterval(() => {
//     fetch(API + "/songs")
//       .then((r) => r.json())

//       .then((data) => {
//         data.sort(() => Math.random() - 0.5);

//         let html = "";

//         data.forEach((d) => {
//           html += createCard(d);
//         });

//         document.getElementById("cards").innerHTML = html;
//       });
//   }, 3000);
// }
async function loadRandom() {
  setInterval(async () => {
    const r = await fetch(API + "/songs");
    const data = await r.json();

    data.sort(() => Math.random() - 0.5);

    let html = "";

    for (let d of data) {
      html += await createCard(d);
    }

    document.getElementById("cards").innerHTML = html;
  }, 6000);
}

function openPopup() {
  document.getElementById("popup").style.display = "block";

  const fab = document.querySelector(".fabMenu");
  if (fab) fab.style.display = "none";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
  document.getElementById("songForm").reset();

  const fab = document.querySelector(".fabMenu");
  if (fab && window.innerWidth <= 600) {
    fab.style.display = "flex";
  }

  // 🔥 ปิดเมนูย่อยด้วย
  const options = document.getElementById("fabOptions");
  if (options) options.classList.remove("show");
}

function saveSong(event) {
  if (event) event.preventDefault();
  // event.preventDefault();
  let song = document.getElementById("songName").value;
  let emoji = document.getElementById("emoji").value;
  let desc = document.getElementById("desc").value;
  let category = document.getElementById("category").value;

  fetch(API + "/songs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      song_name: song,
      emoji: emoji,
      description: desc,
      category: category,
    }),
  })
    .then(() => {
      loadAll();
      // resetForm();
      closePopup();
      showQR();
    })
    .catch((err) => {
      console.error("Error:", err);
    });
}

// function showSongs(data) {
//   let html = "";

//   data.forEach((d) => {
//     html += createCard(d);
//   });

//   document.getElementById("cards").innerHTML = html;
// }
// async function showSongs(data) {
//   let html = "";

//   for (let d of data) {
//     html += await createCard(d);
//   }

//   document.getElementById("cards").innerHTML = html;
// }
async function showSongs(data) {
  const cards = await Promise.all(data.map((d) => createCard(d)));

  document.getElementById("cards").innerHTML = cards.join("");
}

function filterSongs() {
  let search = document.getElementById("search").value.toLowerCase();
  let category = document.getElementById("categoryFilter").value;
  let emoji = document.getElementById("emojiFilter").value;

  let filtered = allSongs.filter((s) => {
    let matchName = s.song_name.toLowerCase().includes(search);
    let matchEmoji = emoji == "" || s.emoji == emoji;
    let matchCategory = category === "" || s.category === category;

    return matchName && matchEmoji && matchCategory;
  });

  showSongs(filtered);
}

function speakByLang(th, en) {
  if (currentLang === "en") {
    speak(en);
  } else {
    speak(th);
  }
}

function startSystem() {
  speakByLang("ระบบพร้อมใช้งาน", "The system is ready.");

  setTimeout(() => {
    startVoiceMode();

    speakByLang("พูดคำว่าแบ่งปัน", " Say the word share.");
  }, 300);
}
let step = 0;

function startVoiceMode() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Browser ไม่รองรับเสียง");

    return;
  }

  recognition = new SpeechRecognition();

  recognition.lang = "th-TH";
  // recognition.lang = currentLang === "en" ? "en-US" : "th-TH";

  recognition.continuous = true;

  recognition.start();

  recognition.onend = function () {
    setTimeout(() => {
      recognition.start();
    }, 100);
  };

  recognition.onresult = function (e) {
    let text = e.results[e.results.length - 1][0].transcript;

    text = text.trim().toLowerCase();

    console.log("ได้ยิน:", text);

    /* ⭐ GLOBAL COMMAND ปิดได้ทุกเวลา */

    if (
      text.includes("ปิด") ||
      text.includes("cancel") ||
      text.includes("turn off") ||
      text.includes("close")
    ) {
      closePopup();

      resetForm();

      step = 0;

      speakByLang("ปิดแล้ว", "Closed.");

      return;
    }

    /* STEP 0 เปิดระบบ */

    if (step == 0) {
      if (
        text.includes("แบ่งปัน") ||
        text.includes("เพิ่มเพลง") ||
        text.includes("แชร์") ||
        text.includes("share")
      ) {
        openPopup();

        step = 1;

        speakByLang("บอกชื่อเพลง", "Tell me the name of the song.");

        return;
      }
    }

    /* STEP 1 ชื่อเพลง */

    if (step == 1) {
      document.getElementById("songName").value = text;
      speakByLang("ชื่อเพลง " + text, "Song title " + text);

      step = 2;

      speakByLang(
        "เลือกอารมณ์ เช่น สุข เศร้า สนุก รัก ผ่อนคลาย โกรธ เฉย เครียด ตื่นเต้น หรือ เหนื่อย",
        "Choose an emotion such as happy, sad, fun, love, relaxed, angry, neutral, stressed, excited, or tired.",
      );

      return;
    }

    /* STEP 2 Emoji */

    // if (step == 2) {
    //   if (
    //     text.includes("เศร้า") ||
    //     text.includes("อารมณ์เศร้า") ||
    //     text.includes("Sadness")
    //   ) {
    //     document.getElementById("emoji").value = "😢";
    //     speakByLang("อารมณ์ เศร้า", "Sad mood");
    //   } else if (
    //     text.includes("สุข") ||
    //     text.includes("ดีใจ") ||
    //     text.includes("happy") ||
    //     text.includes("มีความสุข")
    //   ) {
    //     document.getElementById("emoji").value = "😊";
    //     speakByLang("อารมณ์ สุข", "Happy mood");
    //   } else if (text.includes("รัก") || text.includes("love")) {
    //     document.getElementById("emoji").value = "❤️";
    //     speakByLang("อารมณ์ รัก", "Emotions of love");
    //   } else if (
    //     text.includes("มัน") ||
    //     text.includes("สนุก") ||
    //     text.includes("แดนซ์")
    //   ) {
    //     document.getElementById("emoji").value = "🔥";
    //     speakByLang("อารมณ์ มัน", "Fun mood");
    //   } else {
    //     speakByLang(
    //       "ไม่เข้าใจอารมณ์ ลองพูดใหม่",
    //       "I don't understand your emotion. Please try speaking again.",
    //     );

    //     return;
    //   }

    //   step = 3;

    //   speakByLang(
    //     "พูดหมวดหมู่เพลงเช่น เพลงเศร้า เพลงรัก เพลงสนุก เพลงให้กำลังใจ",
    //     "Talk about music categories such as sad songs, love songs, fun songs, and motivational songs.",
    //   );

    //   return;
    // }
    if (step == 2) {
      // normalize
      text = text.toLowerCase().trim();

      const setEmoji = (emoji, thText, enText) => {
        document.getElementById("emoji").value = emoji;
        speakByLang(thText, enText);
      };

      if (
        text.includes("เศร้า") ||
        text.includes("เสียใจ") ||
        text.includes("sad")
      ) {
        setEmoji("😢", "อารมณ์ เศร้า", "Sad mood");
      } else if (
        text.includes("สุข") ||
        text.includes("ดีใจ") ||
        text.includes("happy") ||
        text.includes("มีความสุข")
      ) {
        setEmoji("😊", "อารมณ์ สุข", "Happy mood");
      } else if (text.includes("รัก") || text.includes("love")) {
        setEmoji("❤️", "อารมณ์ รัก", "Love mood");
      } else if (
        text.includes("สนุก") ||
        text.includes("มัน") ||
        text.includes("แดนซ์") ||
        text.includes("fun")
      ) {
        setEmoji("🔥", "อารมณ์ สนุก", "Fun mood");
      } else if (
        text.includes("ผ่อนคลาย") ||
        text.includes("สงบ") ||
        text.includes("relax") ||
        text.includes("chill")
      ) {
        setEmoji("🙂", "อารมณ์ ผ่อนคลาย", "Relax mood");
      } else if (
        text.includes("โกรธ") ||
        text.includes("โมโห") ||
        text.includes("angry")
      ) {
        setEmoji("😡", "อารมณ์ โกรธ", "Angry mood");
      } else if (
        text.includes("เฉย") ||
        text.includes("ปกติ") ||
        text.includes("neutral")
      ) {
        setEmoji("😐", "อารมณ์ เฉย ๆ", "Neutral mood");
      } else if (
        text.includes("เครียด") ||
        text.includes("กังวล") ||
        text.includes("stress") ||
        text.includes("anxious")
      ) {
        setEmoji("😰", "อารมณ์ เครียด", "Stress mood");
      } else if (
        text.includes("ตื่นเต้น") ||
        text.includes("ว้าว") ||
        text.includes("excited")
      ) {
        setEmoji("🤩", "อารมณ์ ตื่นเต้น", "Excited mood");
      } else if (
        text.includes("เหนื่อย") ||
        text.includes("ง่วง") ||
        text.includes("sleepy") ||
        text.includes("tired")
      ) {
        setEmoji("😴", "อารมณ์ เหนื่อย", "Tired mood");
      } else {
        speakByLang(
          "ไม่เข้าใจอารมณ์ ลองพูดใหม่",
          "I don't understand your emotion. Please try speaking again.",
        );
        return;
      }

      step = 3;

      speakByLang(
        "เลือกหมวดหมู่ เช่น เศร้า รัก สนุก กำลังใจ สุข ผ่อนคลาย คิดถึง ก่อนนอน ปลุกพลัง เหงา สมาธิ เช้า ขับรถ หรือ หนังสือ",
        "Choose category like sad, love, fun, motivation, happy, relax, miss, bedtime, energy, lonely, focus, morning, driving, or reading.",
      );

      return;
    }

    // if (step == 3) {
    //   if (text.includes("เพลงเศร้า") || text.includes("เศร้า")) {
    //     document.getElementById("category").value = "เศร้า";
    //     speakByLang("หมวดหมู่ เพลงเศร้า", "Category: Sad Songs");
    //   } else if (text.includes("เพลงรัก") || text.includes("รัก")) {
    //     document.getElementById("category").value = "รัก";
    //     speakByLang("หมวดหมู่ เพลงรัก", "Category: Love Songs");
    //   } else if (text.includes("เพลงสนุก") || text.includes("สนุก")) {
    //     document.getElementById("category").value = "สนุก";
    //     speakByLang("หมวดหมู่ เพลงสนุก", "Category: Fun Songs");
    //   } else if (
    //     text.includes("เพลงให้กำลังใจ") ||
    //     text.includes("ให้กำลังใจ")
    //   ) {
    //     document.getElementById("category").value = "กำลังใจ";
    //     speakByLang("หมวดหมู่ เพลงให้กำลังใจ", "Category: Inspirational Songs");
    //   } else {
    //     speakByLang(
    //       "ไม่เข้าใจหมวดหมู่ ลองพูดใหม่",
    //       "I don't understand the category. Please try again.",
    //     );
    //     return;
    //   }

    //   step = 4;

    //   speakByLang("พูดคำอธิบาย", "Give an explanation.");

    //   return;
    // }
    if (step == 3) {
      // normalize
      text = text.toLowerCase().trim();

      const setCategory = (value, thText, enText) => {
        document.getElementById("category").value = value;
        speakByLang(thText, enText);
      };

      if (
        text.includes("เศร้า") ||
        text.includes("sad") ||
        text.includes("sad song")
      ) {
        setCategory("เศร้า", "หมวดหมู่ เพลงเศร้า", "Category: Sad Songs");
      } else if (
        text.includes("รัก") ||
        text.includes("love") ||
        text.includes("romantic")
      ) {
        setCategory("รัก", "หมวดหมู่ เพลงรัก", "Category: Love Songs");
      } else if (
        text.includes("สนุก") ||
        text.includes("fun") ||
        text.includes("dance")
      ) {
        setCategory("สนุก", "หมวดหมู่ เพลงสนุก", "Category: Fun Songs");
      } else if (
        text.includes("กำลังใจ") ||
        text.includes("ให้กำลังใจ") ||
        text.includes("inspire") ||
        text.includes("motivation")
      ) {
        setCategory(
          "กำลังใจ",
          "หมวดหมู่ เพลงให้กำลังใจ",
          "Category: Inspirational Songs",
        );
      } else if (
        text.includes("สุข") ||
        text.includes("happy") ||
        text.includes("good mood")
      ) {
        setCategory("สุข", "หมวดหมู่ เพลงมีความสุข", "Category: Happy Songs");
      } else if (
        text.includes("ผ่อนคลาย") ||
        text.includes("relax") ||
        text.includes("chill")
      ) {
        setCategory(
          "ผ่อนคลาย",
          "หมวดหมู่ เพลงผ่อนคลาย",
          "Category: Relaxing Songs",
        );
      } else if (
        text.includes("คิดถึง") ||
        text.includes("miss") ||
        text.includes("missing you")
      ) {
        setCategory(
          "คิดถึง",
          "หมวดหมู่ เพลงคิดถึง",
          "Category: Missing You Songs",
        );
      } else if (
        text.includes("ก่อนนอน") ||
        text.includes("sleep") ||
        text.includes("bedtime")
      ) {
        setCategory(
          "ก่อนนอน",
          "หมวดหมู่ เพลงก่อนนอน",
          "Category: Bedtime Songs",
        );
      } else if (
        text.includes("ปลุกพลัง") ||
        text.includes("energy") ||
        text.includes("power") ||
        text.includes("hype")
      ) {
        setCategory(
          "ปลุกพลัง",
          "หมวดหมู่ เพลงปลุกพลัง",
          "Category: Energy Songs",
        );
      } else if (
        text.includes("เหงา") ||
        text.includes("lonely") ||
        text.includes("alone")
      ) {
        setCategory("เหงา", "หมวดหมู่ เพลงเหงา", "Category: Lonely Songs");
      } else if (text.includes("สมาธิ") || text.includes("focus")) {
        setCategory("สมาธิ", "หมวดหมู่ เพลงสมาธิ", "Category: Focus Songs");
      } else if (text.includes("เช้า") || text.includes("morning")) {
        setCategory("เช้า", "หมวดหมู่ เพลงยามเช้า", "Category: Morning Songs");
      } else if (
        text.includes("ขับรถ") ||
        text.includes("drive") ||
        text.includes("road trip")
      ) {
        setCategory("ขับรถ", "หมวดหมู่ เพลงขับรถ", "Category: Driving Songs");
      } else if (
        text.includes("อ่านหนังสือ") ||
        text.includes("study") ||
        text.includes("reading")
      ) {
        setCategory(
          "หนังสือ",
          "หมวดหมู่ เพลงอ่านหนังสือ",
          "Category: Study Songs",
        );
      } else {
        speakByLang(
          "ไม่เข้าใจหมวดหมู่ ลองพูดใหม่",
          "I don't understand the category. Please try again.",
        );
        return;
      }

      step = 4;
      speakByLang("พูดคำอธิบาย", "Give an explanation.");
      return;
    }

    /* STEP 4 Description */

    if (step == 4) {
      document.getElementById("desc").value = text;
      speakByLang("คำอธิบาย " + text, "Description" + text);

      step = 5;

      speakByLang(
        "พูด บันทึก หรือ ปิด หรือต้องการแกไขให้พูดคำว่า แก้ไข",
        "To save, close, or make edits, say edit",
      );

      return;
    }

    if (step == 5) {
      if (text.includes("แก้ไข") || text.includes("edit")) {
        speakByLang(
          "ต้องการแก้ไขอะไร เช่น ชื่อเพลง อารมณ์ หมวดหมู่ หรือคำอธิบาย",
          "What do you want to edit?",
        );

        step = 6;
        return;
      }

      if (text.includes("บันทึก") || text.includes("save")) {
        saveSong();
        step = 0;
        return;
      }
    }

    /* STEP 6: เลือกสิ่งที่จะแก้ */
    if (step == 6) {
      text = text.toLowerCase().trim();

      if (text.includes("ชื่อ") || text.includes("name")) {
        speakByLang("พูดชื่อเพลงใหม่", "Say the new song name");
        step = 11;
        return;
      }

      if (text.includes("อารมณ์") || text.includes("emotion")) {
        speakByLang("เลือกอารมณ์ใหม่", "Choose new emotion");
        step = 12; // ✅ แยก step ใหม่
        return;
      }

      if (text.includes("หมวด") || text.includes("category")) {
        speakByLang("เลือกหมวดหมู่ใหม่", "Choose new category");
        step = 13; // ✅ แยก step ใหม่
        return;
      }

      if (text.includes("คำอธิบาย") || text.includes("description")) {
        speakByLang("พูดคำอธิบายใหม่", "Say new description");
        step = 14;
        return;
      }

      if (text.includes("ยืนยัน") || text.includes("confirm")) {
        saveSong();
        step = 0;
        return;
      }

      speakByLang("ไม่เข้าใจ กรุณาพูดใหม่", "I don't understand");
    }

    /* STEP 11: รับชื่อเพลงใหม่ */
    if (step == 11) {
      text = text.trim();

      document.getElementById("songName").value = text;

      speakByLang("แก้ชื่อเพลงเรียบร้อย", "Song name updated successfully");

      step = 6;

      speakByLang(
        "จะแก้อีกไหม หรือพูด ยืนยัน เพื่อบันทึก",
        "Do you want to edit more or say confirm to save",
      );

      return;
    }

    if (step == 12) {
      text = text.toLowerCase().trim();

      const emojiMap = {
        เศร้า: "😢",
        เสียใจ: "😢",
        sad: "😢",

        สุข: "😊",
        มีความสุข: "😊",
        happy: "😊",

        รัก: "❤️",
        love: "❤️",

        สนุก: "🔥",
        มัน: "🔥",
        fun: "🔥",

        ผ่อนคลาย: "🙂",
        สงบ: "🙂",
        relax: "🙂",

        โกรธ: "😡",
        โมโห: "😡",
        angry: "😡",

        เฉย: "😐",
        neutral: "😐",

        เครียด: "😰",
        กังวล: "😰",
        stress: "😰",

        ตื่นเต้น: "🤩",
        excited: "🤩",

        เหนื่อย: "😴",
        ง่วง: "😴",
        tired: "😴",
      };

      let found = Object.keys(emojiMap).find((k) => text.includes(k));

      if (!found) {
        speakByLang("ไม่เข้าใจอารมณ์", "I don't understand emotion");
        return;
      }

      const emojiValue = emojiMap[found];

      document.getElementById("emoji").value = emojiValue;

      speakByLang("แก้อารมณ์เรียบร้อย", "Emotion updated");

      step = 6;

      speakByLang("จะแก้อีกไหม หรือพูด ยืนยัน", "Edit more or say confirm");
    }

    if (step == 13) {
      text = text.toLowerCase().trim();

      const categoryMap = {
        เศร้า: "เศร้า",
        sad: "เศร้า",

        รัก: "รัก",
        love: "รัก",

        สนุก: "สนุก",
        fun: "สนุก",

        กำลังใจ: "กำลังใจ",
        motivation: "กำลังใจ",

        สุข: "สุข",
        happy: "สุข",

        ผ่อนคลาย: "ผ่อนคลาย",
        relax: "ผ่อนคลาย",

        คิดถึง: "คิดถึง",
        miss: "คิดถึง",

        ก่อนนอน: "ก่อนนอน",
        sleep: "ก่อนนอน",

        ปลุกพลัง: "ปลุกพลัง",
        energy: "ปลุกพลัง",

        เหงา: "เหงา",
        lonely: "เหงา",

        สมาธิ: "สมาธิ",
        focus: "สมาธิ",

        เช้า: "เช้า",
        morning: "เช้า",

        ขับรถ: "ขับรถ",
        drive: "ขับรถ",

        อ่านหนังสือ: "หนังสือ",
        reading: "หนังสือ",
      };

      let found = Object.keys(categoryMap).find((k) => text.includes(k));

      if (!found) {
        speakByLang("ไม่เข้าใจหมวดหมู่", "I don't understand category");
        return;
      }

      const categoryValue = categoryMap[found];

      document.getElementById("category").value = categoryValue;

      speakByLang("แก้หมวดหมู่เรียบร้อย", "Category updated");

      step = 6;

      speakByLang("จะแก้อีกไหม หรือพูด ยืนยัน", "Edit more or say confirm");
    }

    /* STEP 14: รับคำอธิบายใหม่ */
    if (step == 14) {
      text = text.trim();

      document.getElementById("desc").value = text;

      speakByLang("แก้คำอธิบายเรียบร้อย", "Description updated successfully");

      step = 6;

      speakByLang(
        "จะแก้อีกไหม หรือพูด ยืนยัน เพื่อบันทึก",
        "Do you want to edit more or say confirm to save",
      );

      return;
    }
  };
}

let voices = [];

speechSynthesis.onvoiceschanged = () => {
  voices = speechSynthesis.getVoices();

  console.log("voices loaded", voices);
};

// function speak(text) {
//   let msg = new SpeechSynthesisUtterance();

//   msg.text = text;

//   // หาเสียงไทยก่อน
//   let thai = voices.find((v) => v.lang == "th-TH");

//   // ถ้าไม่มีใช้อังกฤษ
//   msg.voice = thai || voices[0];

//   speechSynthesis.speak(msg);
// }

// function speak(text) {
//   if (recognition) recognition.stop();
//   let msg = new SpeechSynthesisUtterance();
//   msg.text = text;

//   // ตรวจว่าข้อความเป็นอังกฤษไหม
//   const isEnglish = /[a-zA-Z]/.test(text);

//   // หา voice
//   let thaiVoice = voices.find((v) => v.lang === "th-TH");
//   let engVoice = voices.find((v) => v.lang === "en-US");

//   // เลือกภาษา
//   if (currentLang === "en" || isEnglish) {
//     msg.voice = engVoice || voices[0];
//     msg.lang = "en-US";
//   } else {
//     msg.voice = thaiVoice || voices[0];
//     msg.lang = "th-TH";
//   }
  

//   speechSynthesis.speak(msg);
// }
function speak(text) {
  if (recognition) recognition.stop();

  let msg = new SpeechSynthesisUtterance(text);

  const isEnglish = /[a-zA-Z]/.test(text);

  // 🔍 หาเสียงแบบ “ภาษา + ผู้หญิง”
  let thaiVoice = voices.find(v =>
    v.lang === "th-TH" && v.name.toLowerCase().includes("female")
  );

  let engVoice = voices.find(v =>
    v.lang === "en-US" &&
    (v.name.toLowerCase().includes("female") ||
     v.name.toLowerCase().includes("zira") ||
     v.name.toLowerCase().includes("google"))
  );

  if (isEnglish) {
    msg.voice = engVoice || voices.find(v => v.lang === "en-US") || voices[0];
    msg.lang = "en-US";
  } else {
    msg.voice = thaiVoice || voices.find(v => v.lang === "th-TH") || voices[0];
    msg.lang = "th-TH";
  }

  // 🎀 โหมดน่ารัก
  msg.pitch = 1.4;
  msg.rate = 0.95;

  speechSynthesis.speak(msg);
}

function showQR() {
  document.getElementById("qrPopup").style.display = "block";
}

function closeQR() {
  document.getElementById("qrPopup").style.display = "none";
}

function downloadQR() {
  const img = document.getElementById("qrImage");

  const a = document.createElement("a");
  a.href = img.src;
  a.download = "qr-code.png";

  document.body.appendChild(a); // สำคัญ
  a.click();
  document.body.removeChild(a);
}

function resetForm() {
  document.getElementById("songName").value = "";

  document.getElementById("desc").value = "";

  document.getElementById("emoji").value = "😊";
}

function toggleMenu() {
  const menu = document.getElementById("fabOptions");
  menu.classList.toggle("show");
}
