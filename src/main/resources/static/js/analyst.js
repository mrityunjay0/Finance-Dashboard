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
        </tr>`;
    });
}