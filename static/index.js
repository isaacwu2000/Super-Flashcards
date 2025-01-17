// Importing the used firebase functions
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
import { getAuth, onAuthStateChanged, GoogleAuthProvider,signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';
import { getFirestore, collection, addDoc, doc, serverTimestamp, query, where, getDocs, deleteDoc } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js';

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
const db = getFirestore(app);

// Setting the GoogleAuthProvider
const provider = new GoogleAuthProvider();

// Function to sign in with Google
async function signInWithGoogle() {
    try {
        await signInWithPopup(auth, provider);
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

// Searching for / Getting the User's flashcard set reference
async function findUserFlashcardSet(user) {
    const q = query(collection(db, "flashcard_sets"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    let docRef = null;
    querySnapshot.forEach((docSnap) => {
        docRef = doc(db, "flashcard_sets", docSnap.id);
    });

    return docRef;
}

// Making the textarea permantly hold the flashcards
async function displayFlashcardsInTextarea(userFlashcardSetRef) {
    // Getting the flashcards
    const querySnapshot = await getDocs(collection(userFlashcardSetRef, "flashcards"));
    const flashcardArrayDicts = querySnapshot.docs.map(doc => doc.data());

    // Converting them to a string and updating the textarea
    let flashcardsString = '';
    for (let flashcardDict of flashcardArrayDicts) {
        flashcardsString += `${flashcardDict.term},${flashcardDict.def},${flashcardDict.level}\n`;
    }
    const flashcardTextarea = document.getElementById("inputed-flashcards-textarea");
    flashcardTextarea.value = flashcardsString;
}

let currentUser = null;
onAuthStateChanged(auth, async user => {
    if (user) {
        // signed in
        currentUser = user;
        whenSignedIn.style.display = 'block';
        whenSignedOut.style.display = 'none';

        // Setting the text area at the start
        const userFlashcardSetRef = await findUserFlashcardSet(currentUser);
        if (userFlashcardSetRef != null) {
            displayFlashcardsInTextarea(userFlashcardSetRef);
        }

        // Sending the User's data to flask
        fetch('http://127.0.0.1:5500/receive-user-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentUser)
        })
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
    }
    else {
        addingCardsDiv.style.display = 'none';
        addCardsBtn.textContent = '+';
    }
});

// Getting the add flashcards div to be able to add flashcards
const addingCardsForm = document.getElementById('adding-cards-form');
const inputedFlashcardsTextarea = document.getElementById('inputed-flashcards-textarea');

// Extracting the flashcards when the form is submited
// and uploading them to Firebase Firestore
addingCardsForm.addEventListener('submit', async (event) => {
    // Prevent the form from reloading the page
    event.preventDefault();

    // Getting the reference for the user's flashcard set
    let userFlashcardSetRef = await findUserFlashcardSet(currentUser);

    // Creating the User's main set if they don't have one yet
    if (userFlashcardSetRef == null) {
        addDoc(collection(db, "flashcard_sets"), {
            dateCreated: serverTimestamp(),
            name: `${currentUser.displayName}\'s Main Set`,
            uid: currentUser.uid
        })
        userFlashcardSetRef = await findUserFlashcardSet(currentUser);
    }

    // Get the value of the textarea
    const inputedFlashcards = inputedFlashcardsTextarea.value;

    // Converting the text area to an arraydict of flashcards
    let inputedFlashcardsArrayDict = [];
    let inputedFlashcardsArray = inputedFlashcards.split("\n");
    for (let unformattedFlashcard of inputedFlashcardsArray) {
        let flashcardTerm = unformattedFlashcard.split(",").at(0);
        let flashcardDef = unformattedFlashcard.split(",").at(1);
        let flashcardLevel = unformattedFlashcard.split(",").at(2);

        let formattedFlashcard = {
            term: flashcardTerm,
            def: flashcardDef,
            level: flashcardLevel
        };
        inputedFlashcardsArrayDict.push(formattedFlashcard);
    }

    // Defining the user's flashcardCollection
    const flashcardsCollection = collection(userFlashcardSetRef, "flashcards");

    // Setting the flashcards in the user's set in firebase
    const setFlashcards = async () => {
        // Deleting all the flashcards in the collectin
        const querySnapshot = await getDocs(flashcardsCollection);
        for (const docSnap of querySnapshot.docs) {
            await deleteDoc(docSnap.ref);
        }
        // Adding the data in the text area
        for (let flashcard of inputedFlashcardsArrayDict) {
             // Set data for the subcollection document
            await addDoc(flashcardsCollection, {
                term: flashcard.term,
                def: flashcard.def,
                level: flashcard.level
            });
        }
    };

    await setFlashcards();

    // Closing the form
    addingCardsDiv.style.display = 'none';
    addCardsBtn.textContent = '+';

    // Force reloading the page to update the flashcards in the textarea
    location.reload();
});





  
