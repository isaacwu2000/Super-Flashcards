// Importing the used firebase functions
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
import { getAuth, onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';
import { GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';
import { signInWithPopup } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';

// Consiguring Firebase web app
const firebaseConfig = {
    apiKey: "AIzaSyB_K92WQMoXiOe5YQPqngvsc36Yb6P5W94",
    authDomain: "super-spanish-flashcards.firebaseapp.com",
    projectId: "super-spanish-flashcards",
    storageBucket: "super-spanish-flashcards.firebasestorage.app",
    messagingSenderId: "908159020771",
    appId: "1:908159020771:web:4f16d94b9199a6af709fd6",
    measurementId: "G-DMXPEV6C04"
};

// Initializing Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Setting the GoogleAuthProvider
const provider = new GoogleAuthProvider();

// Function to sign in with Google
async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, provider);
        // Access the signed-in user's information
        const user = result.user;
        console.log("User Info:", user);
        alert(`Hello, ${user.displayName}! You are signed in.`);
    } catch (error) {
        console.error("Error signing in with Google:", error);
    }
}

// Function to sign out
async function signOutFromGoogle() {
    try {
        await signOut(auth);
        alert("You are signed out.");
    } catch (error) {
        console.error("Error signing out:", error);
    }
}

// Making the google sign in and out buttons work
const signInBtn = document.getElementById('sign-in-google');
signInBtn.addEventListener('click', function() {
    signInWithGoogle();
    console.log("Signed in")
});

const signOutBtn = document.getElementById('sign-out');
signOutBtn.addEventListener('click', function() {
    signOutFromGoogle();
    console.log("Signed out")
});

// Making the sign in buttons show certain info
const whenSignedIn = document.getElementByClassName('signed-in');
const whenSignedOut = document.getElementByClassName('signed-out');

whenSignedOut.hidden = false;
whenSignedIn.hidden = true;

onAuthStateChanged(auth, user => {
    if (user) {
        // signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
    }
});