import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBorj7-Q2ML7oENnO91fQPKt63JfFYaP2A",
  authDomain: "livechat-52df7.firebaseapp.com",
  projectId: "livechat-52df7",
  storageBucket: "livechat-52df7.appspot.com",
  messagingSenderId: "631193344500",
  appId: "1:631193344500:web:a03d15dd163dd8dabe41a1",
  measurementId: "G-89DJPM8G2G",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
