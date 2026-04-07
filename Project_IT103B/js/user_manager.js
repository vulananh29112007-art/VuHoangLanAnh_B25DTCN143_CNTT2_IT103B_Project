// ================== CHECK LOGIN ==================
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// 👉 nếu chưa login hoặc không phải admin → đá về login
if (!currentUser || currentUser.role !== "admin") {
    window.location.replace("../pages/login.html");
}

// 👉 CHẶN BACK sau khi logout
window.history.pushState(null, "", window.location.href);
window.onpopstate = function () {
    window.location.replace("../pages/login.html");
};

// ================== ELEMENT ==================
const userList = document.getElementById("tableBody");
const topRight = document.getElementById("topRight");
const searchInput = document.getElementById("searchInput");
const userCount = document.getElementById("userCount");

// ================== STATE ==================
let currentPage = 1;
const perPage = 5;
let keyword = "";
let isAsc = true;

// ================== AVATAR ADMIN ==================
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
        dropdown.style.display =
            dropdown.style.display === "block" ? "none" : "block";
    };

    document.onclick = (e) => {
        if (!dropdown.contains(e.target)) dropdown.style.display = "none";
    };

    // ================== LOGOUT ==================
    document.querySelector(".logout").onclick = (e) => {
        e.preventDefault();

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
                    // replace → không quay lại được
                    window.location.replace("../pages/login.html");
                });
            }
        });
    };
}

// ================== XỬ LÝ DATA ==================
function getProcessedUsers() {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    //  loại admin khỏi danh sách
    users = users.filter(u => u.role !== "admin");

    // SEARCH
    if (keyword) {
        users = users.filter(u =>
            (u.firstname + " " + u.lastname)
                .toLowerCase()
                .includes(keyword) ||
            u.email.toLowerCase().includes(keyword)
        );
    }

    // SORT
    users.sort((a, b) => {
        let nameA = (a.firstname + a.lastname).toLowerCase();
        let nameB = (b.firstname + b.lastname).toLowerCase();
        return isAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    return users;
}

// ================== RENDER USERS ==================
function renderUsers() {
    const users = getProcessedUsers();

    // 👉 HIỂN THỊ SỐ USER (không tính admin)
    userCount.textContent = `${users.length} users`;

    userList.innerHTML = "";

    if (users.length === 0) {
        userList.innerHTML = `<tr><td colspan="4">No users found.</td></tr>`;
        return;
    }

    // PAGINATION
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
}

// ================== SEARCH ==================
searchInput.addEventListener("input", (e) => {
    keyword = e.target.value.toLowerCase();
    currentPage = 1;
    renderUsers();
});

// ================== SORT ==================
document.getElementById("colName").addEventListener("click", () => {
    isAsc = !isAsc;
    renderUsers();
});

// ================== PAGINATION ==================
document.getElementById("prevBtn").onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        renderUsers();
    }
};

document.getElementById("nextBtn").onclick = () => {
    const total = getProcessedUsers().length;
    const totalPage = Math.ceil(total / perPage);

    if (currentPage < totalPage) {
        currentPage++;
        renderUsers();
    }
};

// ================== LOGOUT SIDEBAR ==================
const btnLogout = document.getElementById("btnLogout");

btnLogout.addEventListener("click", (e) => {
    e.preventDefault(); // chặn chuyển trang ngay

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
});

// ================== INIT ==================
renderAdminAvatar();
renderUsers();

// ================== SYNC TAB ==================
window.addEventListener("storage", renderUsers);