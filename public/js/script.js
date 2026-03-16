speechSynthesis.onvoiceschanged = () => {
  console.log("voices loaded");
};

const API = "http://localhost:3000";
let allSongs = [];
let recognition = null;
let currentLang = "th";
let translateCache = {};

async function createCard(d) {

  // กรณีภาษาไทย
  if (currentLang === "th") {
    return `
    <div class="card">
      <h3>${d.song_name}</h3>
      <p>${d.emoji}</p>
      <p>${d.description}</p>
    </div>
    `;
  }

  // กรณีภาษาอังกฤษ
  if (currentLang === "en") {
    // const name = await translateText(d.song_name, "en");
    // const desc = await translateText(d.description, "en");

    const [name, desc] = await Promise.all([
      translateText(d.song_name, "en"),
      translateText(d.description, "en")
    ]);

    return `
    <div class="card">
      <h3>${name}</h3>
      <p>${d.emoji}</p>
      <p>${desc}</p>
    </div>
    `;
  }

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

function startSystem() {
  speak("ระบบพร้อมใช้งาน");

  setTimeout(() => {
    startVoiceMode();

    speak("พูดคำว่าแบ่งปัน");
  }, 300);
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

  }, 3000);
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

  const cards = await Promise.all(
    data.map(d => createCard(d))
  );

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

    if (text.includes("ปิด") || text.includes("cancel")) {
      closePopup();

      resetForm();

      step = 0;

      speak("ปิดแล้ว");

      return;
    }

    /* STEP 0 เปิดระบบ */

    if (step == 0) {
      if (text.includes("แบ่งปัน") || text.includes("เพิ่มเพลง")) {
        openPopup();

        step = 1;

        speak("บอกชื่อเพลง");

        return;
      }
    }

    /* STEP 1 ชื่อเพลง */

    if (step == 1) {
      document.getElementById("songName").value = text;
      speak("ชื่อเพลง " + text);

      step = 2;

      speak("เลือกอารมณ์ เช่น เศร้า สุข รัก หรือ มัน");

      return;
    }

    /* STEP 2 Emoji */

    if (step == 2) {
      if (text.includes("เศร้า")) {
        document.getElementById("emoji").value = "😢";
        speak("อารมณ์ เศร้า");
      } else if (
        text.includes("สุข") ||
        text.includes("ดีใจ") ||
        text.includes("happy") ||
        text.includes("มีความสุข")
      ) {
        document.getElementById("emoji").value = "😊";
        speak("อารมณ์ สุข");
      } else if (text.includes("รัก") || text.includes("love")) {
        document.getElementById("emoji").value = "❤️";
        speak("อารมณ์ รัก");
      } else if (
        text.includes("มัน") ||
        text.includes("สนุก") ||
        text.includes("แดนซ์")
      ) {
        document.getElementById("emoji").value = "🔥";
        speak("อารมณ์ มัน");
      } else {
        speak("ไม่เข้าใจอารมณ์ ลองพูดใหม่");

        return;
      }

      step = 3;

      speak("พูดหมวดหมู่เพลงเช่น เพลงเศร้า เพลงรัก เพลงสนุก เพลงให้กำลังใจ");

      return;
    }

    if (step == 3) {
      if (text.includes("เพลงเศร้า") || text.includes("เศร้า")) {
        document.getElementById("category").value = "เศร้า";
        speak("หมวดหมู่ เศร้า");
      } else if (text.includes("เพลงรัก") || text.includes("รัก")) {
        document.getElementById("category").value = "รัก";
        speak("หมวดหมู่ รัก");
      } else if (text.includes("เพลงสนุก") || text.includes("สนุก")) {
        document.getElementById("category").value = "สนุก";
        speak("หมวดหมู่ สนุก");
      } else if (
        text.includes("เพลงให้กำลังใจ") ||
        text.includes("ให้กำลังใจ")
      ) {
        document.getElementById("category").value = "กำลังใจ";
        speak("หมวดหมู่ ให้กำลังใจ");
      } else {
        speak("ไม่เข้าใจหมวดหมู่ ลองพูดใหม่");
        return;
      }

      step = 4;

      speak("พูดคำอธิบาย");

      return;
    }

    /* STEP 4 Description */

    if (step == 4) {
      document.getElementById("desc").value = text;
      speak("คำอธิบาย " + text);

      step = 5;

      speak("พูด บันทึก หรือ ปิด");

      return;
    }

    /* STEP 5 Save */

    if (step >= 5) {
      if (text.includes("บันทึก") || text.includes("save")) {
        saveSong();

        // resetForm();

        step = 0;

        speak("บันทึกสำเร็จ");

        speak("พูดแบ่งปันเพื่อเพิ่มเพลง");

        return;
      }

      if (text.includes("ปิด") || text.includes("cancel")) {
        closePopup();

        // resetForm();

        step = 0;

        speak("ปิดแล้ว");

        speak("พูดแบ่งปันเพื่อเพิ่มเพลง");

        return;
      }
    }
  };
}

let voices = [];

speechSynthesis.onvoiceschanged = () => {
  voices = speechSynthesis.getVoices();

  console.log("voices loaded", voices);
};

function speak(text) {
  let msg = new SpeechSynthesisUtterance();

  msg.text = text;

  // หาเสียงไทยก่อน
  let thai = voices.find((v) => v.lang == "th-TH");

  // ถ้าไม่มีใช้อังกฤษ
  msg.voice = thai || voices[0];

  speechSynthesis.speak(msg);
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
