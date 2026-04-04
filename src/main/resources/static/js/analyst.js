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

async function loadSummary() {
    try {
        const res = await fetch('/dashboard/summary');
        const summary = await res.json();
        document.getElementById("income").innerText = formatCurrency(summary.totalIncome);
        document.getElementById("expense").innerText = formatCurrency(summary.totalExpenses);
        document.getElementById("balance").innerText = formatCurrency(summary.netBalance);
    } catch (e) { console.error("Summary load error", e); }
}

async function applyFilters() {
    let url = `/records/filter?`;

    const type = document.getElementById("filterType").value;
    const category = document.getElementById("filterCategory").value;
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;

    if(type) url += `type=${type}&`;
    if(category) url += `category=${category}&`;
    if(start) url += `startDate=${start}&`;
    if(end) url += `endDate=${end}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        const tableBody = document.getElementById("records-table");
        document.getElementById("record-count").innerText = `${data.length} records found`;
        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 3rem;">No records match your filters</td></tr>`;
            return;
        }

        data.forEach(item => {
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
    } catch (e) {
        console.error("Filter error", e);
    }
}

function resetFilters() {
    document.getElementById("filterType").value = "";
    document.getElementById("filterCategory").value = "";
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
    applyFilters();
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    loadSummary();
    applyFilters();
});