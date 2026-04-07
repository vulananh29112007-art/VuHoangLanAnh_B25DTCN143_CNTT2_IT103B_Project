// KIỂM TRA ĐĂNG NHẬP (CHỈ CHO PHÉP ADMIN)
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "admin") {
    window.location.replace("../pages/login.html");
}

// CHẶN QUAY LẠI TRANG TRƯỚC (BACK BUTTON)
window.history.pushState(null, "", location.href);
window.onpopstate = () => location.replace("../pages/login.html");

// TRUY VẤN CÁC PHẦN TỬ DOM
const tableBody = document.querySelector(".article-table tbody");
const addArticleBtn = document.getElementById("addArticleBtn");
const topRight = document.getElementById("topRight");
const pageNumbers = document.querySelector(".page-numbers");

// QUẢN LÝ TRẠNG THÁI PHÂN TRANG
let currentPage = 1;
const perPage = 3;

// LẤY DANH SÁCH BÀI VIẾT TỪ LOCALSTORAGE
const getArticles = () => JSON.parse(localStorage.getItem("articles")) || [];

// HIỂN THỊ THÔNG TIN VÀ AVATAR ADMIN
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

    // Xử lý bật/tắt menu dropdown
    avatar.onclick = (e) => {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    };

    document.onclick = (e) => {
        if (!dropdown.contains(e.target)) dropdown.style.display = "none";
    };

    // Xử lý đăng xuất từ avatar
    document.querySelector(".logout").onclick = (e) => {
        e.preventDefault();
        handleGlobalLogout();
    };
}

// HIỂN THỊ DANH SÁCH BÀI VIẾT VÀ PHÂN TRANG
function renderArticles() {
    const articles = getArticles();
    tableBody.innerHTML = "";

    if (!articles.length) {
        tableBody.innerHTML = `<tr><td colspan="7">No articles</td></tr>`;
        renderPagination(0);
        return;
    }

    const start = (currentPage - 1) * perPage;
    const data = articles.slice(start, start + perPage);

    data.forEach(a => {
        tableBody.innerHTML += `
        <tr>
            <td><img src="${a.image}" width="80"></td>
            <td>${a.title}</td>
            <td>${a.entries}</td>
            <td>${a.content}</td>
            <td>
                <span class="status-badge ${a.status === "Public" ? "public" : "private"}">
                    ${a.status}
                </span>
            </td>
            <td>
                <select onchange="changeStatus(${a.id}, this)">
                    <option ${a.status === "Public" ? "selected" : ""}>Public</option>
                    <option ${a.status === "Private" ? "selected" : ""}>Private</option>
                </select>
            </td>
            <td>
                <div style="display:flex">
                    <button style="background:#1ab854;color:white;border:none;padding:5px 10px;margin-right:5px;border-radius:3px; cursor:pointer"
                        onclick="editArticle(${a.id})">Sửa</button>
                    <button style="background:#e02c2c;color:white;border:none;padding:5px 10px;border-radius:3px; cursor:pointer"
                        onclick="deleteArticle(${a.id})">Xóa</button>
                </div>
            </td>
        </tr>
        `;
    });

    renderPagination(articles.length);
}

// TẠO THANH PHÂN TRANG
function renderPagination(total) {
    const totalPage = Math.ceil(total / perPage);
    pageNumbers.innerHTML = "";

    for (let i = 1; i <= totalPage; i++) {
        const btn = document.createElement("span");
        btn.textContent = i;
        btn.className = "page";
        if (i === currentPage) btn.style.fontWeight = "bold";

        btn.onclick = () => {
            currentPage = i;
            renderArticles();
        };
        pageNumbers.appendChild(btn);
    }
}

// THAY ĐỔI TRẠNG THÁI BÀI VIẾT (PUBLIC/PRIVATE)
function changeStatus(id, el) {
    const articles = getArticles();
    const a = articles.find(x => x.id === id);

    if (a) a.status = el.value;
    localStorage.setItem("articles", JSON.stringify(articles));

    const row = el.closest("tr");
    row.children[4].innerHTML = `
        <span class="status-badge ${el.value === "Public" ? "public" : "private"}">
            ${el.value}
        </span>
    `;
}

// XÓA BÀI VIẾT
function deleteArticle(id) {
    Swal.fire({
        title: "Bạn có chắc?",
        text: "Bài viết sẽ bị xóa vĩnh viễn!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy"
    }).then(result => {
        if (result.isConfirmed) {
            let articles = getArticles().filter(a => a.id !== id);
            localStorage.setItem("articles", JSON.stringify(articles));

            const totalPage = Math.ceil(articles.length / perPage);
            if (currentPage > totalPage) currentPage = totalPage || 1;

            Swal.fire({
                icon: "success",
                title: "Đã xóa!",
                timer: 1000,
                showConfirmButton: false
            });

            renderArticles();
        }
    });
}

// ĐIỀU HƯỚNG ĐẾN TRANG SỬA BÀI VIẾT
function editArticle(id) {
    localStorage.setItem("editArticleId", id);
    location.href = "../pages/form.html";
}

// ĐIỀU HƯỚNG TRANG TRƯỚC / SAU
document.querySelector(".page-btn:first-child").onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        renderArticles();
    }
};

document.querySelector(".page-btn:last-child").onclick = () => {
    const totalPage = Math.ceil(getArticles().length / perPage);
    if (currentPage < totalPage) {
        currentPage++;
        renderArticles();
    }
};

// THÊM MỚI BÀI VIẾT
addArticleBtn.onclick = () => {
    localStorage.removeItem("editArticleId");
    location.href = "../pages/form.html";
};

// HÀM ĐĂNG XUẤT CHUNG
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

// ĐĂNG XUẤT TỪ SIDEBAR
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
    btnLogout.addEventListener("click", (e) => {
        e.preventDefault();
        handleGlobalLogout();
    });
}

// KHỞI CHẠY LẦN ĐẦU
renderAdminAvatar();
renderArticles();