const transactionForm = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const balanceElement = document.getElementById('balance');
const chartCanvas = document.getElementById('chart').getContext('2d');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Inicializa o gráfico
const chart = new Chart(chartCanvas, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Receitas',
                data: [],
                backgroundColor: 'green',
            },
            {
                label: 'Despesas',
                data: [],
                backgroundColor: 'red',
            },
        ],
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    },
});

// Função para adicionar transação
function addTransaction(event) {
    event.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const month = document.getElementById('month').value;

    const transaction = {
        id: Date.now(),
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

// Função para salvar transações no localStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
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
            <span class="${transaction.type}">${transaction.type === 'income' ? '+' : '-'} R$ ${transaction.amount.toFixed(2)}</span>
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

    balanceElement.textContent = `R$ ${balance.toFixed(2)}`;
    updateChart();
}

// Função para atualizar o gráfico
function updateChart() {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ];

    const incomeData = new Array(12).fill(0);
    const expenseData = new Array(12).fill(0);

    transactions.forEach(transaction => {
        const monthIndex = parseInt(transaction.month) - 1;
        if (transaction.type === 'income') {
            incomeData[monthIndex] += transaction.amount;
        } else {
            expenseData[monthIndex] += transaction.amount;
        }
    });

    chart.data.labels = months;
    chart.data.datasets[0].data = incomeData;
    chart.data.datasets[1].data = expenseData;
    chart.update();
}

// Carrega as transações ao iniciar
updateDisplay();

// Adiciona evento ao formulário
transactionForm.addEventListener('submit', addTransaction);