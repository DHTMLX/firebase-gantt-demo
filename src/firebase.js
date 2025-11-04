import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIGURATION);

initializeApp(firebaseConfig);
const db = getFirestore();
const tasksCollection = collection(db, "tasks");
const linksCollection = collection(db, "links");

export { db, tasksCollection, linksCollection };
