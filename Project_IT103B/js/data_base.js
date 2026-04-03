// ================== INIT DATA ==================
const defaultUsers = [
    {
        id: 1,
        firstname: "Lê",
        lastname: "Minh Thu",
        email: "minhthu@gmail.com",
        password: "123456",
        role: "user"
    },
    {
        id: 2,
        firstname: "Vũ",
        lastname: "Hồng Vân",
        email: "hongvan@yahoo.com",
        password: "abc123",
        role: "user"
    },
    {
        id: 3,
        firstname: "Vũ Hoàng",
        lastname: "Lan Anh",
        email: "vulananh29112007@gmail.com",
        password: "291107",
        role: "admin"
    }
];

// nếu chưa có users thì set dữ liệu mẫu
if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(defaultUsers));
}

// luôn lấy dữ liệu mới nhất
let users = JSON.parse(localStorage.getItem("users")) || [];

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

    clearError(emailInput);
    clearError(passwordInput);

    if (!emailInput.value.trim()) {
        showError(emailInput, "Không được để trống");
        ok = false;
    }

    if (!passwordInput.value.trim()) {
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

    // luôn lấy lại dữ liệu mới nhất
    users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        showError(passwordInput, "Sai email hoặc mật khẩu");
        return;
    }

    // lưu user đang đăng nhập
    localStorage.setItem("currentUser", JSON.stringify(user));

    // phân quyền
    if (user.role === "admin") {
        window.location.href = "../pages/user_manager.html";
    } else {
        window.location.href = "../index.html";
    }
});