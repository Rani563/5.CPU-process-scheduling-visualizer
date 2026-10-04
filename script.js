// ==========================================
// CPU PROCESS SCHEDULING VISUALIZER
// ==========================================

let processes = [];


// ==========================================
// ADD PROCESS
// ==========================================

function addProcess() {

    const id =
        document.getElementById("processId")
        .value.trim();

    const arrival =
        Number(
            document.getElementById("arrivalTime").value
        );

    const burst =
        Number(
            document.getElementById("burstTime").value
        );

    const priority =
        Number(
            document.getElementById("priority").value
        );


    if (
        id === "" ||
        arrival < 0 ||
        burst <= 0 ||
        priority <= 0
    ) {

        alert("Please enter valid process details.");

        return;
    }


    // Check duplicate process ID

    if (
        processes.some(
            p => p.id.toLowerCase() === id.toLowerCase()
        )
    ) {

        alert("Process ID already exists.");

        return;
    }


    processes.push({
        id: id,
        arrival: arrival,
        burst: burst,
        priority: priority
    });


    displayProcesses();


    // Clear inputs

    document.getElementById("processId").value = "";
    document.getElementById("arrivalTime").value = "";
    document.getElementById("burstTime").value = "";
    document.getElementById("priority").value = "";
}


// ==========================================
// DISPLAY PROCESSES
// ==========================================

