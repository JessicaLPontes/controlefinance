const transactionForm = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const balanceElement = document.getElementById('balance');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Função para adicionar transação
function addTransaction(event) {
    event.preventDefault();

    const description = document.getElementById('description').value;
    const amountInput = document.getElementById('amount').value;
    const type = document.getElementById('type').value;
    const month = document.getElementById('month').value;

    // Substitui vírgula por ponto e converte para número
    const amount = parseFloat(amountInput.replace(',', '.'));

    if (isNaN(amount)) {
        alert('Por favor, insira um valor válido.');
        return;
    }

    const transaction = {
        id: Date.now(), // Usa o timestamp como ID
        description,
        amount,
        type,
        month,
    };

    transactions.push(transaction);
    saveTransactions();
    updateDisplay();
    transactionForm.reset();
}

// Função para salvar transações no localStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Função para editar transação
function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    // Preenche o formulário com os dados da transação
    document.getElementById('description').value = transaction.description;
    document.getElementById('amount').value = transaction.amount.toString().replace('.', ',');
    document.getElementById('type').value = transaction.type;
    document.getElementById('month').value = transaction.month;

    // Remove a transação da lista
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    updateDisplay();
}

// Função para excluir transação
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    updateDisplay();
}

// Função para atualizar a exibição
function updateDisplay() {
    transactionList.innerHTML = '';
    let balance = 0;

    // Filtra transações pelo mês selecionado
    const selectedMonth = document.getElementById('month').value;
    const filteredTransactions = transactions.filter(t => t.month === selectedMonth);

    filteredTransactions.forEach(transaction => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${transaction.description}</span>
            <span class="${transaction.type}">${transaction.type === 'income' ? '+' : '-'} R$ ${transaction.amount.toFixed(2).replace('.', ',')}</span>
            <button class="edit" onclick="editTransaction(${transaction.id})">Editar</button>
            <button class="delete" onclick="deleteTransaction(${transaction.id})">Excluir</button>
        `;
        transactionList.appendChild(li);

        if (transaction.type === 'income') {
            balance += transaction.amount;
        } else {
            balance -= transaction.amount;
        }
    });

    // Exibe o saldo no formato brasileiro
    balanceElement.textContent = `R$ ${balance.toFixed(2).replace('.', ',')}`;
}

// Carrega as transações ao iniciar
updateDisplay();

// Adiciona evento ao formulário
transactionForm.addEventListener('submit', addTransaction);