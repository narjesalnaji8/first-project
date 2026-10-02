// ===============================
// API URL
// ===============================

const API_URL = "http://localhost:3000/api/expenses";


// Store all expenses
let allExpenses = [];


// Bootstrap modal
let editModal;


// ===============================
// GET Expenses
// ===============================

async function getExpenses() {

    try {

        showLoading(true);

        const response = await fetch(API_URL);


        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.message || "Failed to load expenses.");
        }


        const data = await response.json();

        return data;


    } catch (error) {

        showError(error.message);

        return [];


    } finally {

        showLoading(false);

    }

}


// ===============================
// Refresh
// ===============================

async function refresh() {

    allExpenses = await getExpenses();

    applyFilter();

    // Summary uses ALL expenses
    renderSummary(allExpenses);

}


// Helper Function for Badge Colors
function getCategoryBadgeClass(category) {
    switch (category) {
        case 'Food':
            return 'bg-success';          // أخضر
        case 'Transport':
            return 'bg-primary';          // أزرق
        case 'Bills':
            return 'bg-warning text-dark'; // أصفر
        case 'Entertainment':
            return 'bg-info text-dark';    // سماوي
        case 'Other':
            return 'bg-secondary';        // رمادي
        default:
            return 'bg-secondary';
    }
}

// ===============================
// Render Table
// ===============================

function renderTable(expenses) {

    const tableBody =
        document.getElementById("expensesTableBody");

    // Clear old rows
    tableBody.innerHTML = "";

    expenses.forEach(function (expense) {

        // Create row
        const row = document.createElement("tr");

        // Title

        const titleCell = document.createElement("td");
        titleCell.textContent = expense.title;
        row.appendChild(titleCell);

        // Amount

        const amountCell = document.createElement("td");
        amountCell.textContent =
            Number(expense.amount).toFixed(2);

        row.appendChild(amountCell);

        // Category

        const categoryCell = document.createElement("td");

        const categoryBadge =
            document.createElement("span");

        categoryBadge.className =
            `badge ${getCategoryBadgeClass(expense.category)}`;

        categoryBadge.textContent =
            expense.category;

        categoryCell.appendChild(categoryBadge);
        row.appendChild(categoryCell);

        // Date

        const dateCell = document.createElement("td");
        dateCell.textContent = expense.date;
        row.appendChild(dateCell);

        // Actions

        const actionsCell = document.createElement("td");


        // Edit Button
        const editButton =
            document.createElement("button");

        editButton.type = "button";
        editButton.className =
            "btn btn-sm btn-outline-success me-1";

        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            editExpense(expense.id);
        });


        // Delete Button
        const deleteButton =
            document.createElement("button");

        deleteButton.type = "button";
        deleteButton.className =
            "btn btn-sm btn-outline-danger";

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            deleteExpense(expense.id);
        });


        // Add buttons to Actions cell
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);


        // Add Actions cell to row
        row.appendChild(actionsCell);


        // Add row to table
        tableBody.appendChild(row);
    });

}
// ===============================
// Render Summary
// ===============================

function renderSummary(expenses) {

    const totalAmountElement =
        document.getElementById(
            "totalAmount"
        );


    const expenseCountElement =
        document.getElementById(
            "expenseCount"
        );


    const highestExpenseElement =
        document.getElementById(
            "highestExpense"
        );


    // Count
    const count =
        expenses.length;


    // Total
    const total =
        expenses.reduce(
            function (sum, expense) {

                return sum +
                    Number(expense.amount);

            },
            0
        );


    // Highest
    let highest = 0;


    expenses.forEach(function (expense) {

        const amount =
            Number(expense.amount);


        if (amount > highest) {

            highest = amount;

        }

    });


    // Display
    totalAmountElement.textContent =
        total.toFixed(2);


    expenseCountElement.textContent =
        count;


    highestExpenseElement.textContent =
        highest.toFixed(2);

}


// ===============================
// ADD Expense
// ===============================

