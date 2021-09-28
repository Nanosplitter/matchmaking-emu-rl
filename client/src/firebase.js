// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import { renderPlayerList } from "./view.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMp2jxgu_BRSJYKoCjxGu0rhYa-SOZG40",
  authDomain: "matchmaking-emu-rl.firebaseapp.com",
  projectId: "matchmaking-emu-rl",
  storageBucket: "matchmaking-emu-rl.appspot.com",
  messagingSenderId: "35013164019",
  appId: "1:35013164019:web:653dbdade3a02689e5f086",
  measurementId: "G-HTTEX15DBZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore through Firebase
const db = getFirestore();

const playersRef = collection(db, "players");

/** @type {Map<string, {name:string, rating:number}>} */
export let currentPlayers;

const q = query(playersRef, orderBy("name"));
const querySnapshot = onSnapshot(q, (querySnapshot) => {
  currentPlayers = new Map(
    querySnapshot.docs.map((playerRef) => [playerRef.id, playerRef.data()])
  );
  renderPlayerList();
});
