import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCEzJkgBLcqkgedZzuH95oIkiY5gVDr5CY",
  authDomain: "classmate-441814.firebaseapp.com",
  projectId: "classmate-441814",
  storageBucket: "classmate-441814.firebasestorage.app",
  messagingSenderId: "932056831828",
  appId: "1:932056831828:web:cbdf91aa1b6b4c20c91ac1",
  measurementId: "G-9FGH15YT80"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export {storage};
export {db};

