import * as firebase from "firebase/app";
import "firebase/firestore";

if (!firebase.getApps.length ) {

const firebaseConfig = {
  apiKey: "AIzaSyDjlCk8pFscjjfPKg66VeLfk1HihNb-yYQ",
  authDomain: "familysns-28775.firebaseapp.com",
  projectId: "familysns-28775",
  storageBucket: "familysns-28775.appspot.com",
  messagingSenderId: "1094791504229",
  appId: "1:1094791504229:web:20c2733c90d5a35981418c",
  measurementId: "G-XPE28RSPXD"
};
	firebase.initializeApp(firebaseConfig);
}