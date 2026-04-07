// ================== DỮ LIỆU MẪU ==================
const defaultEntries = [
    { id: 1, name: "Daily Journal" },
    { id: 2, name: "Work & Career" },
    { id: 3, name: "Personal Thoughts" },
    { id: 4, name: "Emotions & Feelings" },
];

// ================== KHỞI TẠO LOCAL ==================
let entries = JSON.parse(localStorage.getItem("entries"));
if (!entries) {
    entries = defaultEntries;
    localStorage.setItem("entries", JSON.stringify(entries));
}

let articles = JSON.parse(localStorage.getItem("articles")) || [];

// ================== ELEMENT ==================
const input = document.getElementById("categoryInput");
const addBtn = document.getElementById("addBtn");
const tbody = document.getElementById("categoryBody");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const topRight = document.getElementById("topRight");

let editId = null; // dùng để biết đang sửa cái nào

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

    // mở / đóng dropdown
    avatar.onclick = (e) => {
        e.stopPropagation();
        dropdown.style.display =
            dropdown.style.display === "block" ? "none" : "block";
    };

    document.onclick = (e) => {
        if (!dropdown.contains(e.target)) dropdown.style.display = "none";
    };

    // logout
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
                    window.location.replace("../pages/login.html");
                });
            }
        });
    };
}

// ================== RENDER ==================
function renderEntries() {
    tbody.innerHTML = "";

    entries.forEach((item, index) => {
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



// ================== THÊM / SỬA ==================
addBtn.onclick = () => {
    let name = input.value.trim();

    if (!name) {
        Swal.fire("Lỗi", "Tên chủ đề không được để trống", "error");
        return;
    }

    // check trùng
    if (entries.some(e => e.name.toLowerCase() === name.toLowerCase() && e.id !== editId)) {
        Swal.fire("Lỗi", "Chủ đề đã tồn tại!", "error");
        return;
    }

    // ====== NẾU ĐANG SỬA ======
    if (editId) {
        let item = entries.find(e => e.id === editId);
        let oldName = item.name;

        item.name = name;

        // update bài viết
        articles.forEach(a => {
            if (a.entries === oldName) a.entries = name;
        });

        localStorage.setItem("articles", JSON.stringify(articles));

        Swal.fire("Thành công", "Cập nhật chủ đề thành công", "success");

        editId = null;
        addBtn.textContent = "Thêm";
    } 
    // ====== THÊM MỚI ======
    else {
        entries.push({ id: Date.now(), name });

        Swal.fire("Thành công", "Thêm chủ đề thành công", "success");
    }

    localStorage.setItem("entries", JSON.stringify(entries));

    input.value = "";
    renderEntries();
};

// ================== XÓA ==================
function deleteCategory(id) {
    let category = entries.find(e => e.id === id);

    // check còn bài viết
    let used = articles.some(a => a.entries === category.name);
    if (used) {
        Swal.fire("Không thể xóa", "Vẫn còn bài viết thuộc chủ đề này", "warning");
        return;
    }

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

// ================== SỬA ==================
function editCategory(id) {
    let item = entries.find(e => e.id === id);

    // đổ dữ liệu lên input
    input.value = item.name;
    input.focus();

    editId = id;

    addBtn.textContent = "Cập nhật";
}

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

// INIT
renderAdminAvatar();
renderEntries();