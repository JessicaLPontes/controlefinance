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

    db.collection('transactions').add({
        description,
        amount,
        type,
        month,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Adiciona timestamp
    })
    .then(() => {
        console.log('Transação adicionada com sucesso!');
        transactionForm.reset(); // Limpa o formulário
        loadTransactions(); // Recarrega a lista de transações
    })
    .catch((error) => {
        console.error('Erro ao adicionar transação: ', error);
    });
}

// Função para carregar transações
function loadTransactions() {
    db.collection('transactions').get()
        .then((snapshot) => {
            const transactions = [];
            snapshot.forEach((doc) => {
                transactions.push({ id: doc.id, ...doc.data() });
            });
            updateDisplay(transactions); // Atualiza a exibição
        })
        .catch((error) => {
            console.error('Erro ao buscar transações: ', error);
        });
}

// Função para editar transação
function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    // Preenche o formulário com os dados da transação
    document.getElementById('description').value = transaction.description;
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('type').value = transaction.type;
    document.getElementById('month').value = transaction.month;

    // Remove a transação da lista
    db.collection('transactions').doc(id).delete()
        .then(() => {
            console.log('Transação excluída com sucesso!');
            loadTransactions(); // Recarrega a lista de transações
        })
        .catch((error) => {
            console.error('Erro ao excluir transação: ', error);
        });
}

// Função para excluir transação
function deleteTransaction(id) {
    db.collection('transactions').doc(id).delete()
        .then(() => {
            console.log('Transação excluída com sucesso!');
            loadTransactions(); // Recarrega a lista de transações
        })
        .catch((error) => {
            console.error('Erro ao excluir transação: ', error);
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
