// ================== GLOBAL ==================
let pin;
let playerName;
let index = 0;

const quiz = [
  {
    q: "Organ pernapasan manusia?",
    a: ["Jantung","Paru-paru","Hati","Ginjal"],
    correct: 1
  },
  {
    q: "2 + 2 = ?",
    a: ["3","4","5","6"],
    correct: 1
  }
];

// ================== HOST ==================
function createGame(){
  pin = Math.floor(100000 + Math.random()*900000);

  document.getElementById("pin").innerText = pin;

  db.ref("games/"+pin).set({
    questionIndex: -1,
    players: {},
    answered: false
  }).then(() => {
    // 🔥 tunggu database siap baru listen
    listenPlayers();
  });
}

// NEXT SOAL (HOST ONLY)
function nextQuestion(){
  if(!pin) return;

  db.ref("games/"+pin).update({
    questionIndex: index + 1,
    answered: false
  });
}

// ================== JOIN ==================
function joinGame(){
  playerName = document.getElementById("name").value;
  pin = document.getElementById("pin").value;

  if(!playerName || !pin){
    alert("Isi nama dan PIN dulu!");
    return;
  }

  db.ref("games/"+pin+"/players/"+playerName).set({
    score: 0
  });

  localStorage.setItem("pin", pin);
  localStorage.setItem("name", playerName);

  window.location.href = "player.html";
}

// ================== LISTEN SOAL ==================
function listenQuestion(){
  pin = localStorage.getItem("pin");

db.ref("games/"+pin+"/questionIndex")
.on("value", snap=>{
  index = snap.val();

  // reset answered tiap soal baru
  db.ref("games/"+pin+"/answered").set(false);

  loadQuestion();
});
}

// ================== LOAD SOAL ==================
function loadQuestion(){

  if(index === null || index < 0) return;

  if(index >= quiz.length){
    showLeaderboard();
    return;
  }

  document.getElementById("question").innerText = quiz[index].q;

  const btns = document.querySelectorAll("#answers button");
  btns.forEach((b,i)=>{
    b.innerText = quiz[index].a[i];
    b.disabled = false; // aktifkan ulang tombol
  });
}

// ================== JAWAB ==================
function answer(i){
  const name = localStorage.getItem("name");
  const pin = localStorage.getItem("pin");

  const btns = document.querySelectorAll("#answers button");
  btns.forEach(b => b.disabled = true);

  if(i === quiz[index].correct){
    document.getElementById("correct").play();

    db.ref("games/"+pin+"/players/"+name+"/score")
    .transaction(s => (s||0)+10);

  } else {
    document.getElementById("wrong").play();
  }

  // 🔥 AUTO NEXT (HANYA 1 PLAYER YANG JALANKAN)
  setTimeout(()=>{
    db.ref("games/"+pin).transaction(game=>{
      if(game && !game.answered){
        game.answered = true;
        game.questionIndex++;
      }
      return game;
    });
  }, 3000);
}

// ================== PLAYER LEADERBOARD ==================
function showLeaderboard(){
  document.getElementById("quiz").style.display = "none";
  document.getElementById("leaderboard").style.display = "block";

  const pin = localStorage.getItem("pin");

  db.ref("games/"+pin+"/players").on("value", snap=>{
    const data = snap.val();
    if(!data) return;

    let rank = Object.entries(data)
    .sort((a,b)=>b[1].score - a[1].score);

    let html = "<h2>🏆 Leaderboard</h2>";

    rank.forEach((p,i)=>{
      html += `<p>${i+1}. ${p[0]} - ${p[1].score}</p>`;
    });

    document.getElementById("leaderboard").innerHTML = html;
  });
}

// ================== HOST LEADERBOARD ==================
function listenPlayers(){
  if(!pin){
    console.log("PIN belum siap");
    return;
  }

  db.ref("games/"+pin+"/players").on("value", snap=>{
    const data = snap.val();

    const el = document.getElementById("leaderboard");
    const countEl = document.getElementById("playerCount");

    if(!el) return;

    // kalau belum ada player
    if(!data){
      el.innerHTML = "Menunggu player...";
      if(countEl) countEl.innerText = "0";
      return;
    }

    let players = Object.entries(data);

    // jumlah player
    if(countEl) countEl.innerText = players.length;

    // sorting ranking
    let rank = players.sort((a,b)=>b[1].score - a[1].score);

    let html = "<h3>🏆 Ranking</h3>";

    rank.forEach((p,i)=>{
      html += `
        <div style="
          background:#1e293b;
          margin:5px;
          padding:10px;
          border-radius:10px;
          ${i===0 ? "border:2px solid gold;" : ""}
        ">
          ${i+1}. ${p[0]} - ${p[1].score}
        </div>
      `;
    });

    el.innerHTML = html;
  });
}
