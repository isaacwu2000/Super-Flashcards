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
    } catch (error) {
        console.error("Error signing in with Google:", error);
    }
}

// Function to sign out
async function signOutFromGoogle() {
    try {
        await signOut(auth);
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
const whenSignedIn = document.getElementById('signed-in');
const whenSignedOut = document.getElementById('signed-out');

onAuthStateChanged(auth, user => {
    if (user) {
        // signed in
        whenSignedIn.style.display = 'block';
        whenSignedOut.style.display = 'none';
    } else {
        // not signed in
        whenSignedIn.style.display = 'none';
        whenSignedOut.style.display = 'block';
    }
});

// Making the add cards button work
const addCardsBtn = document.getElementById('add-cards-btn');
const addingCardsDiv = document.getElementById('adding-cards');
addCardsBtn.addEventListener('click', function() {
    if (addCardsBtn.textContent == '+') {
        addingCardsDiv.style.display = 'block';
        addCardsBtn.textContent = '-';
        console.log('displaying'); 
    }
    else {
        addingCardsDiv.style.display = 'none';
        addCardsBtn.textContent = '+';
        console.log('noe displaying');
    }
});

// Getting the add flashcards div to be able to add flashcards
const addingCardsForm = document.getElementById('adding-cards-form');
const inputedFlashcardsTextarea = document.getElementById('inputed-flashcards-textarea');

// Extracting the flashcards when the form is submited
addingCardsForm.addEventListener('submit', (event) => {
    // Prevent the form from reloading the page
    event.preventDefault();
  
    // Get the value of the textarea
    const inputedFlashcards = inputedFlashcardsTextarea.value;
    console.log(inputedFlashcards);

    // Closing the form
    addingCardsDiv.style.display = 'none';
    addCardsBtn.textContent = '+';
    console.log('noe displaying');
});

