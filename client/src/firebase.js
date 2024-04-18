// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-blog-8600e.firebaseapp.com",
    projectId: "mern-blog-8600e",
    storageBucket: "mern-blog-8600e.appspot.com",
    messagingSenderId: "372110561558",
    appId: "1:372110561558:web:32cc40c9bfb1ef3cac0037",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

