// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWoVXzCCJojdASnW4w7fKtQSyDetY57rI",
  authDomain: "openbadgesyu.firebaseapp.com",
  projectId: "openbadgesyu",
  storageBucket: "openbadgesyu.firebasestorage.app",
  messagingSenderId: "998855433273",
  appId: "1:998855433273:web:b54541550d35f540b641e8",
  measurementId: "G-7PRFLN2V0T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