function displayProcesses() {

    const table =
        document.getElementById("processTable");

    table.innerHTML = "";


    processes.forEach(p => {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${p.id}</td>
            <td>${p.arrival}</td>
            <td>${p.burst}</td>
            <td>${p.priority}</td>
        `;

        table.appendChild(row);
    });
}


// ==========================================
// LOAD SAMPLE DATA
// ==========================================

function loadSample() {

    processes = [

        {
            id: "P1",
            arrival: 0,
            burst: 5,
            priority: 2
        },

        {
            id: "P2",
            arrival: 1,
            burst: 3,
            priority: 1
        },

        {
            id: "P3",
            arrival: 2,
            burst: 8,
            priority: 4
        },

        {
            id: "P4",
            arrival: 3,
            burst: 4,
            priority: 3
        }

    ];

    displayProcesses();
}


// ==========================================
// SHOW ROUND ROBIN QUANTUM
// ==========================================

document.getElementById("algorithm")
    .addEventListener("change", function () {

        const quantumBox =
            document.getElementById("quantumBox");

        if (this.value === "RR") {
            quantumBox.style.display = "block";
        }
        else {
            quantumBox.style.display = "none";
        }
    });


// ==========================================
// RUN SCHEDULING
// ==========================================

function runScheduling() {

    if (processes.length === 0) {

        alert("Add processes first.");

        return;
    }


    const algorithm =
        document.getElementById("algorithm").value;


    let result;


    if (algorithm === "FCFS") {

        result = fcfs();

    }
    else if (algorithm === "SJF") {

        result = sjf();

    }
    else if (algorithm === "PRIORITY") {

        result = priorityScheduling();

    }
    else if (algorithm === "RR") {

        result = roundRobin();
    }


    displayGantt(result.gantt);

    displayResults(result.results);
}


// ==========================================
// FCFS
// ==========================================

function fcfs() {

    const sorted =
        [...processes].sort(
            (a, b) => a.arrival - b.arrival
        );


    let currentTime = 0;

    let gantt = [];

    let results = [];


    sorted.forEach(p => {

        // CPU idle

        if (currentTime < p.arrival) {

            gantt.push({
                id: "Idle",
                start: currentTime,
                end: p.arrival
            });

            currentTime = p.arrival;
        }


        const start = currentTime;

        const completion =
            currentTime + p.burst;


        currentTime = completion;


        gantt.push({
            id: p.id,
            start: start,
            end: completion
        });


        const turnaround =
            completion - p.arrival;


        const waiting =
            turnaround - p.burst;


        results.push({

            id: p.id,

            completion: completion,

            turnaround: turnaround,

            waiting: waiting
        });
    });


    return {
        gantt: gantt,
        results: results
    };
}


// ==========================================
// SJF - NON PREEMPTIVE
// ==========================================

function sjf() {

    let remaining = [...processes];

    let currentTime = 0;

    let gantt = [];

    let results = [];


    while (remaining.length > 0) {

        const available =
            remaining.filter(
                p => p.arrival <= currentTime
            );


        // CPU idle

        if (available.length === 0) {

            const next =
                remaining.reduce(
                    (a, b) =>
                        a.arrival < b.arrival ? a : b
                );


            gantt.push({
                id: "Idle",
                start: currentTime,
                end: next.arrival
            });


            currentTime = next.arrival;

            continue;
        }


        // Select shortest burst

        available.sort(
            (a, b) => a.burst - b.burst
        );


        const selected = available[0];


        remaining =
            remaining.filter(
                p => p.id !== selected.id
            );


        const start = currentTime;

        const completion =
            currentTime + selected.burst;


        currentTime = completion;


        gantt.push({
            id: selected.id,
            start: start,
            end: completion
        });


        const turnaround =
            completion - selected.arrival;


        const waiting =
            turnaround - selected.burst;


        results.push({

            id: selected.id,

            completion: completion,

            turnaround: turnaround,

            waiting: waiting
        });
    }


    return {
        gantt: gantt,
        results: results
    };
}


// ==========================================
// PRIORITY SCHEDULING
// Lower number = Higher priority
// ==========================================

function priorityScheduling() {

    let remaining = [...processes];

    let currentTime = 0;

    let gantt = [];

    let results = [];


    while (remaining.length > 0) {

        const available =
            remaining.filter(
                p => p.arrival <= currentTime
            );


        if (available.length === 0) {

            const next =
                remaining.reduce(
                    (a, b) =>
                        a.arrival < b.arrival ? a : b
                );


            gantt.push({
                id: "Idle",
                start: currentTime,
                end: next.arrival
            });


            currentTime = next.arrival;

            continue;
        }


        // Highest priority
        // means smallest priority number

        available.sort(
            (a, b) => a.priority - b.priority
        );


        const selected = available[0];


        remaining =
            remaining.filter(
                p => p.id !== selected.id
            );


        const start = currentTime;

        const completion =
            currentTime + selected.burst;


        currentTime = completion;


        gantt.push({
            id: selected.id,
            start: start,
            end: completion
        });


        const turnaround =
            completion - selected.arrival;


        const waiting =
            turnaround - selected.burst;


        results.push({

            id: selected.id,

            completion: completion,

            turnaround: turnaround,

            waiting: waiting
        });
    }


    return {
        gantt: gantt,
        results: results
    };
}


// ==========================================
// ROUND ROBIN
// ==========================================

function roundRobin() {

    const quantum =
        Number(
            document.getElementById("quantum").value
        );


    if (quantum <= 0) {

        alert("Quantum must be greater than 0.");

        return {
            gantt: [],
            results: []
        };
    }


    const sorted =
        [...processes].sort(
            (a, b) => a.arrival - b.arrival
        );


    let remainingTime = {};

    let completionTime = {};

    let queue = [];

    let gantt = [];

    let currentTime = 0;

    let index = 0;


    sorted.forEach(p => {

        remainingTime[p.id] = p.burst;

    });


    while (
        index < sorted.length ||
        queue.length > 0
    ) {


        // Add arrived processes

        while (
            index < sorted.length &&
            sorted[index].arrival <= currentTime
        ) {

            queue.push(sorted[index]);

            index++;
        }


        // CPU idle

        if (queue.length === 0) {

            if (index < sorted.length) {

                gantt.push({

                    id: "Idle",

                    start: currentTime,

                    end: sorted[index].arrival

                });


                currentTime =
                    sorted[index].arrival;

                continue;
            }
        }


        const current =
            queue.shift();


        const start = currentTime;


        const execution =
            Math.min(
                quantum,
                remainingTime[current.id]
            );


        currentTime += execution;


        remainingTime[current.id] -= execution;


        gantt.push({

            id: current.id,

            start: start,

            end: currentTime

        });


        // Add newly arrived processes

        while (
            index < sorted.length &&
            sorted[index].arrival <= currentTime
        ) {

            queue.push(sorted[index]);

            index++;
        }


        // Process not finished

        if (remainingTime[current.id] > 0) {

            queue.push(current);

        }
        else {

            completionTime[current.id] =
                currentTime;
        }
    }


    let results = [];


    processes.forEach(p => {

        const completion =
            completionTime[p.id];


        const turnaround =
            completion - p.arrival;


        const waiting =
            turnaround - p.burst;


        results.push({

            id: p.id,

            completion: completion,

            turnaround: turnaround,

            waiting: waiting
        });
    });


    return {
        gantt: gantt,
        results: results
    };
}


// ==========================================
// DISPLAY GANTT CHART
// ==========================================

function displayGantt(gantt) {

    const chart =
        document.getElementById("ganttChart");

    chart.innerHTML = "";


    gantt.forEach(block => {

        const div =
            document.createElement("div");

        div.className = "gantt-block";


        div.style.minWidth =
            Math.max(
                70,
                (block.end - block.start) * 45
            ) + "px";


        div.innerHTML = `

            ${block.id}

            <span>
                ${block.start} → ${block.end}
            </span>

        `;


        chart.appendChild(div);
    });
}


// ==========================================
// DISPLAY RESULTS
// ==========================================

function displayResults(results) {

    const table =
        document.getElementById("resultTable");


    table.innerHTML = "";


    let totalWaiting = 0;

    let totalTurnaround = 0;


    results.forEach(result => {

        totalWaiting += result.waiting;

        totalTurnaround += result.turnaround;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${result.id}</td>

            <td>${result.completion}</td>

            <td>${result.turnaround}</td>

            <td>${result.waiting}</td>

        `;


        table.appendChild(row);
    });


    const averageWaiting =
        totalWaiting / results.length;


    const averageTurnaround =
        totalTurnaround / results.length;


    document.getElementById("averages").innerHTML = `

        Average Waiting Time:
        <b>${averageWaiting.toFixed(2)}</b>

        &nbsp;&nbsp; | &nbsp;&nbsp;

        Average Turnaround Time:
        <b>${averageTurnaround.toFixed(2)}</b>

    `;
}


// ==========================================
// CLEAR ALL
// ==========================================

function clearAll() {

    processes = [];

    displayProcesses();


    document.getElementById("ganttChart").innerHTML =
        "Run an algorithm to see the Gantt Chart.";

    document.getElementById("resultTable").innerHTML = "";

    document.getElementById("averages").innerHTML = "";
}