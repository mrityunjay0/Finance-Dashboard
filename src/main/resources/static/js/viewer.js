const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

async function loadSummary() {
    try {
        const res = await fetch('/dashboard/summary');
        const data = await res.json();
        document.getElementById('balance').innerText = formatCurrency(data.netBalance);
        document.getElementById('total-income').innerText = formatCurrency(data.totalIncome);
        document.getElementById('total-expenses').innerText = formatCurrency(data.totalExpense);
    } catch (e) { console.error("Summary load error", e); }
}

async function loadRecentActivity() {
    try {
        const res = await fetch('/dashboard/recent-activity');
        const data = await res.json();
        const tableBody = document.getElementById('activity-table');
        tableBody.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="color: var(--text-secondary);">${formatDate(item.date)}</td>
                <td style="font-weight: 500;">${item.category}</td>
                <td><span class="badge ${item.type === 'INCOME' ? 'badge-income' : 'badge-expense'}">${item.type}</span></td>
                <td style="text-align: right; font-weight: 600;">${formatCurrency(item.amount)}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (e) { console.error("Recent activity load error", e); }
}

async function loadCategoryDistribution() {
    try {
        const res = await fetch('/dashboard/category-total');
        const data = await res.json();
        const container = document.getElementById('category-list');
        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No category data available.</p>';
            return;
        }

        // Find max amount to calculate percentage bars
        const maxAmount = Math.max(...data.map(c => c.totalAmount));

        data.forEach(cat => {
            const percentage = (cat.totalAmount / maxAmount) * 100;
            const item = document.createElement('div');
            item.className = 'category-item';
            item.innerHTML = `
                <div class="category-header">
                    <span style="font-weight: 600;">${cat.category}</span>
                    <span style="color: var(--text-secondary);">${formatCurrency(cat.totalAmount)}</span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${percentage}%"></div>
                </div>
            `;
            container.appendChild(item);
        });
    } catch (e) { console.error("Category distribution load error", e); }
}

async function loadMonthlyTrends() {
    try {
        const res = await fetch('/dashboard/monthly-trends');
        const data = await res.json();
        const container = document.getElementById('trends-list');
        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No monthly data available.</p>';
            return;
        }

        // Find max value across income and expense for bar scaling
        const maxVal = Math.max(...data.flatMap(d => [d.income, d.expense]));

        data.forEach(month => {
            const incPerc = (month.income / maxVal) * 100;
            const expPerc = (month.expense / maxVal) * 100;
            
            const item = document.createElement('div');
            item.className = 'trend-item';
            item.innerHTML = `
                <div class="trend-month">${month.month}</div>
                <div class="trend-bars">
                    <div class="mini-bar mini-bar-income" style="width: ${incPerc}%" title="Income: ${formatCurrency(month.income)}"></div>
                    <div class="mini-bar mini-bar-expense" style="width: ${expPerc}%" title="Expense: ${formatCurrency(month.expense)}"></div>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-secondary); min-width: 60px; text-align: right;">
                    ${formatCurrency(month.income - month.expense)}
                </div>
            `;
            container.appendChild(item);
        });
    } catch (e) { console.error("Monthly trends load error", e); }
}

document.addEventListener('DOMContentLoaded', () => {
    loadSummary();
    loadRecentActivity();
    loadCategoryDistribution();
    loadMonthlyTrends();
});