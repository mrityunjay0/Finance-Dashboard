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

function showSection(section) {
    document.getElementById('section-transactions').style.display = section === 'transactions' ? 'block' : 'none';
    document.getElementById('section-users').style.display = section === 'users' ? 'block' : 'none';
    
    // Update button styles
    const btns = document.querySelectorAll('header button');
    btns.forEach(btn => {
        if (btn.innerText.toLowerCase().includes(section)) {
            btn.className = '';
        } else {
            btn.className = 'secondary';
        }
    });

    if (section === 'users') loadUsers();
}

async function loadSummary() {
    try {
        const res = await fetch('/dashboard/summary');
        const summary = await res.json();
        document.getElementById("balance").innerText = formatCurrency(summary.netBalance);
    } catch (e) { console.error("Summary error", e); }
}

async function createRecord() {
    const record = {
        amount: document.getElementById("amount").value,
        type: document.getElementById("type").value,
        category: document.getElementById("category").value,
        date: document.getElementById("date").value,
        description: document.getElementById("description").value
    };

    if (!record.amount || !record.date) {
        alert("Please fill in required fields");
        return;
    }

    try {
        const res = await fetch('/records/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(record)
        });

        if (res.ok) {
            alert("Record created successfully");
            applyFilters();
            loadSummary();
            // Clear form
            document.getElementById("amount").value = "";
            document.getElementById("description").value = "";
        } else {
            alert("Error creating record");
        }
    } catch (e) { console.error(e); }
}

async function applyFilters() {
    let url = `/records/filter?`;
    const type = document.getElementById("filterType").value;
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;

    if(type) url += `type=${type}&`;
    if(start) url += `startDate=${start}&`;
    if(end) url += `endDate=${end}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        renderRecords(data);
    } catch (e) { console.error(e); }
}

function renderRecords(data) {
    const tableBody = document.getElementById("records-table");
    tableBody.innerHTML = "";

    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="color: var(--text-secondary);">${formatDate(item.date)}</td>
            <td><span style="font-weight: 500;">${item.category}</span></td>
            <td><span class="badge ${item.type === 'INCOME' ? 'badge-income' : 'badge-expense'}">${item.type}</span></td>
            <td style="font-size: 0.875rem; color: var(--text-secondary);">${item.description}</td>
            <td style="text-align: right; font-weight: 600;">${formatCurrency(item.amount)}</td>
            <td style="text-align: right;">
                <button onclick="deleteRecord(${item.id})" class="secondary danger" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function deleteRecord(id) {
    if (!confirm("Are you sure you want to delete this record?")) return;
    await fetch(`/records/delete/${id}`, {method: 'DELETE'});
    applyFilters();
    loadSummary();
}

async function loadUsers() {
    try {
        const res = await fetch('/user/all');
        const data = await res.json();
        const tableBody = document.getElementById("users-table");
        tableBody.innerHTML = "";

        data.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.id}</td>
                <td style="font-weight: 500;">${user.name}</td>
                <td style="color: var(--text-secondary);">${user.email}</td>
                <td><span class="badge" style="background: rgba(255,255,255,0.05);">${user.role}</span></td>
                <td><span class="badge ${user.status === 'ACTIVE' ? 'badge-income' : 'badge-expense'}">${user.status}</span></td>
                <td style="text-align: right;">
                    <button onclick="deleteUser(${user.id})" class="secondary danger" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">Remove</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (e) { console.error(e); }
}

async function deleteUser(id) {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    await fetch(`/user/delete/${id}`, {method: 'DELETE'});
    loadUsers();
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    loadSummary();
    applyFilters();
});