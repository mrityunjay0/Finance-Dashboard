// Global error handler for debugging
window.onerror = function(msg, url, line, col, error) {
    console.error("Global JS Error:", msg, "at", url, ":", line);
    return false;
};

// Handle Fetch Responses centrally to show backend errors
async function handleResponse(response) {
    if (!response.ok) {
        let errorMessage = "An error occurred";
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            errorMessage = response.statusText || errorMessage;
        }
        alert("Error: " + errorMessage);
        throw new Error(errorMessage);
    }
    // Handle empty responses (like 204 No Content)
    if (response.status === 204 || response.headers.get("content-length") === "0") {
        return null;
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }
    return null;
}

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount || 0);
};

const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    } catch (e) { return dateString; }
};

const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('en-IN', { month: 'short' });
};

async function loadSummary() {
    try {
        const data = await fetch('/dashboard/summary').then(handleResponse);
        
        const balanceEl = document.getElementById('balance');
        const incomeEl = document.getElementById('total-income');
        const expenseEl = document.getElementById('total-expenses');

        if (balanceEl) balanceEl.innerText = formatCurrency(data.netBalance);
        if (incomeEl) incomeEl.innerText = formatCurrency(data.totalIncome);
        if (expenseEl) expenseEl.innerText = formatCurrency(data.totalExpense);
    } catch (e) { console.error("Summary load error", e); }
}

async function loadRecentActivity() {
    try {
        const data = await fetch('/dashboard/recent-activity').then(handleResponse);
        const tableBody = document.getElementById('activity-table');
        if (!tableBody) return;
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
        const data = await fetch('/dashboard/category-total').then(handleResponse);
        const container = document.getElementById('category-list');
        if (!container) return;
        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No category data available.</p>';
            return;
        }

        // Find max amount across all categories for bar scaling
        const maxVal = Math.max(...data.flatMap(c => [c.totalIncome || 0, c.totalExpense || 0]), 1);

        data.forEach(cat => {
            const incPerc = (cat.totalIncome / maxVal) * 100;
            const expPerc = (cat.totalExpense / maxVal) * 100;
            
            const item = document.createElement('div');
            item.className = 'category-item';
            item.innerHTML = `
                <div class="category-header">
                    <span style="font-weight: 600;">${cat.category}</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; height: 12px;">
                        <div class="progress-container" style="flex-grow: 1; height: 6px;">
                            <div class="progress-bar" style="width: ${incPerc}%; background: var(--success);"></div>
                        </div>
                        <span style="font-size: 0.75rem; color: var(--success); min-width: 60px; text-align: right;">${formatCurrency(cat.totalIncome)}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; height: 12px;">
                        <div class="progress-container" style="flex-grow: 1; height: 6px;">
                            <div class="progress-bar" style="width: ${expPerc}%; background: var(--danger);"></div>
                        </div>
                        <span style="font-size: 0.75rem; color: var(--danger); min-width: 60px; text-align: right;">${formatCurrency(cat.totalExpense)}</span>
                    </div>
                </div>
            `;
            container.appendChild(item);
        });
    } catch (e) { console.error("Category distribution load error", e); }
}

async function loadMonthlyTrends() {
    try {
        const data = await fetch('/dashboard/monthly-trends').then(handleResponse);
        const container = document.getElementById('trends-list');
        if (!container) return;
        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No monthly data available.</p>';
            return;
        }

        const maxVal = Math.max(...data.flatMap(d => [d.totalIncome || 0, d.totalExpense || 0]), 1);

        data.forEach(monthData => {
            const incPerc = (monthData.totalIncome / maxVal) * 100;
            const expPerc = (monthData.totalExpense / maxVal) * 100;
            const monthName = getMonthName(monthData.month);
            
            const item = document.createElement('div');
            item.className = 'trend-item';
            item.innerHTML = `
                <div class="trend-month">${monthName}</div>
                <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 0.25rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="mini-bar mini-bar-income" style="width: ${incPerc}%"></div>
                        <span style="font-size: 0.75rem; color: var(--success); font-weight: 500;">${formatCurrency(monthData.totalIncome)}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="mini-bar mini-bar-expense" style="width: ${expPerc}%"></div>
                        <span style="font-size: 0.75rem; color: var(--danger); font-weight: 500;">${formatCurrency(monthData.totalExpense)}</span>
                    </div>
                </div>
            `;
            container.appendChild(item);
        });
    } catch (e) { console.error("Monthly trends load error", e); }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Viewer Dashboard Initialized");
    loadSummary();
    loadRecentActivity();
    loadCategoryDistribution();
    loadMonthlyTrends();
});