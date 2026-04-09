// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCX3dSYlh5vW6UqN4fQ8AZ__wg1kwbS3mw",
  authDomain: "project-a3d54.firebaseapp.com",
  projectId: "project-a3d54",
  storageBucket: "project-a3d54.firebasestorage.app",
  messagingSenderId: "460236345769",
  appId: "1:460236345769:web:333da2eeb6dea539b034b8",
  measurementId: "G-PJXEN95R2J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export { db };