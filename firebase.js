// firebase.js

const firebaseConfig = {
  apiKey: "AIzaSyBTcUrylDbAc57VXdpL1RMM2DVKSdNJy5I",
  authDomain: "kahoot-clone2.firebaseapp.com",
  databaseURL: "https://kahoot-clone2-default-rtdb.firebaseio.com",
  projectId: "kahoot-clone2",
  storageBucket: "kahoot-clone2.appspot.com",
  messagingSenderId: "667677983657",
  appId: "1:667677983657:web:ce1f980e2deec89be77ab8",
  measurementId: "G-9MH2PKKG9K"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
