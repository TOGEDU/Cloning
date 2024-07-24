import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1wVvIhUNAlTXQEbWfd4sqWhBXmFYqUMw",
  authDomain: "cloning-195cf.firebaseapp.com",
  projectId: "cloning-195cf",
  storageBucket: "cloning-195cf.appspot.com",
  messagingSenderId: "781502570421",
  appId: "1:781502570421:web:0b6177ae2e77a2369003fc",
  measurementId: "G-XJWMB0JH77",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export { app, analytics, messaging };
