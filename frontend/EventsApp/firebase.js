import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBUpaCPk-KYsHi-cBK0k46wLc9HD6LpUnw",
  authDomain: "eventsapp-8ff29.firebaseapp.com",
  projectId: "eventsapp-8ff29",
  storageBucket: "eventsapp-8ff29.appspot.com",
  messagingSenderId: "13510641090",
  appId: "1:13310641090:web:d5e6312a66f4a89421725b",
  measurementId: "G-Z2F8EXYBBB"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage };
