// firebase.js

const firebaseConfig = {
  apiKey: "AIzaSyBTcUrylDbAc57VXdpL1RMM2DVKSdNJy5I",
  authDomain: "kahoot-clone2.firebaseapp.com",
  databaseURL: "https://kahoot-clone2-default-rtdb.firebaseio.com",
  projectId: "kahoot-clone2",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
