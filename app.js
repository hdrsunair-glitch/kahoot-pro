// app.js

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
    players: {}
  });
}

// NEXT SOAL (HOST)
function nextQuestion(){
  db.ref("games/"+pin+"/questionIndex")
  .transaction(n => (n||0)+1);
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

// ================== LISTEN ==================
function listenQuestion(){
  pin = localStorage.getItem("pin");

  db.ref("games/"+pin+"/questionIndex")
  .on("value", snap=>{
    index = snap.val();
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
  });
}

// ================== JAWAB ==================
function answer(i){
  const name = localStorage.getItem("name");
  const pin = localStorage.getItem("pin");

  // Disable klik biar tidak spam
  const btns = document.querySelectorAll("#answers button");
  btns.forEach(b => b.disabled = true);

  if(i === quiz[index].correct){
    document.getElementById("correct").play();

    db.ref("games/"+pin+"/players/"+name+"/score")
    .transaction(s => (s||0)+10);

  } else {
    document.getElementById("wrong").play();
  }

  // Delay biar tidak terlalu cepat pindah
  setTimeout(()=>{
    db.ref("games/"+pin+"/questionIndex")
    .transaction(n => (n||0)+1);

    // Aktifkan lagi tombol
    btns.forEach(b => b.disabled = false);

  }, 1000);
}

// ================== LEADERBOARD ==================
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
