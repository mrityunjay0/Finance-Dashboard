// Centralized fetch handler to show backend errors
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

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount || 0);
}

function formatDate(dateString) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-IN', {
        month: 'short', day: 'numeric', year: 'numeric'
    });
}

// Navigation & Persistence
function showSection(sectionId) {
    const sections = ['section-transactions', 'section-users'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = (id === `section-${sectionId}`) ? 'block' : 'none';
    });
    
    // Update button highlighting
    const btnTransactions = document.getElementById('btn-transactions');
    const btnUsers = document.getElementById('btn-users');
    
    if (sectionId === 'transactions') {
        if (btnTransactions) btnTransactions.classList.remove('secondary');
        if (btnUsers) btnUsers.classList.add('secondary');
    } else {
        if (btnTransactions) btnTransactions.classList.add('secondary');
        if (btnUsers) btnUsers.classList.remove('secondary');
    }

    // Persist active section
    sessionStorage.setItem('activeSection', sectionId);
}

function restoreSection() {
    const savedSection = sessionStorage.getItem('activeSection') || 'transactions';
    showSection(savedSection);
}

function flashAndReload(message) {
    sessionStorage.setItem('flashMessage', message);
    location.reload();
}

function checkFlashMessage() {
    const msg = sessionStorage.getItem('flashMessage');
    if (msg) {
        alert(msg);
        sessionStorage.removeItem('flashMessage');
    }
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'flex';
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
}

// Data Loading
async function loadSummary() {
    try {
        const data = await fetch('/dashboard/summary').then(handleResponse);
        const elements = {
            balance: document.getElementById("balance"),
            income: document.getElementById("total-income"),
            expense: document.getElementById("total-expenses")
        };
        if (elements.balance) elements.balance.innerText = formatCurrency(data.netBalance);
        if (elements.income) elements.income.innerText = formatCurrency(data.totalIncome);
        if (elements.expense) elements.expense.innerText = formatCurrency(data.totalExpense);
    } catch (e) { console.error("Summary load error", e); }
}

async function applyFilters() {
    let url = `/records/filter?`;
    const type = document.getElementById("filterType").value;
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;
    if (type) url += `type=${type}&`;
    if (start) url += `startDate=${start}&`;
    if (end) url += `endDate=${end}`;

    try {
        const data = await fetch(url).then(handleResponse);
        const tableBody = document.getElementById("records-table");
        tableBody.innerHTML = "";
        data.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td style="color: var(--text-secondary);">${formatDate(item.date)}</td>
                <td style="font-weight: 500;">${item.category}</td>
                <td><span class="badge ${item.type === 'INCOME' ? 'badge-income' : 'badge-expense'}">${item.type}</span></td>
                <td style="font-size: 0.875rem; color: var(--text-secondary);">${item.description || '-'}</td>
                <td style="text-align: right; font-weight: 600;">${formatCurrency(item.amount)}</td>
                <td style="text-align: right;">
                    <button onclick="editRecord(${item.id})" class="secondary" style="padding: 0.25rem 0.5rem; margin-right: 0.25rem;">Edit</button>
                    <button onclick="deleteRecord(${item.id})" class="danger" style="padding: 0.25rem 0.5rem;">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (e) { console.error("Filter error", e); }
}

async function loadUsers() {
    try {
        const data = await fetch('/user/all').then(handleResponse);
        const tableBody = document.getElementById("users-table");
        tableBody.innerHTML = "";
        data.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <div style="font-weight: 500;">${user.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">${user.email}</div>
                </td>
                <td><span class="badge" style="background: rgba(255,255,255,0.05);">${user.role}</span></td>
                <td><span class="badge ${user.status === 'ACTIVE' ? 'badge-income' : 'badge-expense'}">${user.status}</span></td>
                <td style="text-align: right;">
                    <button onclick="editUser(${user.id})" class="secondary" style="padding: 0.25rem 0.5rem; margin-right: 0.25rem;">Edit</button>
                    <button onclick="deleteUser(${user.id})" class="danger" style="padding: 0.25rem 0.5rem;">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (e) { console.error("Users load error", e); }
}

// Transaction Actions
async function createRecord() {
    const record = {
        amount: document.getElementById("amount").value,
        type: document.getElementById("type").value,
        category: document.getElementById("category").value,
        date: document.getElementById("date").value,
        description: document.getElementById("description").value
    };

    try {
        await fetch('/records/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(record)
        }).then(handleResponse);
        flashAndReload("Transaction created successfully!");
    } catch (e) {}
}

async function editRecord(id) {
    try {
        const record = await fetch(`/records/${id}`).then(handleResponse);
        document.getElementById("edit-record-id").value = record.id;
        document.getElementById("edit-amount").value = record.amount;
        document.getElementById("edit-type").value = record.type;
        document.getElementById("edit-category").value = record.category;
        document.getElementById("edit-date").value = record.date;
        document.getElementById("edit-description").value = record.description;
        openModal("modal-edit-record");
    } catch (e) {}
}

async function updateRecord() {
    const id = document.getElementById("edit-record-id").value;
    const record = {
        amount: document.getElementById("edit-amount").value,
        type: document.getElementById("edit-type").value,
        category: document.getElementById("edit-category").value,
        date: document.getElementById("edit-date").value,
        description: document.getElementById("edit-description").value
    };
    try {
        await fetch(`/records/update/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(record)
        }).then(handleResponse);
        flashAndReload("Transaction updated successfully!");
    } catch (e) {}
}

async function deleteRecord(id) {
    if (!confirm("Delete this record permanently?")) return;
    try {
        await fetch(`/records/delete/${id}`, { method: 'DELETE' }).then(handleResponse);
        flashAndReload("Transaction deleted successfully!");
    } catch (e) {}
}

// User Actions
async function createUser() {
    const user = {
        name: document.getElementById("reg-user-name").value,
        email: document.getElementById("reg-user-email").value,
        password: document.getElementById("reg-user-password").value
    };

    try {
        await fetch('/user/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        }).then(handleResponse);
        flashAndReload("User registered successfully!");
    } catch (e) {}
}

async function editUser(id) {
    try {
        const user = await fetch(`/user/${id}`).then(handleResponse);
        document.getElementById("edit-user-id").value = user.id;
        document.getElementById("edit-user-name").value = user.name;
        document.getElementById("edit-user-email").value = user.email;
        document.getElementById("edit-user-password").value = "";
        openModal("modal-edit-user");
    } catch (e) {}
}

async function updateUser() {
    const id = document.getElementById("edit-user-id").value;
    const user = {
        name: document.getElementById("edit-user-name").value,
        email: document.getElementById("edit-user-email").value,
        password: document.getElementById("edit-user-password").value
    };
    try {
        await fetch(`/user/update/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        }).then(handleResponse);
        flashAndReload("User updated successfully!");
    } catch (e) {}
}

async function deleteUser(id) {
    if (!confirm("Delete this user permanently?")) return;
    try {
        await fetch(`/user/delete/${id}`, { method: 'DELETE' }).then(handleResponse);
        flashAndReload("User deleted successfully!");
    } catch (e) {}
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    checkFlashMessage();
    restoreSection();
    loadSummary();
    applyFilters();
    loadUsers();
});