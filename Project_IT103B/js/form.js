// ================== ELEMENTS ==================
const form = document.getElementById("articleForm");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const moodSelect = document.getElementById("mood");
const contentInput = document.getElementById("content");
const statusRadios = document.getElementsByName("status");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");

// ================== LOAD DATA ==================
let articles = JSON.parse(localStorage.getItem("articles")) || [];
let entries = JSON.parse(localStorage.getItem("entries")) || [];

// ================== CHECK EDIT MODE ==================
let editId = localStorage.getItem("editArticleId");

if (editId) {
    const article = articles.find(a => a.id == editId);

    if (article) {
        titleInput.value = article.title;
        categoryInput.value = article.entries;
        moodSelect.value = article.mood;
        contentInput.value = article.content;

        // set radio
        [...statusRadios].forEach(r => {
            if (
                (article.status === "Công khai" && r.value === "public") ||
                (article.status === "Riêng tư" && r.value === "private")
            ) {
                r.checked = true;
            }
        });

        imagePreview.src = article.image;

        // 👉 focus vào title
        titleInput.focus();
    }
}

// ================== PREVIEW IMAGE ==================
imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        imagePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

// ================== SUBMIT ==================
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    const category = categoryInput.value.trim();
    const mood = moodSelect.value;
    const content = contentInput.value.trim();
    const status = [...statusRadios].find(r => r.checked)?.value || "public";
    const image = imagePreview.src;

    // ================== VALIDATE ==================
    if (!title || !category || !content) {
        Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Vui lòng nhập đầy đủ thông tin!"
        });
        return;
    }

    // ================== ADD CATEGORY IF NOT EXISTS ==================
    if (!entries.some(e => e.name.toLowerCase() === category.toLowerCase())) {
        entries.push({ id: Date.now(), name: category });
        localStorage.setItem("entries", JSON.stringify(entries));
    }

    // ================== EDIT ==================
    if (editId) {
        const index = articles.findIndex(a => a.id == editId);

        articles[index] = {
            ...articles[index],
            title,
            entries: category,
            content,
            mood,
            status: status === "public" ? "Công khai" : "Riêng tư",
            image
        };

        localStorage.removeItem("editArticleId");

        Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Cập nhật bài viết thành công!"
        }).then(() => {
            window.location.href = "../pages/article_manager.html";
        });

        localStorage.setItem("articles", JSON.stringify(articles));
        return;
    }

    // ================== ADD NEW ==================
    const newArticle = {
        id: Date.now(),
        title,
        entries: category,
        content,
        mood,
        status: status === "public" ? "Công khai" : "Riêng tư",
        image,
        date: new Date().toISOString().split("T")[0]
    };

    articles.push(newArticle);
    localStorage.setItem("articles", JSON.stringify(articles));

    Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Thêm bài viết thành công!"
    }).then(() => {
        window.location.href = "../pages/article_manager.html";
    });
});