// ================== INIT DATA (CHỈ CHẠY 1 LẦN) ==================
if (!localStorage.getItem("users")) {
    const defaultUsers = [
        {
            id: 1,
            firstname: "Vũ Hoàng",
            lastname: "Lan Anh",
            email: "vulananh29112007@gmail.com",
            password: "291107",
            role: "admin"
        },
        {
            id: 2,
            firstname: "Lê",
            lastname: "Minh Thu",
            email: "minhthu@gmail.com",
            password: "123456",
            role: "user"
        },
        {
            id: 3,
            firstname: "Vũ",
            lastname: "Hồng Vân",
            email: "hongvan@yahoo.com",
            password: "abc123",
            role: "user"
        }
    ];

    localStorage.setItem("users", JSON.stringify(defaultUsers));
}

// ================== LẤY ELEMENT ==================
const form = document.getElementById("registerForm");

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");

const inputs = [firstNameInput, lastNameInput, emailInput, passwordInput, confirmInput];

// ================== LOCAL ==================
const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];
const saveUsers = (users) => localStorage.setItem("users", JSON.stringify(users));

// ================== ERROR ==================
const showError = (input, message) => {
    const error = input.parentElement.querySelector(".error");
    error.textContent = message;
};

const clearError = (input) => {
    const error = input.parentElement.querySelector(".error");
    error.textContent = "";
};

inputs.forEach(input => {
    input.addEventListener("input", () => clearError(input));
});

// ================== VALIDATE ==================
const validate = () => {
    let ok = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    inputs.forEach(clearError);

    if (!firstNameInput.value.trim()) {
        showError(firstNameInput, "Không được để trống");
        ok = false;
    }

    if (!lastNameInput.value.trim()) {
        showError(lastNameInput, "Không được để trống");
        ok = false;
    }

    if (!emailPattern.test(emailInput.value.trim())) {
        showError(emailInput, "Email không hợp lệ");
        ok = false;
    }

    if (passwordInput.value.trim().length < 6) {
        showError(passwordInput, "Mật khẩu >= 6 ký tự");
        ok = false;
    }

    if (confirmInput.value !== passwordInput.value) {
        showError(confirmInput, "Mật khẩu không khớp");
        ok = false;
    }

    return ok;
};

// ================== SUBMIT ==================
form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validate()) return;

    const users = getUsers();

    const email = emailInput.value.trim();

    // check trùng
    if (users.some(u => u.email === email)) {
        showError(emailInput, "Email đã tồn tại");
        return;
    }

    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        firstname: firstNameInput.value.trim(),
        lastname: lastNameInput.value.trim(),
        email,
        password: passwordInput.value.trim(),
        role: "user"
    };

    users.push(newUser);
    saveUsers(users);

    Swal.fire({
        icon: "success",
        title: "Đăng ký thành công!",
        text: "Chuyển sang trang đăng nhập",
        timer: 1200,
        showConfirmButton: false
    }).then(() => {
        window.location.href = "login.html";
    });

    form.reset();
});