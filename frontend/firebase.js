// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "foodapp-9429b.firebaseapp.com",
  projectId: "foodapp-9429b",
  storageBucket: "foodapp-9429b.firebasestorage.app",
  messagingSenderId: "395194520814",
  appId: "1:395194520814:web:b8bd082bc0f58e57a80fff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export {app,auth}