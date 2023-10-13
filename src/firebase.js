// firebase.js
import { initializeApp } from 'firebase/app';
import {getDatabase} from 'firebase/database'; // Import Firestore
import {getStorage} from 'firebase/storage'; // Import Firebase Storage


const firebaseConfig = {
  apiKey: "AIzaSyAAfvIYoMysJjxP4s07BPNgEybugV6WTlo",
  authDomain: "finalyearproject-a85c1.firebaseapp.com",
  projectId: "finalyearproject-a85c1",
  storageBucket: "finalyearproject-a85c1.appspot.com",
  messagingSenderId: "404986954883",
  db:"https://finalyearproject-a85c1-default-rtdb.firebaseio.com/",
  appId: "1:404986954883:web:09917111b0db6019f4c7b6",
  measurementId: "G-BGVNDKJ68Q"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app); // Initialize Firestore
export const storage = getStorage(app);
export default firebaseConfig


