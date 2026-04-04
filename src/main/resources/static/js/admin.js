async function loadSummary() {
    const res = await fetch('/dashboard/summary');
    const data = await res.json();
    document.getElementById('output').innerText = JSON.stringify(data, null, 2);
}

async function createRecord() {
    const res = await fetch('/records/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            amount: 1000,
            type: "EXPENSE",
            category: "FOOD",
            date: "2026-04-01",
            description: "Test"
        })
    });

    alert(res.ok ? "Created!" : "Failed!");
}