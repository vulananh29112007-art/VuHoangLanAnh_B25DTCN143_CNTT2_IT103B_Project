// KHỞI TẠO DỮ LIỆU NGƯỜI DÙNG MẪU (CHỈ CHẠY 1 LẦN ĐẦU)
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

// LẤY CÁC PHẦN TỬ DOM CỦA FORM
const form = document.getElementById("registerForm");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");

// DANH SÁCH CÁC INPUT ĐỂ DUYỆT NHANH
const inputs = [firstNameInput, lastNameInput, emailInput, passwordInput, confirmInput];

// CÁC HÀM TƯƠNG TÁC VỚI LOCALSTORAGE
const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];
const saveUsers = (users) => localStorage.setItem("users", JSON.stringify(users));

// HIỂN THỊ THÔNG BÁO LỖI DƯỚI INPUT
const showError = (input, message) => {
    const error = input.parentElement.querySelector(".error");
    error.textContent = message;
};

// XÓA THÔNG BÁO LỖI
const clearError = (input) => {
    const error = input.parentElement.querySelector(".error");
    error.textContent = "";
};

// XÓA LỖI NGAY KHI NGƯỜI DÙNG ĐANG NHẬP
inputs.forEach(input => {
    input.addEventListener("input", () => clearError(input));
});

// KIỂM TRA TÍNH HỢP LỆ CỦA DỮ LIỆU (VALIDATE)
const validate = () => {
    let ok = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Xóa hết lỗi cũ trước khi kiểm tra mới
    inputs.forEach(clearError);

    // Kiểm tra họ và tên
    if (!firstNameInput.value.trim()) {
        showError(firstNameInput, "Không được để trống");
        ok = false;
    }
    if (!lastNameInput.value.trim()) {
        showError(lastNameInput, "Không được để trống");
        ok = false;
    }

    // Kiểm tra định dạng email
    if (!emailPattern.test(emailInput.value.trim())) {
        showError(emailInput, "Email không hợp lệ");
        ok = false;
    }

    // Kiểm tra độ dài mật khẩu
    if (passwordInput.value.trim().length < 6) {
        showError(passwordInput, "Mật khẩu >= 6 ký tự");
        ok = false;
    }

    // Kiểm tra xác nhận mật khẩu
    if (confirmInput.value !== passwordInput.value) {
        showError(confirmInput, "Mật khẩu không khớp");
        ok = false;
    }

    return ok;
};

// XỬ LÝ SỰ KIỆN GỬI FORM ĐĂNG KÝ
form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Nếu validate không qua thì dừng lại
    if (!validate()) return;

    const users = getUsers();
    const email = emailInput.value.trim();

    // Kiểm tra email đã tồn tại trong hệ thống chưa
    if (users.some(u => u.email === email)) {
        showError(emailInput, "Email đã tồn tại");
        return;
    }

    // Tạo đối tượng người dùng mới
    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        firstname: firstNameInput.value.trim(),
        lastname: lastNameInput.value.trim(),
        email,
        password: passwordInput.value.trim(),
        role: "user"
    };

    // Lưu vào mảng và cập nhật LocalStorage
    users.push(newUser);
    saveUsers(users);

    // Thông báo thành công và chuyển hướng
    Swal.fire({
        icon: "success",
        title: "Đăng ký thành công!",
        text: "Chuyển sang trang đăng nhập",
        timer: 1200,
        showConfirmButton: false
    }).then(() => {
        window.location.href = "login.html";
    });

    // Reset lại form về trạng thái trống
    form.reset();
});