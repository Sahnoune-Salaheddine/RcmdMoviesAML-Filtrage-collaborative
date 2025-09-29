import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgH76mdAwTg1sVc3FxdRQpq8UYEwAUG5w",
  authDomain: "react-film-netx-rcmd-7431id.firebaseapp.com",
  databaseURL: "https://react-film-netx-rcmd-7431id-default-rtdb.firebaseio.com",
  projectId: "react-film-netx-rcmd-7431id",
  storageBucket: "react-film-netx-rcmd-7431id.firebasestorage.app",
  messagingSenderId: "67775291706",
  appId: "1:67775291706:web:f4c0c7aa30d653eb67f003",
  measurementId: "G-YSCPS3Q8ND"
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(FirebaseApp);
const analytics = getAnalytics(FirebaseApp);