async function addExpense(data) {

    try {

        showLoading(true);


        const response =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to add expense."
            );

        }


        hideError();
        showSuccess("Expense added successfully!");

        // Always get fresh data
        await refresh();
        return true;


    } catch (error) {

        showError(error.message);
        return false;

    } finally {

        showLoading(false);

    }

}


// ===============================
// DELETE Expense
// ===============================

async function deleteExpense(id) {
    const confirmed = confirm("Are you sure you want to delete this expense?");

    if (!confirmed) {
        return;
    }


    try {

        showLoading(true);


        const response =
            await fetch(
                API_URL + "/" + id,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to delete expense."
            );

        }


        hideError();
        showSuccess("Expense deleted successfully!");

        // Get updated data
        await refresh();


    } catch (error) {

        showError(error.message);


    } finally {

        showLoading(false);

    }

}


// ===============================
// ADD FORM Validation
// ===============================

document
    .getElementById("expenseForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        // العناصر
        const titleInput = document.getElementById("title");
        const amountInput = document.getElementById("amount");
        const categoryInput = document.getElementById("category");
        const dateInput = document.getElementById("date");

        // القيم
        const title = titleInput.value.trim();
        const amount = Number(amountInput.value);
        const category = categoryInput.value;
        const date = dateInput.value;

        // إعادة تنظيف أخطاء البوكسات السابقة
        titleInput.classList.remove("is-invalid");
        amountInput.classList.remove("is-invalid");
        categoryInput.classList.remove("is-invalid");
        dateInput.classList.remove("is-invalid");

        let hasError = false;

        // Validation لكل حقل
        if (title === "") {
            titleInput.classList.add("is-invalid");
            hasError = true;
        }

        if (isNaN(amount) || amount <= 0 || amountInput.value.trim() === "") {
            amountInput.classList.add("is-invalid");
            hasError = true;
        }

        if (category === "") {
            categoryInput.classList.add("is-invalid");
            hasError = true;
        }

        if (date === "") {
            dateInput.classList.add("is-invalid");
            hasError = true;
        }

        // إذا كان هناك أي خطأ في الإدخال لا نرسل للـ API
        if (hasError) {
            return;
        }

        // إخفاء الـ Alert العام إذا كان يظهر سابقاً
        hideError();

        // بناء البيانات والإرسال
        const expenseData = {
            title: title,
            amount: amount,
            category: category,
            date: date
        };

        const success = await addExpense(expenseData);

        if (success) {
            // تفريغ الحقول فقط إذا نجحت الإضافة
            this.reset();

            titleInput.classList.remove("is-invalid");
            amountInput.classList.remove("is-invalid");
            categoryInput.classList.remove("is-invalid");
            dateInput.classList.remove("is-invalid");
        }
    });


// ===============================
// FILTER
// ===============================

function applyFilter() {

    const filter =
        document
            .getElementById(
                "categoryFilter"
            )
            .value;


    if (filter === "All") {

        renderTable(
            allExpenses
        );

        return;

    }


    const filteredExpenses =
        allExpenses.filter(
            function (expense) {

                return (
                    expense.category ===
                    filter
                );

            }
        );


    renderTable(
        filteredExpenses
    );

}


// Filter event
document
    .getElementById(
        "categoryFilter"
    )
    .addEventListener(
        "change",
        applyFilter
    );


// ===============================
// EDIT Expense
// ===============================

function editExpense(id) {

    // Find the expense
    const expense =
        allExpenses.find(
            function (item) {

                return Number(item.id) === Number(id);

            }
        );


    // If not found
    if (!expense) {

        showError(
            "Expense not found."
        );

        return;

    }


    // Put data inside modal
    document.getElementById(
        "editId"
    ).value = expense.id;


    document.getElementById(
        "editTitle"
    ).value = expense.title;


    document.getElementById(
        "editAmount"
    ).value = expense.amount;


    document.getElementById(
        "editCategory"
    ).value = expense.category;


    document.getElementById(
        "editDate"
    ).value = expense.date ? expense.date.split('T')[0] : '';


    // Create Bootstrap modal
    editModal =
        new bootstrap.Modal(
            document.getElementById(
                "editExpenseModal"
            )
        );


    // Show modal
    editModal.show();

}


