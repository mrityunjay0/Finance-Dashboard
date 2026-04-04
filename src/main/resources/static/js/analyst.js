async function loadSummary() {
    const res = await fetch('/dashboard/summary');
    const data = await res.json();
    document.getElementById('output').innerText = JSON.stringify(data, null, 2);
}

async function loadRecords() {
    const res = await fetch('/records/all');
    const data = await res.json();
    document.getElementById('output').innerText = JSON.stringify(data, null, 2);
}