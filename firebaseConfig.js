// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjlCk8pFscjjfPKg66VeLfk1HihNb-yYQ",
  authDomain: "familysns-28775.firebaseapp.com",
  projectId: "familysns-28775",
  storageBucket: "familysns-28775.appspot.com",
  messagingSenderId: "1094791504229",
  appId: "1:1094791504229:web:20c2733c90d5a35981418c",
  measurementId: "G-XPE28RSPXD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app };
export default db;