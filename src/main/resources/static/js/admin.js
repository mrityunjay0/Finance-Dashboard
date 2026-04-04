// Global error handler for debugging
window.onerror = function(msg, url, line, col, error) {
    console.error("Global JS Error:", msg, "at", url, ":", line);
    alert("System Error: " + msg);
    return false;
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    } catch (e) { return dateString; }
};

// Modal Management
function openModal(id) {
    console.log("Attempting to open modal:", id);
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'flex';
    } else {
        alert("Error: Modal UI '" + id + "' not found.");
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'none';
    }
}

function showSection(section) {
    const transSec = document.getElementById('section-transactions');
    const userSec = document.getElementById('section-users');
    
    if (transSec) transSec.style.display = section === 'transactions' ? 'block' : 'none';
    if (userSec) userSec.style.display = section === 'users' ? 'block' : 'none';
    
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
        const balEl = document.getElementById("balance");
        if (balEl) balEl.innerText = formatCurrency(summary.netBalance);
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
        alert("Please fill in required fields (Amount and Date)");
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
            document.getElementById("amount").value = "";
            document.getElementById("description").value = "";
        } else {
            const err = await res.text();
            alert("Error creating record: " + err);
        }
    } catch (e) { console.error(e); alert("Network error while creating record"); }
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
    if (!tableBody) return;
    tableBody.innerHTML = "";

    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="color: var(--text-secondary);">${formatDate(item.date)}</td>
            <td><span style="font-weight: 500;">${item.category}</span></td>
            <td><span class="badge ${item.type === 'INCOME' ? 'badge-income' : 'badge-expense'}">${item.type}</span></td>
            <td style="font-size: 0.875rem; color: var(--text-secondary);">${item.description}</td>
            <td style="text-align: right; font-weight: 600;">${formatCurrency(item.amount)}</td>
            <td style="text-align: right; display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button onclick="editRecord(${item.id})" class="secondary" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">Edit</button>
                <button onclick="deleteRecord(${item.id})" class="secondary danger" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Edit Record Logic
async function editRecord(id) {
    console.log("Edit requested for record ID:", id);
    try {
        const res = await fetch(`/records/${id}`);
        if (!res.ok) throw new Error("Could not fetch record details (Status: " + res.status + ")");
        const data = await res.json();
        
        console.log("Fetched record data:", data);

        // Populate fields
        const idField = document.getElementById('edit-record-id');
        const amountField = document.getElementById('edit-amount');
        const typeField = document.getElementById('edit-type');
        const catField = document.getElementById('edit-category');
        const dateField = document.getElementById('edit-date');
        const descField = document.getElementById('edit-description');

        if (idField) idField.value = data.id;
        if (amountField) amountField.value = data.amount;
        if (typeField) typeField.value = data.type;
        if (catField) catField.value = data.category;
        
        // Ensure date is in YYYY-MM-DD
        if (dateField) {
            if (Array.isArray(data.date)) { // Handle [YYYY, M, D]
                const y = data.date[0];
                const m = String(data.date[1]).padStart(2, '0');
                const d = String(data.date[2]).padStart(2, '0');
                dateField.value = `${y}-${m}-${d}`;
            } else {
                dateField.value = data.date;
            }
        }
        
        if (descField) descField.value = data.description || "";
        
        openModal('modal-edit-record');
    } catch (e) { 
        console.error("Edit Record Error:", e);
        alert("Error loading record: " + e.message);
    }
}

async function updateRecord() {
    const id = document.getElementById('edit-record-id').value;
    const record = {
        amount: document.getElementById("edit-amount").value,
        type: document.getElementById("edit-type").value,
        category: document.getElementById("edit-category").value,
        date: document.getElementById("edit-date").value,
        description: document.getElementById("edit-description").value
    };

    try {
        const res = await fetch(`/records/update/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(record)
        });

        if (res.ok) {
            alert("Record updated successfully");
            closeModal('modal-edit-record');
            applyFilters();
            loadSummary();
        } else {
            const err = await res.text();
            alert("Error updating record: " + err);
        }
    } catch (e) { console.error(e); alert("Network error while updating record"); }
}

async function deleteRecord(id) {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
        const res = await fetch(`/records/delete/${id}`, {method: 'DELETE'});
        if (res.ok) {
            applyFilters();
            loadSummary();
        } else {
            alert("Error deleting record");
        }
    } catch (e) { console.error(e); }
}

async function loadUsers() {
    try {
        const res = await fetch('/user/all');
        const data = await res.json();
        const tableBody = document.getElementById("users-table");
        if (!tableBody) return;
        tableBody.innerHTML = "";

        data.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.id}</td>
                <td style="font-weight: 500;">${user.name}</td>
                <td style="color: var(--text-secondary);">${user.email}</td>
                <td><span class="badge" style="background: rgba(255,255,255,0.05);">${user.role}</span></td>
                <td><span class="badge ${user.status === 'ACTIVE' ? 'badge-income' : 'badge-expense'}">${user.status}</span></td>
                <td style="text-align: right; display: flex; gap: 0.5rem; justify-content: flex-end;">
                    <button onclick="editUser(${user.id})" class="secondary" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">Edit</button>
                    <button onclick="deleteUser(${user.id})" class="secondary danger" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">Remove</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (e) { console.error(e); }
}

async function editUser(id) {
    console.log("Edit requested for user ID:", id);
    try {
        const res = await fetch(`/user/${id}`);
        if (!res.ok) throw new Error("Could not fetch user details (Status: " + res.status + ")");
        const data = await res.json();
        
        console.log("Fetched user data:", data);

        const idField = document.getElementById('edit-user-id');
        const nameField = document.getElementById('edit-user-name');
        const emailField = document.getElementById('edit-user-email');
        const passField = document.getElementById('edit-user-password');

        if (idField) idField.value = data.id;
        if (nameField) nameField.value = data.name;
        if (emailField) emailField.value = data.email;
        if (passField) passField.value = ""; // Clear password field for security
        
        openModal('modal-edit-user');
    } catch (e) { 
        console.error("Edit User Error:", e);
        alert("Error loading user: " + e.message);
    }
}

async function updateUser() {
    const id = document.getElementById('edit-user-id').value;
    const user = {
        name: document.getElementById("edit-user-name").value,
        email: document.getElementById("edit-user-email").value,
        password: document.getElementById("edit-user-password").value
    };

    if (user.password && user.password.length < 6) {
        alert("Password must be at least 6 characters if you wish to change it");
        return;
    }

    try {
        // Note: The backend currently might require a password due to @NotBlank. 
        // If the user didn't enter one, we might need a workaround or the user must enter it.
        const res = await fetch(`/user/update/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(user)
        });

        if (res.ok) {
            alert("User updated successfully");
            closeModal('modal-edit-user');
            loadUsers();
        } else {
            const err = await res.text();
            alert("Error updating user (Password might be required): " + err);
        }
    } catch (e) { console.error(e); alert("Network error while updating user"); }
}

async function deleteUser(id) {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    try {
        const res = await fetch(`/user/delete/${id}`, {method: 'DELETE'});
        if (res.ok) {
            loadUsers();
        } else {
            alert("Error deleting user");
        }
    } catch (e) { console.error(e); }
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin Dashboard JS initialized");
    
    // Debug: Check for modals in DOM
    ['modal-edit-record', 'modal-edit-user'].forEach(id => {
        const el = document.getElementById(id);
        console.log(`Checking for ${id}:`, el ? "Found" : "NOT FOUND");
    });

    loadSummary();
    applyFilters();
});