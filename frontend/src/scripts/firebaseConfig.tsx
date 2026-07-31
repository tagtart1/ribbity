import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCwzVi-rEcBNjQcQTHfokvh63eTCsuhGKY",
  authDomain: "tweety-3dd86.firebaseapp.com",
  projectId: "tweety-3dd86",
  storageBucket: "tweety-3dd86.appspot.com",
  messagingSenderId: "315902370971",
  appId: "1:315902370971:web:a2e973dcf4eb03b06ed23e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
