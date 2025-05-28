// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8-C4INgNVKkCgxCR7jjb8S6joTxFwDpg",
  authDomain: "octadecdata.firebaseapp.com",
  projectId: "octadecdata",
  storageBucket: "octadecdata.firebasestorage.app",
  messagingSenderId: "122587885430",
  appId: "1:122587885430:web:b531cd71b160c60dcdd457"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);