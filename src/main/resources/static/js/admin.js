async function createRecord() {
    const record = {
        amount: document.getElementById("amount").value,
        type: document.getElementById("type").value,
        category: document.getElementById("category").value,
        date: document.getElementById("date").value,
        description: document.getElementById("description").value
    };

    const res = await fetch('/records/create', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(record)
    });

    alert(res.ok ? "Created" : "Error");
}

async function filterRecords() {
    let url = `/records/filter?`;

    const type = document.getElementById("filterType").value;
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;

    if(type) url += `type=${type}&`;
    if(start) url += `startDate=${start}&`;
    if(end) url += `endDate=${end}`;

    const res = await fetch(url);
    const data = await res.json();

    render(data);
}

function render(data){
    const table = document.getElementById("table");
    table.innerHTML="";

    data.forEach(d=>{
        table.innerHTML += `
        <tr>
            <td>${d.id}</td>
            <td>${d.amount}</td>
            <td>${d.type}</td>
            <td>${d.category}</td>
            <td>${d.date}</td>
            <td><button onclick="deleteRec(${d.id})">Delete</button></td>
        </tr>`;
    });
}

async function deleteRec(id){
    await fetch(`/records/delete/${id}`, {method:'DELETE'});
    filterRecords();
}