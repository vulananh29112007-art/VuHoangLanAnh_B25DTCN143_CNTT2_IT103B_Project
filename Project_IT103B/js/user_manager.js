// KIỂM TRA QUYỀN ĐĂNG NHẬP (CHỈ ADMIN MỚI ĐƯỢC VÀO)
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "admin") {
    window.location.replace("../pages/login.html");
}

// CHẶN QUAY LẠI TRANG TRƯỚC SAU KHI ĐĂNG XUẤT
window.history.pushState(null, "", window.location.href);
window.onpopstate = function () {
    window.location.replace("../pages/login.html");
};

// TRUY VẤN CÁC PHẦN TỬ DOM
const userList = document.getElementById("tableBody");
const topRight = document.getElementById("topRight");
const searchInput = document.getElementById("searchInput");
const userCount = document.getElementById("userCount");

// CÁC PHẦN TỬ PHÂN TRANG
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const paginationContainer = document.getElementById("paginationContainer");
const paginationNumbers = document.getElementById("paginationNumbers");

// QUẢN LÝ TRẠNG THÁI HIỂN THỊ
let currentPage = 1;
const perPage = 5;
let keyword = "";
let isAsc = true;

// HIỂN THỊ THÔNG TIN VÀ MENU AVATAR ADMIN
function renderAdminAvatar() {
    if (!currentUser) return;

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

    avatar.onclick = (e) => {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    };

    document.onclick = (e) => {
        if (!dropdown.contains(e.target)) dropdown.style.display = "none";
    };

    document.querySelector(".logout").onclick = (e) => {
        e.preventDefault();
        handleGlobalLogout();
    };
}

// XỬ LÝ LỌC, TÌM KIẾM VÀ SẮP XẾP DỮ LIỆU
function getProcessedUsers() {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Loại bỏ tài khoản admin khỏi danh sách quản lý
    users = users.filter(u => u.role !== "admin");

    // Xử lý tìm kiếm theo tên hoặc email
    if (keyword) {
        users = users.filter(u =>
            (u.firstname + " " + u.lastname).toLowerCase().includes(keyword) ||
            u.email.toLowerCase().includes(keyword)
        );
    }

    // Xử lý sắp xếp theo tên
    users.sort((a, b) => {
        let nameA = (a.firstname + a.lastname).toLowerCase();
        let nameB = (b.firstname + b.lastname).toLowerCase();
        return isAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    return users;
}

// HIỂN THỊ DANH SÁCH NGƯỜI DÙNG VÀ THANH PHÂN TRANG
function renderUsers() {
    const users = getProcessedUsers();

    userCount.textContent = `${users.length} users`;
    userList.innerHTML = "";

    if (users.length === 0) {
        userList.innerHTML = `<tr><td colspan="4">No users found.</td></tr>`;
        paginationContainer.style.display = "none";
        return;
    }

    // Tính toán phân trang
    const totalPage = Math.ceil(users.length / perPage);
    if (currentPage > totalPage) currentPage = totalPage;
    
    const start = (currentPage - 1) * perPage;
    const pageUsers = users.slice(start, start + perPage);

    let html = "";
    pageUsers.forEach(u => {
        html += `
        <tr>
            <td>
                <div class="user">
                    <img src="https://i.pravatar.cc/35?u=${u.email}">
                    <div>
                        <p>${u.firstname} ${u.lastname}</p>
                        <span>${u.email}</span>
                    </div>
                </div>
            </td>
            <td>hoạt động</td>
            <td>${u.email}</td>
            <td>
                <button class="block">block</button>
                <button class="unblock">unblock</button>
            </td>
        </tr>
        `;
    });

    userList.innerHTML = html;

    // Hiển thị hoặc ẩn thanh phân trang
    if (totalPage <= 1) {
        paginationContainer.style.display = "none";
        return;
    }
    
    paginationContainer.style.display = "flex";
    paginationNumbers.innerHTML = "";

    for (let i = 1; i <= totalPage; i++) {
        const span = document.createElement("span");
        span.textContent = i;
        span.className = i === currentPage ? "active" : "";
        span.onclick = () => {
            currentPage = i;
            renderUsers();
        };
        paginationNumbers.appendChild(span);
    }
}

// XỬ LÝ SỰ KIỆN TÌM KIẾM
searchInput.addEventListener("input", (e) => {
    keyword = e.target.value.toLowerCase();
    currentPage = 1;
    renderUsers();
});

// XỬ LÝ SỰ KIỆN SẮP XẾP
document.getElementById("colName").addEventListener("click", () => {
    isAsc = !isAsc;
    renderUsers();
});

// ĐIỀU KHIỂN NÚT TRANG TRƯỚC
prevBtn.onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        renderUsers();
    }
};

// ĐIỀU KHIỂN NÚT TRANG SAU
nextBtn.onclick = () => {
    const total = getProcessedUsers().length;
    const totalPage = Math.ceil(total / perPage);
    if (currentPage < totalPage) {
        currentPage++;
        renderUsers();
    }
};

// HÀM ĐĂNG XUẤT DÙNG CHUNG
function handleGlobalLogout() {
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
document.getElementById("btnLogout").addEventListener("click", (e) => {
    e.preventDefault();
    handleGlobalLogout();
});

// KHỞI CHẠY CÁC HÀM BAN ĐẦU
renderAdminAvatar();
renderUsers();

// ĐỒNG BỘ DỮ LIỆU KHI THAY ĐỔI Ở TAB KHÁC
window.addEventListener("storage", renderUsers);