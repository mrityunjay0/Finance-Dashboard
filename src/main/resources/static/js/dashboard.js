document.addEventListener('DOMContentLoaded', () => {
    // Initialize Charts
    let trendChart, categoryChart;

    // Fetch All Data
    fetchSummary();
    fetchMonthlyTrends();
    fetchCategoryTotals();
    fetchRecentActivity();

    // --- Data Fetching Functions ---

    async function fetchSummary() {
        try {
            const response = await fetch('/dashboard/summary');
            const data = await response.json();
            
            document.getElementById('total-income').innerText = formatCurrency(data.totalIncome || 0);
            document.getElementById('total-expense').innerText = formatCurrency(data.totalExpenses || 0);
            document.getElementById('net-balance').innerText = formatCurrency(data.netBalance || 0);
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    }

    async function fetchMonthlyTrends() {
        try {
            const response = await fetch('/dashboard/monthly-trends');
            const data = await response.json();
            
            const labels = data.map(item => getMonthName(item.month));
            const incomeData = data.map(item => item.totalIncome);
            const expenseData = data.map(item => item.totalExpense);

            renderTrendChart(labels, incomeData, expenseData);
        } catch (error) {
            console.error('Error fetching trends:', error);
        }
    }

    async function fetchCategoryTotals() {
        try {
            const response = await fetch('/dashboard/category-total');
            const data = await response.json();
            
            // For the pie chart, we usually want to show expenses by category
            const labels = data.map(item => item.category);
            const values = data.map(item => item.totalExpense);

            renderCategoryChart(labels, values);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    async function fetchRecentActivity() {
        try {
            const response = await fetch('/dashboard/recent-activity');
            const data = await response.json();
            const tableBody = document.getElementById('recent-activity-body');
            tableBody.innerHTML = '';

            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatDate(item.date)}</td>
                    <td>${item.description || 'No Description'}</td>
                    <td>${item.category}</td>
                    <td><span class="type-badge badge-${item.type.toLowerCase()}">${item.type}</span></td>
                    <td class="${item.type === 'INCOME' ? 'text-success' : 'text-danger'} font-bold">
                        ${item.type === 'INCOME' ? '+' : '-'}${formatCurrency(item.amount)}
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching recent activity:', error);
        }
    }

    // --- Chart Rendering ---

    function renderTrendChart(labels, income, expense) {
        const ctx = document.getElementById('trendChart').getContext('2d');
        
        if (trendChart) trendChart.destroy();

        trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Income',
                        data: income,
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 4,
                        pointBackgroundColor: '#10B981'
                    },
                    {
                        label: 'Expense',
                        data: expense,
                        borderColor: '#EF4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 4,
                        pointBackgroundColor: '#EF4444'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: '#94A3B8', font: { family: 'Inter', size: 12 } }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94A3B8' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94A3B8' }
                    }
                }
            }
        });
    }

    function renderCategoryChart(labels, values) {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        
        if (categoryChart) categoryChart.destroy();

        categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        '#4F46E5', '#10B981', '#F59E0B', '#EF4444', 
                        '#8B5CF6', '#EC4899', '#06B6D4'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#94A3B8',
                            padding: 20,
                            font: { family: 'Inter', size: 12 },
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    // --- Helpers ---

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }

    function formatDate(dateString) {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    }

    function getMonthName(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('en-US', { month: 'short' });
    }
});

// Modal Logic
function openModal() {
    document.getElementById('transactionModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('transactionModal').style.display = 'none';
}

// Close modal if clicking outside content
window.onclick = function(event) {
    const modal = document.getElementById('transactionModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Form Submission
document.getElementById('transactionForm').onsubmit = async (e) => {
    e.preventDefault();
    const formData = {
        amount: document.getElementById('amount').value,
        type: document.getElementById('type').value,
        category: document.getElementById('category').value,
        date: document.getElementById('date').value,
        description: document.getElementById('description').value
    };

    try {
        const response = await fetch('/records/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            closeModal();
            location.reload(); // Refresh to update charts
        } else {
            alert('Error creating transaction');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};
