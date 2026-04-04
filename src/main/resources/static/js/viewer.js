const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

async function loadDashboardData() {
    try {
        // Load Summary
        const summaryRes = await fetch('/dashboard/summary');
        const summary = await summaryRes.json();

        document.getElementById("income").innerText = formatCurrency(summary.totalIncome);
        document.getElementById("expense").innerText = formatCurrency(summary.totalExpenses);
        document.getElementById("balance").innerText = formatCurrency(summary.netBalance);

        // Load Recent Activity
        const activityRes = await fetch('/dashboard/recent-activity');
        const activity = await activityRes.json();

        const tableBody = document.getElementById("recent-activity-table");
        tableBody.innerHTML = "";

        if (activity.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No recent transactions</td></tr>`;
            return;
        }

        activity.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td style="color: var(--text-secondary);">${formatDate(item.date)}</td>
                <td><span style="font-weight: 500;">${item.category}</span></td>
                <td style="font-size: 0.875rem; color: var(--text-secondary);">${item.description}</td>
                <td><span class="badge ${item.type === 'INCOME' ? 'badge-income' : 'badge-expense'}">${item.type}</span></td>
                <td style="text-align: right; font-weight: 600; color: ${item.type === 'INCOME' ? 'var(--success)' : 'var(--text-primary)'}">
                    ${item.type === 'INCOME' ? '+' : '-'}${formatCurrency(item.amount).replace('$', '')}
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading dashboard data:", error);
    }
}

// Initial Load
document.addEventListener('DOMContentLoaded', loadDashboardData);