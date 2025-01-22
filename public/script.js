const apiUrl = '/api/data';

document.addEventListener("DOMContentLoaded", function() {
    loadJobs();
});

// Load and display jobs from the API
function loadJobs() {
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            const sortedData = data.sort((a, b) => {
                return new Date(a.deadline) - new Date(b.deadline); // Sort by deadline ascending
            });
            renderJobTable(sortedData);
        });
}

// Render jobs in a table
function renderJobTable(jobs) {
    const tableBody = document.querySelector('#job-table tbody');
    tableBody.innerHTML = ''; // Clear current table content

    jobs.forEach((job, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${job.job || ''}</td>
            <td>${job.role || ''}</td>
            <td>${job.batch || ''}</td>
            <td>${job.deadline || ''}</td>
            <td><a href="${job.apply_link}" target="_blank">${job.apply_link ? 'Apply Here' : ''}</a></td>
            <td>
                <button onclick="editJob(${index})">Edit</button>
                <button onclick="deleteJob(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Add a new job
function addJob() {
    const job = document.getElementById('job').value;
    const role = document.getElementById('role').value;
    const batch = document.getElementById('batch').value;
    const deadline = document.getElementById('deadline').value;
    const apply_link = document.getElementById('apply_link').value;

    // Validation is optional now (fields are no longer mandatory)
    const newJob = { job, role, batch, deadline, apply_link };

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob)
    }).then(() => {
        loadJobs(); // Reload job listings
        clearForm(); // Clear the form
    });
}

// Edit an existing job
function editJob(index) {
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            const job = data[index];
            document.getElementById('job').value = job.job || '';
            document.getElementById('role').value = job.role || '';
            document.getElementById('batch').value = job.batch || '';
            document.getElementById('deadline').value = job.deadline || '';
            document.getElementById('apply_link').value = job.apply_link || '';

            // Change the Add button to an Update button
            const addButton = document.querySelector('button');
            addButton.textContent = 'Update Job';
            addButton.setAttribute('onclick', `updateJob(${index})`);
        });
}

// Update a job after editing
function updateJob(index) {
    const job = document.getElementById('job').value;
    const role = document.getElementById('role').value;
    const batch = document.getElementById('batch').value;
    const deadline = document.getElementById('deadline').value;
    const apply_link = document.getElementById('apply_link').value;

    const updatedJob = { job, role, batch, deadline, apply_link };

    fetch(`${apiUrl}/${index}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedJob)
    }).then(() => {
        loadJobs(); // Reload job listings
        clearForm(); // Clear the form
    });
}

// Delete a job
function deleteJob(index) {
    if (confirm("Are you sure you want to delete this job listing?")) {
        fetch(`${apiUrl}/${index}`, { method: 'DELETE' })
            .then(() => loadJobs()); // Reload job listings after deletion
    }
}

// Clear form inputs
function clearForm() {
    document.getElementById('job').value = '';
    document.getElementById('role').value = '';
    document.getElementById('batch').value = '';
    document.getElementById('deadline').value = '';
    document.getElementById('apply_link').value = '';
    document.querySelector('button').textContent = 'Add Job';
    document.querySelector('button').setAttribute('onclick', 'addJob()');
}
