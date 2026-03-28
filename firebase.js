// firebase.js

const firebaseConfig = {
  apiKey: "ISI",
  authDomain: "ISI",
  databaseURL: "https://kahoot-clone2-default-rtdb.firebaseio.com",
  projectId: "ISI",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
