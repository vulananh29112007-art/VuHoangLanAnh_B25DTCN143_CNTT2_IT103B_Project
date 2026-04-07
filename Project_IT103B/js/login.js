// LẤY CÁC PHẦN TỬ DOM CỦA FORM
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// HIỂN THỊ THÔNG BÁO LỖI VÀ ĐỔI MÀU VIỀN INPUT
function showError(input, message) {
    const error = input.parentElement.querySelector(".error");
    if (error) error.textContent = message;
    input.classList.add("error-input");
}

// XÓA THÔNG BÁO LỖI VÀ TRẢ LẠI TRẠNG THÁI INPUT
function clearError(input) {
    const error = input.parentElement.querySelector(".error");
    if (error) error.textContent = "";
    input.classList.remove("error-input");
}

// XÓA LỖI NGAY KHI NGƯỜI DÙNG BẮT ĐẦU NHẬP LIỆU
[emailInput, passwordInput].forEach(input => {
    input.addEventListener("input", () => clearError(input));
});

// KIỂM TRA DỮ LIỆU ĐẦU VÀO CƠ BẢN (VALIDATE)
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

// XỬ LÝ SỰ KIỆN ĐĂNG NHẬP KHI SUBMIT FORM
form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validate()) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Lấy danh sách người dùng từ LocalStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Tìm kiếm người dùng khớp với email và mật khẩu
    const user = users.find(
        u => u.email === email && u.password === password
    );

    // Nếu thông tin sai -> Hiển thị lỗi nhỏ màu đỏ
    if (!user) {
        showError(passwordInput, "Sai email hoặc mật khẩu");
        return;
    }

    // Nếu thông tin đúng -> Lưu phiên đăng nhập và điều hướng theo vai trò
    localStorage.setItem("currentUser", JSON.stringify(user));
    
    if (user.role === "admin") {
        window.location.href = "../pages/user_manager.html";
    } else {
        window.location.href = "../index.html";
    }
});