speechSynthesis.onvoiceschanged = () => {
  console.log("voices loaded");
};

const API = "http://localhost:3000";
let allSongs = [];
let recognition = null;

function createCard(d) {
  return `
    <div class="card">
    <h3>${d.song_name}</h3>
    <p>${d.emoji}</p>
    <p>${d.description}</p>
    </div>
`;
}

function startSystem() {
  speak("ระบบพร้อมใช้งาน");

  setTimeout(() => {
    startVoiceMode();

    speak("พูดคำว่าแบ่งปัน");
  }, 300);
}
function loadAll() {
  fetch(API + "/songs")
    .then((r) => r.json())

    .then((data) => {
      allSongs = data;

      showSongs(data);
    });
}

function loadRandom() {
  setInterval(() => {
    fetch(API + "/songs")
      .then((r) => r.json())

      .then((data) => {
        data.sort(() => Math.random() - 0.5);

        let html = "";

        data.forEach((d) => {
          html += createCard(d);
        });

        document.getElementById("cards").innerHTML = html;
      });
  }, 3000);
}

function openPopup() {
  document.getElementById("popup").style.display = "block";

  const fab = document.querySelector(".fabMenu");
  if (fab) fab.style.display = "none";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";

  const fab = document.querySelector(".fabMenu");
  if (fab) fab.style.display = "flex";

  // 🔥 ปิดเมนูย่อยด้วย
  const options = document.getElementById("fabOptions");
  if (options) options.classList.remove("show");
}

function saveSong(event) {
  event.preventDefault();
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
      resetForm();
      closePopup();
    })
    .catch((err) => {
      console.error("Error:", err);
    });
}

function showSongs(data) {
  let html = "";

  data.forEach((d) => {
    html += createCard(d);
  });

  document.getElementById("cards").innerHTML = html;
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

        resetForm();

        step = 0;

        speak("บันทึกสำเร็จ");

        speak("พูดแบ่งปันเพื่อเพิ่มเพลง");

        return;
      }

      if (text.includes("ปิด") || text.includes("cancel")) {
        closePopup();

        resetForm();

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
