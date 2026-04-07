// DỮ LIỆU MẪU BAN ĐẦU
const defaultEntries = [
    { id: 1, name: "Daily Journal" },
    { id: 2, name: "Work & Career" },
    { id: 3, name: "Personal Thoughts" },
    { id: 4, name: "Emotions & Feelings" },
];

// KHỞI TẠO DỮ LIỆU TỪ LOCALSTORAGE
let entries = JSON.parse(localStorage.getItem("entries"));
if (!entries) {
    entries = defaultEntries;
    localStorage.setItem("entries", JSON.stringify(entries));
}

let articles = JSON.parse(localStorage.getItem("articles")) || [];

// TRUY VẤN CÁC PHẦN TỬ DOM
const input = document.getElementById("categoryInput");
const addBtn = document.getElementById("addBtn");
const tbody = document.getElementById("categoryBody");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const topRight = document.getElementById("topRight");
const searchInput = document.getElementById("searchInput");

// BIẾN QUẢN LÝ TRẠNG THÁI TẠM THỜI
let editId = null; // Lưu ID của danh mục đang sửa
let keyword = "";  // Lưu từ khóa tìm kiếm

// QUẢN LÝ THÔNG TIN VÀ AVATAR ADMIN
function renderAdminAvatar() {
    if (!currentUser) return;

    // Hiển thị icon thông báo và thông tin user
    topRight.innerHTML = `
        <i class="fa-regular fa-envelope"></i>
        <i class="fa-regular fa-bell"></i>
        <div class="user-profile"> 
            <img src="https://i.pravatar.cc/40?u=${currentUser.email}" id="avatar">
            <div class="dropdown" id="dropdownMenu" style="display:none;">
                <div class="dropdown-content">
                    <div class="user-info">
                        <strong>${currentUser.firstname} ${currentUser.lastname}</strong><br>
                        <small>${currentUser.email}</small>
                    </div>
                    <a href="#">View profile</a>
                    <a href="#">Update profile picture</a>
                    <a href="#">Change password</a>
                    <a href="#" class="logout">Log out</a>
                </div>
            </div>
        </div>
    `;

    const avatar = document.getElementById("avatar");
    const dropdown = document.getElementById("dropdownMenu");

    // Bật tắt menu dropdown khi click avatar
    avatar.onclick = (e) => {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    };

    // Đóng dropdown khi click ra ngoài
    document.onclick = (e) => {
        if (!dropdown.contains(e.target)) dropdown.style.display = "none";
    };

    // Đăng xuất từ menu avatar
    document.querySelector(".logout").onclick = (e) => {
        e.preventDefault();
        handleLogout();
    };
}

// HIỂN THỊ DANH SÁCH DANH MỤC
function renderEntries() {
    tbody.innerHTML = "";

    // Lọc danh sách theo từ khóa tìm kiếm
    let filteredEntries = entries.filter(e =>
        e.name.toLowerCase().includes(keyword.toLowerCase())
    );

    if (filteredEntries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3">No categories found.</td></tr>`;
        return;
    }

    // Tạo hàng trong bảng cho mỗi danh mục
    filteredEntries.forEach((item, index) => {
        tbody.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>
                <button style="background: #16a34a; cursor: pointer; padding: 5px 10px; margin-right: 5px; border: none; border-radius: 3px; color: white;" onclick="editCategory(${item.id})">Sửa</button>
                <button style="background: #dc2626; cursor: pointer; padding: 5px 10px; margin-right: 5px; border: none; border-radius: 3px; color: white;" onclick="deleteCategory(${item.id})">Xóa</button>
            </td>
        </tr>`;
    });
}

// XỬ LÝ THÊM MỚI HOẶC CẬP NHẬT
addBtn.onclick = () => {
    let name = input.value.trim();

    // Kiểm tra tên trống
    if (!name) {
        Swal.fire("Lỗi", "Tên chủ đề không được để trống", "error");
        return;
    }

    // Kiểm tra trùng tên
    if (entries.some(e => e.name.toLowerCase() === name.toLowerCase() && e.id !== editId)) {
        Swal.fire("Lỗi", "Chủ đề đã tồn tại!", "error");
        return;
    }

    if (editId) {
        // Cập nhật danh mục đang sửa
        let item = entries.find(e => e.id === editId);
        let oldName = item.name;

        item.name = name;
        
        // Cập nhật tên danh mục trong các bài viết liên quan
        articles.forEach(a => {
            if (a.entries === oldName) a.entries = name;
        });

        localStorage.setItem("articles", JSON.stringify(articles));
        Swal.fire("Thành công", "Cập nhật chủ đề thành công", "success");
        editId = null;
        addBtn.textContent = "Thêm";
    } else {
        // Thêm danh mục mới
        entries.push({ id: Date.now(), name });
        Swal.fire("Thành công", "Thêm chủ đề thành công", "success");
    }

    // Lưu LocalStorage và cập nhật UI
    localStorage.setItem("entries", JSON.stringify(entries));
    input.value = "";
    renderEntries();
};

// XỬ LÝ XÓA DANH MỤC
function deleteCategory(id) {
    let category = entries.find(e => e.id === id);
    
    // Kiểm tra ràng buộc bài viết
    let used = articles.some(a => a.entries === category.name);
    if (used) {
        Swal.fire("Không thể xóa", "Vẫn còn bài viết thuộc chủ đề này", "warning");
        return;
    }

    // Hỏi xác nhận trước khi xóa
    Swal.fire({
        title: "Bạn có chắc?",
        text: `Xóa chủ đề "${category.name}"`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy"
    }).then((result) => {
        if (result.isConfirmed) {
            entries = entries.filter(e => e.id !== id);
            localStorage.setItem("entries", JSON.stringify(entries));
            Swal.fire("Đã xóa!", "Chủ đề đã được xóa", "success");
            renderEntries();
        }
    });
}

// ĐƯA DỮ LIỆU LÊN Ô INPUT ĐỂ SỬA
function editCategory(id) {
    let item = entries.find(e => e.id === id);
    input.value = item.name;
    input.focus();
    editId = id;
    addBtn.textContent = "Cập nhật";
}

// XỬ LÝ TÌM KIẾM
searchInput.addEventListener("input", (e) => {
    keyword = e.target.value.trim();
    renderEntries();
});

// HÀM XỬ LÝ ĐĂNG XUẤT CHUNG
function handleLogout() {
    Swal.fire({
        title: "Bạn có chắc chắn đăng xuất không?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "OK"
    }).then(res => {
        if (res.isConfirmed) {
            localStorage.removeItem("currentUser");
            Swal.fire({
                icon: "success",
                title: "Đã đăng xuất",
                timer: 1000,
                showConfirmButton: false
            }).then(() => {
                window.location.replace("../pages/login.html");
            });
        }
    });
}

// ĐĂNG XUẤT TỪ NÚT SIDEBAR
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
    btnLogout.addEventListener("click", (e) => {
        e.preventDefault();
        handleLogout();
    });
}

// CHẠY KHỞI TẠO
renderAdminAvatar();
renderEntries();