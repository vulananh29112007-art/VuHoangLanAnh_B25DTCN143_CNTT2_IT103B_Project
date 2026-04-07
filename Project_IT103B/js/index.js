// XỬ LÝ DROPDOWN ĐĂNG NHẬP / ĐĂNG KÝ
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
const btn = document.getElementById("authButtons");

if (currentUser) {
    // Hiển thị Avatar và Menu khi đã đăng nhập
    btn.innerHTML = `
    <div class="user-profile"> 
        <img src="https://i.pravatar.cc/40?u=${currentUser.email}" alt="User Avatar" id="avatar">
        <div class="dropdown" id="dropdownMenu">
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
    </div>`;
} else {
    // Hiển thị nút Sign In/Sign Up khi chưa đăng nhập
    btn.innerHTML = `
    <a href="../pages/register.html"><button id="signupBtn">Sign Up</button></a>
    <a href="../pages/login.html"><button id="signinBtn">Sign In</button></a>`;
}

// LOGIC ĐÓNG MỞ DROPDOWN VÀ ĐĂNG XUẤT
document.addEventListener("click", function (e) {
    const avatar = document.getElementById("avatar");
    const dropdown = document.getElementById("dropdownMenu");

    if (avatar && avatar.contains(e.target)) {
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    } else if (dropdown && !dropdown.contains(e.target)) {
        dropdown.style.display = "none";
    }

    if (e.target.classList.contains("logout")) {
        e.preventDefault();
        handleLogout();
    }
});

// HÀM XỬ LÝ ĐĂNG XUẤT
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
            }).then(() => window.location.replace("../pages/login.html"));
        }
    });
}

// LOGIC HIỂN THỊ BÀI VIẾT TRÊN TRANG CHỦ
function renderIndexPosts() {
    const articles = JSON.parse(localStorage.getItem("articles")) || [];
    const recentContainer = document.getElementById("recentPosts");
    const blogList = document.getElementById("blogList");
    const pagination = document.querySelector(".page-numbers");
    const searchInput = document.querySelector(".search-bar input");
    const allBtn = document.querySelector(".active-1");

    if (!articles.length) {
        if(recentContainer) recentContainer.innerHTML = "No posts";
        if(blogList) blogList.innerHTML = "No posts";
        return;
    }

    const sorted = [...articles].reverse();
    const top3 = sorted.slice(0, 3);

    // HIỂN THỊ 3 BÀI VIẾT MỚI NHẤT (RECENT POSTS)
    if (recentContainer && top3.length) {
        recentContainer.innerHTML = `
        <div class="recent-large">
            <div class="post-card large" onclick="viewDetail(${top3[0].id})">
                <img src="${top3[0].image}">
                <div class="post-info">
                    <span class="date">Date: ${top3[0].date}</span>
                    <h3>${top3[0].title}</h3>
                    <p>${top3[0].content}</p>
                    <span class="category-1">${top3[0].entries}</span>
                </div>
            </div>
        </div>
        <div class="recent-small">
            ${top3.slice(1).map(p => `
                <div class="post-card small" onclick="viewDetail(${p.id})">
                    <img src="${p.image}">
                    <div class="post-info">
                        <span class="date">Date: ${p.date}</span>
                        <h3>${p.title}</h3>
                        <p>${p.content}</p>
                        <span class="category-2">${p.entries}</span>
                    </div>
                </div>
            `).join("")}
        </div>`;
    }

    // CẤU HÌNH PHÂN TRANG VÀ BỘ LỌC
    const perPage = 5;
    let currentPage = 1;
    let filtered = [...sorted];
    let currentCategory = null;

    // HIỂN THỊ DANH MỤC (CATEGORY FILTER)
    const categoryFilter = document.getElementById("categoryFilter");
    const categoryData = JSON.parse(localStorage.getItem("entries")) || [];

    function renderCategoryFilter() {
        if (!categoryFilter) return;
        categoryFilter.innerHTML = categoryData.map(e => `<a href="#" class="cat-item">${e.name}</a>`).join("");
        
        categoryFilter.querySelectorAll(".cat-item").forEach(btn => {
            btn.onclick = e => {
                e.preventDefault();
                const cat = btn.textContent.trim();
                filtered = (currentCategory === cat) ? [...sorted] : sorted.filter(a => a.entries === cat);
                currentCategory = (currentCategory === cat) ? null : cat;
                updateView();
            };
        });
    }

    // HÀM RENDER DANH SÁCH BÀI VIẾT CHÍNH
    function renderPosts() {
        const start = (currentPage - 1) * perPage;
        const pageData = filtered.slice(start, start + perPage);

        blogList.innerHTML = pageData.length
            ? pageData.map(p => `
                <div class="blog-card" onclick="viewDetail(${p.id})">
                    <img src="${p.image}">
                    <div class="blog-content">
                        <p>Date: ${p.date}</p>
                        <h3>${p.title}</h3>
                        <p>${p.content}</p>
                        <button class="name-blog-1">${p.entries}</button>
                    </div>
                </div>
            `).join("")
            : "<p>Không có bài viết nào phù hợp.</p>";
    }

    // HÀM RENDER SỐ TRANG
    function renderPagination() {
        const totalPages = Math.ceil(filtered.length / perPage);
        pagination.innerHTML = Array.from({ length: totalPages }, (_, i) => `
            <span class="${i + 1 === currentPage ? "active" : ""}" data-page="${i + 1}">${i + 1}</span>
        `).join("");

        // Sự kiện click số trang
        pagination.querySelectorAll("span").forEach(btn => {
            btn.onclick = () => {
                currentPage = +btn.dataset.page;
                renderPosts();
                renderPagination();
            };
        });
    }

    // CẬP NHẬT GIAO DIỆN KHI CÓ THAY ĐỔI (SEARCH/FILTER)
    function updateView() {
        currentPage = 1;
        renderPosts();
        renderPagination();
    }

    // XỬ LÝ TÌM KIẾM
    if(searchInput) {
        searchInput.oninput = () => {
            const key = searchInput.value.toLowerCase();
            filtered = sorted.filter(a => a.title.toLowerCase().includes(key));
            updateView();
        };
    }

    // NÚT HIỂN THỊ TẤT CẢ (ALL POSTS)
    if(allBtn) {
        allBtn.onclick = e => {
            e.preventDefault();
            filtered = [...sorted];
            currentCategory = null;
            updateView();
        };
    }

    // KHỞI TẠO BAN ĐẦU
    renderCategoryFilter();
    renderPosts();
    renderPagination();
}

// XEM CHI TIẾT BÀI VIẾT
function viewDetail(id) {
    const articles = JSON.parse(localStorage.getItem("articles")) || [];
    const article = articles.find(a => a.id == id);

    if (article) {
        localStorage.setItem("selectedArticle", JSON.stringify(article));
        window.location.href = "../pages/detail_blog.html";
    }
}

// CHẠY HÀM CHÍNH KHI TRANG LOAD
renderIndexPosts();