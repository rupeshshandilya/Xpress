// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCStzvEs3rZKGzAcvEmyD4EpohfE-i6rS4",
  authDomain: "xpresswebsite.firebaseapp.com",
  projectId: "xpresswebsite",
  storageBucket: "xpresswebsite.appspot.com",
  messagingSenderId: "301112742337",
  appId: "1:301112742337:web:90e518a26f24ce36b75f40",
  measurementId: "G-50KHVTHPTB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);