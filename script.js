// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB0yrp9gvOWBsNQeNCMEeupwloJrIrPedk",
    authDomain: "controle-financeiro-2d3ba.firebaseapp.com",
    projectId: "controle-financeiro-2d3ba",
    storageBucket: "controle-financeiro-2d3ba.firebasestorage.app",
    messagingSenderId: "768132634596",
    appId: "1:768132634596:web:9bcc7c3f7b86f20cc6d9f1",
    measurementId: "G-4K844EZWEH"
};

// Inicializa o Firebase
const app = firebase.initializeApp(firebaseConfig);
console.log('Firebase inicializado:', app);

const db = firebase.firestore(); // Referência ao Firestore

// Elementos da interface
const transactionForm = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const balanceElement = document.getElementById('balance');

// Função para adicionar transação
function addTransaction(event) {
    event.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const month = document.getElementById('month').value;

    console.log('Dados do formulário:', { description, amount, type, month });

    db.collection('transactions').add({
        description,
        amount,
        type,
        month,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
        console.log('Transação adicionada com sucesso!');
        transactionForm.reset();
        loadTransactions();
    })
    .catch((error) => {
        console.error('Erro ao adicionar transação: ', error);
    });
}

// Função para carregar transações
function loadTransactions() {
    db.collection('transactions').get()
        .then((snapshot) => {
            console.log('Transações carregadas:', snapshot.docs);
            const transactions = [];
            snapshot.forEach((doc) => {
                transactions.push({ id: doc.id, ...doc.data() });
            });
            updateDisplay(transactions);
        })
        .catch((error) => {
            console.error('Erro ao buscar transações: ', error);
        });
}

// Função para atualizar a exibição
function updateDisplay(transactions) {
    transactionList.innerHTML = '';
    let balance = 0;

    // Filtra transações pelo mês selecionado
    const selectedMonth = document.getElementById('month').value;
    const filteredTransactions = transactions.filter(t => t.month === selectedMonth);

    filteredTransactions.forEach((transaction) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${transaction.description}</span>
            <span class="${transaction.type}">${transaction.type === 'income' ? '+' : '-'} R$ ${transaction.amount.toFixed(2)}</span>
            <button class="edit" onclick="editTransaction('${transaction.id}')">Editar</button>
            <button class="delete" onclick="deleteTransaction('${transaction.id}')">Excluir</button>
        `;
        transactionList.appendChild(li);

        if (transaction.type === 'income') {
            balance += transaction.amount;
        } else {
            balance -= transaction.amount;
        }
    });

    balanceElement.textContent = `R$ ${balance.toFixed(2)}`;
}

// Carrega as transações ao iniciar
loadTransactions();

// Adiciona evento ao formulário
transactionForm.addEventListener('submit', addTransaction);
