let currentUser = JSON.parse(localStorage.getItem("currentUser"));
const btn = document.getElementById("authButtons");

// ===== AUTH =====
if (currentUser) {
    btn.innerHTML = `
    <div class="user-profile"> 
        <img src="https://i.pravatar.cc/40" alt="User Avatar" id="avatar">
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
    btn.innerHTML = `
    <a href="../pages/register.html">
        <button id="signupBtn">Sign Up</button>
    </a>
    <a href="../pages/login.html">
        <button id="signinBtn">Sign In</button>
    </a>`;
}

// ===== DROPDOWN =====
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
    }
});

// ===== MAIN =====
function renderIndexPosts() {
    const articles = JSON.parse(localStorage.getItem("articles")) || [];

    const recentContainer = document.getElementById("recentPosts");
    const blogList = document.getElementById("blogList");

    recentContainer.innerHTML = "";
    blogList.innerHTML = "";

    if (!articles.length) {
        recentContainer.innerHTML = "No posts";
        blogList.innerHTML = "No posts";
        return;
    }

    const sorted = [...articles].reverse();

    // ===== TOP 3 =====
    const top3 = sorted.slice(0, 3);

    if (top3.length) {
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

    // ===== STATE =====
    let filtered = [...sorted];
    let currentPage = 1;
    const perPage = 6;
    let currentCategory = null;

    const pageNumbers = document.querySelector(".page-numbers");
    const searchInput = document.querySelector(".search-bar input");
    const allBtn = document.querySelector(".active-1");

    // ===== CATEGORY =====
    const categoryFilter = document.getElementById("categoryFilter");
    const categoryData = JSON.parse(localStorage.getItem("entries")) || [];

    function renderCategoryFilter() {
        if (!categoryFilter) return;
        categoryFilter.innerHTML = categoryData.map(e => `
            <a href="#">${e.name}</a>
        `).join("");
    }

    function bindCategoryEvents() {
        if (!categoryFilter) return;

        const categoryBtns = categoryFilter.querySelectorAll("a");

        categoryBtns.forEach(btn => {
            btn.onclick = e => {
                e.preventDefault();
                const cat = btn.textContent.trim();

                filtered = (currentCategory === cat)
                    ? [...sorted]
                    : sorted.filter(a => a.entries === cat);

                currentCategory = (currentCategory === cat) ? null : cat;
                currentPage = 1;
                render();
            };
        });
    }

    renderCategoryFilter();
    bindCategoryEvents();

    // ===== RENDER =====
    function render() {
        const start = (currentPage - 1) * perPage;
        const data = filtered.slice(start, start + perPage);

        blogList.innerHTML = data.length
            ? data.map(p => `
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
            : "Không có bài viết";

        // ===== PAGINATION =====
        const total = Math.ceil(filtered.length / perPage);

        pageNumbers.innerHTML = Array.from({ length: total }, (_, i) => `
            <span class="${i + 1 === currentPage ? "active" : ""}" data-page="${i + 1}">
                ${i + 1}
            </span>
        `).join("");
        if(currentPage === 1){
            const startPage  = document.getElementById("startPage");
            startPage.innerHTML = `<a style="display:none" id="startPage" href="#" class="prev">← Previous</a>`
        } else {
            const startPage  = document.getElementById("startPage");
            startPage.innerHTML = `<a id="startPage" href="#" class="prev">← Previous</a>`
        }

        const prevBtn = document.querySelector(".prev");
        const nextBtn = document.querySelector(".next");

        prevBtn.onclick = e => {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                render();
            }
        };

        nextBtn.onclick = e => {
            e.preventDefault();
            if (currentPage < total) {
                currentPage++;
                render();
            }
        };
    }

    // ===== PAGE CLICK =====
    pageNumbers.onclick = e => {
        if (e.target.dataset.page) {
            currentPage = +e.target.dataset.page;
            render();
        }
    };

    // ===== SEARCH =====
    searchInput.oninput = () => {
        const key = searchInput.value.toLowerCase();
        filtered = sorted.filter(a => a.title.toLowerCase().includes(key));
        currentPage = 1;
        render();
    };

    // ===== ALL POSTS =====
    allBtn.onclick = e => {
        e.preventDefault();
        filtered = [...sorted];
        currentCategory = null;
        currentPage = 1;
        render();
    };

    render();
}

// ===== DETAIL =====
function viewDetail(id) {
    const articles = JSON.parse(localStorage.getItem("articles")) || [];
    const article = articles.find(a => a.id == id);

    if (article) {
        localStorage.setItem("selectedArticle", JSON.stringify(article));
        window.location.href = "../pages/detail_blog.html";
    }
}

renderIndexPosts();
