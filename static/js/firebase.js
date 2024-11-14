import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBq7LsUFzX2TS-x25lYxRcztqh1MwW6jcA",
    authDomain: "business-chat-88712.firebaseapp.com",
    databaseURL: "https://business-chat-88712-default-rtdb.firebaseio.com",
    projectId: "business-chat-88712",
    storageBucket: "business-chat-88712.firebasestorage.app",
    messagingSenderId: "240295545414",
    appId: "1:240295545414:web:88a007e5aefe8070b91847",
    measurementId: "G-MZYYL4DYVQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to set up Firestore real-time listener and update the chat window
export function setupFirestoreListener(addMessageCallback, session_id) {
    const chatCollection = collection(db, "chats");
    const chatQuery = query(
        chatCollection,
        where("session_id", "==", session_id), // Filter messages by session ID
        orderBy("timestamp")
    );

    // Listen for real-time updates
    onSnapshot(chatQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const messageData = change.doc.data();
                addMessageCallback(messageData.user_message, 'user');
                addMessageCallback(messageData.bot_reply, 'bot');
            }
        });
    });
}
