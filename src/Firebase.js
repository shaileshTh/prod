// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC99Xih7haxp1fJ_wT-0UKgbnVJrBmsBTI",
  authDomain: "message-listener.firebaseapp.com",
  databaseURL: "https://message-listener-default-rtdb.firebaseio.com",
  projectId: "message-listener",
  storageBucket: "message-listener.appspot.com",
  messagingSenderId: "523226268749",
  appId: "1:523226268749:web:9ed4c0207d084e8ab1c804"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;