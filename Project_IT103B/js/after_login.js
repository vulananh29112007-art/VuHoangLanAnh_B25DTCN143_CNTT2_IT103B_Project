const currentUser = JSON.parse(localStorage.getItem("currentUser"));
let articles = JSON.parse(localStorage.getItem("articles")) || [];

const blogList = document.querySelector(".blog-list");
const pagination = document.querySelector(".page-numbers");

// ================== CONFIG ==================
const perPage = 3;
let currentPage = 1;

// ================== LỌC BÀI CỦA USER ==================
const userArticles = articles.filter(a => a.userId === currentUser?.id);

// ================== RENDER BÀI ==================
function renderPosts(page = 1) {
    blogList.innerHTML = "";

    const start = (page - 1) * perPage;
    const end = start + perPage;

    const pageData = userArticles.slice(start, end);

    if (pageData.length === 0) {
        blogList.innerHTML = "No posts";
        blogList.style.display = "flex";
        blogList.style.justifyContent = "center";
        blogList.style.alignItems = "center";
        blogList.style.height = "200px";
        blogList.style.fontSize = "20px";
        return;
    }

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
                    <button class="edit" onclick="editArticle(${p.id})">Edit</button>
                </div>
            </div>
        </div>
        `;
    });
}

// ================== RENDER PAGINATION ==================
function renderPagination() {
    const totalPages = Math.ceil(userArticles.length / perPage);

    // CHỈ render số thôi
    pagination.innerHTML = Array.from({ length: totalPages }, (_, i) => `
        <span class="${i + 1 === currentPage ? "active" : ""}" data-page="${i + 1}">
            ${i + 1}
        </span>
    `).join("");

    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    // PREV
    prevBtn.onclick = (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderPosts(currentPage);
            renderPagination();
        }
    };

    // NEXT
    nextBtn.onclick = (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            renderPosts(currentPage);
            renderPagination();
        }
    };

    // CLICK SỐ
    pagination.querySelectorAll("span").forEach(btn => {
        btn.onclick = () => {
            currentPage = +btn.dataset.page;
            renderPosts(currentPage);
            renderPagination();
        };
    });
}

// ================== EDIT ==================
function editArticle(id) {
    localStorage.setItem("editArticleId", id);
    window.location.href = "../pages/form.html";
}

// ================== DETAIL ==================
function viewDetail(id) {
    const articles = JSON.parse(localStorage.getItem("articles")) || [];
    const article = articles.find(a => a.id == id);

    if (article) {
        localStorage.setItem("selectedArticle", JSON.stringify(article));
        window.location.href = "../pages/detail_blog.html";
    }
}

// ================== INIT ==================
renderPosts(currentPage);
renderPagination();