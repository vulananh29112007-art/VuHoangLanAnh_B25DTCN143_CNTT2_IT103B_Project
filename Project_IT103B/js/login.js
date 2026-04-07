// ================== LẤY ELEMENT ==================
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// ================== HIỂN THỊ LỖI ==================
function showError(input, message) {
    const error = input.parentElement.querySelector(".error");
    if (error) error.textContent = message;
    input.classList.add("error-input");
}

// ================== XÓA LỖI ==================
function clearError(input) {
    const error = input.parentElement.querySelector(".error");
    if (error) error.textContent = "";
    input.classList.remove("error-input");
}

// ================== GÕ LÀ MẤT LỖI ==================
[emailInput, passwordInput].forEach(input => {
    input.addEventListener("input", () => clearError(input));
});

// ================== VALIDATE ==================
function validate() {
    let ok = true;

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    clearError(emailInput);
    clearError(passwordInput);

    if (email === "") {
        showError(emailInput, "Không được để trống");
        ok = false;
    }

    if (password === "") {
        showError(passwordInput, "Không được để trống");
        ok = false;
    }

    return ok;
}

// ================== SUBMIT ==================
form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validate()) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
        u => u.email === email && u.password === password
    );

    //Sai → hiện chữ đỏ nhỏ
    if (!user) {
        showError(passwordInput, "Sai email hoặc mật khẩu");
        return;
    }

    // Đúng → SweetAlert
    localStorage.setItem("currentUser", JSON.stringify(user));
    if (user.role === "admin") {
            window.location.href = "../pages/user_manager.html";
        } else {
            window.location.href = "../index.html";
    }
    
});