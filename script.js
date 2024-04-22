import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_S4T6yPXYUhhfPbdIXaeOcuHcVImEPwU",
  authDomain: "agritracking-ceb9a.firebaseapp.com",
  projectId: "agritracking-ceb9a",
  storageBucket: "agritracking-ceb9a.appspot.com",
  messagingSenderId: "130366030796",
  appId: "1:130366030796:web:e43cdbbb1c071bef0b1369"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

const form = document.getElementById('expenseForm');
const expenseTable = document.getElementById('expenseTable');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const category = formData.get('category');
    const amount = parseFloat(formData.get('amount'));
    const date = new Date().toISOString();

    // Add expense to Firestore
    try {
        await addDoc(collection(db, 'expenses'), {
            category,
            amount,
            date
        });
        // Clear form fields
        form.reset();
    } catch (e) {
        console.error('Error adding expense: ', e);
    }
});

// Function to display expenses in table
function displayExpenses(expenses) {
    // Clear previous data
    expenseTable.innerHTML = '';

    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.category}</td>
            <td>${expense.amount}</td>
            <td>${new Date(expense.date).toLocaleDateString()}</td>
        `;
        expenseTable.appendChild(row);
    });
}

// Function to fetch and display expenses
async function fetchAndDisplayExpenses() {
    try {
        const q = query(collection(db, 'expenses'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const expenses = [];
            querySnapshot.forEach((doc) => {
                expenses.push({ id: doc.id, ...doc.data() });
            });
            displayExpenses(expenses);
        });
    } catch (e) {
        console.error('Error fetching expenses: ', e);
    }
}

// Call function to initialize and display data
fetchAndDisplayExpenses();