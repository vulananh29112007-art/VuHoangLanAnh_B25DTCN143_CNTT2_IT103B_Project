// LẤY DỮ LIỆU TỪ LOCALSTORAGE
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
let articles = JSON.parse(localStorage.getItem("articles")) || [];

// TRUY VẤN CÁC PHẦN TỬ DOM
const blogList = document.querySelector(".blog-list");
const pagination = document.querySelector(".page-numbers");

// CẤU HÌNH PHÂN TRANG
const perPage = 5;
let currentPage = 1;

// LỌC DANH SÁCH BÀI VIẾT THEO USER ĐANG ĐĂNG NHẬP
const userArticles = articles.filter(a => a.userId === currentUser?.id);

// HIỂN THỊ DANH SÁCH BÀI VIẾT THEO TRANG
function renderPosts(page = 1) {
    blogList.innerHTML = "";

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pageData = userArticles.slice(start, end);

    // Xử lý trường hợp không có bài viết
    if (pageData.length === 0) {
        blogList.innerHTML = "No posts";
        blogList.style.display = "flex";
        blogList.style.justifyContent = "center";
        blogList.style.alignItems = "center";
        blogList.style.height = "200px";
        blogList.style.fontSize = "20px";
        return;
    }

    // Render từng thẻ bài viết
    pageData.forEach(p => {
        blogList.innerHTML += `
        <div class="blog-card" onclick="viewDetail(${p.id})">
            <img src="${p.image}">
            <div class="blog-content">
                <p>${p.entries}</p>
                <div class="date">
                    <h3>${p.title}</h3>
                    <span>${p.date}</span>
                </div>
                <p class="op">${p.content}</p>
                <div class="name-content">
                    <button class="name-blog-1">${p.entries}</button>
                    <button class="edit" onclick="event.stopPropagation(); editArticle(${p.id})">Edit</button>
                </div>
            </div>
        </div>
        `;
    });
}

// HIỂN THỊ VÀ XỬ LÝ THANH PHÂN TRANG
function renderPagination() {
    const totalPages = Math.ceil(userArticles.length / perPage);

    // Tạo các số trang
    pagination.innerHTML = Array.from({ length: totalPages }, (_, i) => `
        <span class="${i + 1 === currentPage ? "active" : ""}" data-page="${i + 1}">
            ${i + 1}
        </span>
    `).join("");

    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    // Xử lý nút quay lại (Prev)
    prevBtn.onclick = (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            updateUI();
        }
    };

    // Xử lý nút kế tiếp (Next)
    nextBtn.onclick = (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            updateUI();
        }
    };

    // Xử lý khi click trực tiếp vào số trang
    pagination.querySelectorAll("span").forEach(btn => {
        btn.onclick = () => {
            currentPage = +btn.dataset.page;
            updateUI();
        };
    });
}

// HÀM CẬP NHẬT GIAO DIỆN KHI CHUYỂN TRANG
function updateUI() {
    renderPosts(currentPage);
    renderPagination();
}

// CHUYỂN SANG TRANG CHỈNH SỬA BÀI VIẾT
function editArticle(id) {
    localStorage.setItem("editArticleId", id);
    window.location.href = "../pages/form.html";
}

// XEM CHI TIẾT BÀI VIẾT
function viewDetail(id) {
    const article = articles.find(a => a.id == id);
    if (article) {
        localStorage.setItem("selectedArticle", JSON.stringify(article));
        window.location.href = "../pages/detail_blog.html";
    }
}

// KHỞI CHẠY LẦN ĐẦU
renderPosts(currentPage);
renderPagination();