// ===============================
// UPDATE Expense
// ===============================

async function updateExpense(id, data) {

    try {

        showLoading(true);


        const response =
            await fetch(
                API_URL + "/" + id,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to update expense."
            );

        }


        hideError();
        showSuccess("Expense updated successfully!");

        // Get fresh data
        await refresh();
        return true;


    } catch (error) {

        showError(error.message);
        return false;

    } finally {

        showLoading(false);

    }

}


// ===============================
// Save Edit Button
// ===============================

document.getElementById("saveEditButton").addEventListener("click", async () => {

    const id = document.getElementById("editId").value;
    const title = document.getElementById("editTitle").value.trim();
    const amount = document.getElementById("editAmount").value;
    const category = document.getElementById("editCategory").value;
    const date = document.getElementById("editDate").value;

    // Remove previous validation
    document.getElementById("editTitle").classList.remove("is-invalid");
    document.getElementById("editAmount").classList.remove("is-invalid");
    document.getElementById("editCategory").classList.remove("is-invalid");
    document.getElementById("editDate").classList.remove("is-invalid");

    document.getElementById("editTitleError").textContent = "";
    document.getElementById("editAmountError").textContent = "";
    document.getElementById("editCategoryError").textContent = "";
    document.getElementById("editDateError").textContent = "";

    let hasError = false;

    // Title validation
    if (!title) {
        document.getElementById("editTitle").classList.add("is-invalid");
        document.getElementById("editTitleError").textContent = "Title is required.";
        hasError = true;
    }

    // Amount validation
    if (!amount || Number(amount) <= 0) {
        document.getElementById("editAmount").classList.add("is-invalid");
        document.getElementById("editAmountError").textContent =
            "Amount must be greater than 0.";
        hasError = true;
    }

    // Category validation
    if (!category) {
        document.getElementById("editCategory").classList.add("is-invalid");
        document.getElementById("editCategoryError").textContent =
            "Category is required.";
        hasError = true;
    }

    // Date validation
    if (!date) {
        document.getElementById("editDate").classList.add("is-invalid");
        document.getElementById("editDateError").textContent =
            "Date is required.";
        hasError = true;
    }

    // Stop if there are validation errors
    if (hasError) {
        return;
    }

    const updatedData = {
        title,
        amount: Number(amount),
        category,
        date
    };

    const success = await updateExpense(id, updatedData);

    if (success) {
        editModal.hide();
    }
});
// ===============================
// Loading Spinner
// ===============================

function showLoading(show) {

    const loading =
        document.getElementById(
            "loading"
        );


    if (show) {

        loading.style.display =
            "block";

    } else {

        loading.style.display =
            "none";

    }

}


// ===============================
// Show Error
// ===============================

function showError(message) {

    const errorElement =
        document.getElementById(
            "error"
        );


    if (message === "Failed to fetch") {

        message =
            "Cannot connect to the server. Please make sure the backend is running.";

    }


    errorElement.textContent =
        message;


    errorElement.style.display =
        "block";

}


// ===============================
// Hide Error
// ===============================

function hideError() {

    const errorElement =
        document.getElementById(
            "error"
        );


    errorElement.textContent =
        "";


    errorElement.style.display =
        "none";

}
// ===============================
// Show Success Message
// ===============================

function showSuccess(message) {

    const successElement =
        document.getElementById(
            "successMessage"
        );

    successElement.textContent =
        message;

    successElement.classList.remove(
        "d-none"
    );

    setTimeout(function () {

        successElement.classList.add(
            "d-none"
        );

    }, 3000);

}

// ===============================
// Dark Mode
// ===============================

const darkModeToggle = document.getElementById("darkModeToggle");

darkModeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        darkModeToggle.textContent = "☀️ Light Mode";
    } else {
        darkModeToggle.textContent = "🌙 Dark Mode";
    }

});

// ===============================
// Start Application
// ===============================

refresh();

