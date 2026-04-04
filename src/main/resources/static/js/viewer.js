async function loadSummary(){
    const res = await fetch('/dashboard/summary');
    const data = await res.json();

    document.getElementById("income").innerText = data.totalIncome;
    document.getElementById("expense").innerText = data.totalExpenses;
    document.getElementById("balance").innerText = data.netBalance;
}