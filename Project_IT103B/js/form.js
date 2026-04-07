// ================== ELEMENT ==================
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

const form = document.getElementById("articleForm");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const moodSelect = document.getElementById("mood");
const contentInput = document.getElementById("content");
const statusRadios = document.getElementsByName("status");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const closeBtn = document.getElementById("closeBtn");
const submitBtn = document.getElementById("addBtn");
const titleForm = document.getElementById("title-form");

// Danh sách ảnh
const imageList = [
    "../assets/images_post/index1.jpg",
    "../assets/images_post/index2.jpg",
    "../assets/images_post/index3.jpg",
    "../assets/images_post/index4.jpg",
    "../assets/images_post/index5.jpg",
    "../assets/images_post/index6.jpg",
    "../assets/images_post/index7.jpg",
    "../assets/images_post/index8.jpg",
    "../assets/images_post/index9.jpg",
    "../assets/images_post/index10.jpg"
];

// ================== LOAD DATA ==================
let articles = JSON.parse(localStorage.getItem("articles")) || [];
let entries = JSON.parse(localStorage.getItem("entries")) || [];

// ================== FIX LỖI EDIT CŨ ==================
let editId = localStorage.getItem("editArticleId");

// 🔥 nếu id tồn tại nhưng KHÔNG có bài → reset về add
if (editId) {
    const exist = articles.find(a => a.id == editId);
    if (!exist) {
        localStorage.removeItem("editArticleId");
        editId = null;
    }
}

// ================== RENDER CATEGORY ==================
function renderCategories() {
    categoryInput.innerHTML = "";

    if (!entries.length) {
        categoryInput.innerHTML = `<option value="">No category</option>`;
        return;
    }

    entries.forEach(e => {
        categoryInput.innerHTML += `<option value="${e.name}">${e.name}</option>`;
    });
}
renderCategories();

// ================== CHECK EDIT ==================
if (editId) {
    const article = articles.find(a => a.id == editId);

    if (article) {
        titleForm.textContent = "📝 Update Article";

        titleInput.value = article.title;
        categoryInput.value = article.entries;
        moodSelect.value = article.mood;
        contentInput.value = article.content;

        submitBtn.textContent = "Update";

        [...statusRadios].forEach(r => {
            if (
                (article.status === "Public" && r.value === "public") ||
                (article.status === "Private" && r.value === "private")
            ) {
                r.checked = true;
            }
        });

        imagePreview.src = article.image;
        titleInput.focus();
    }
} else {
    submitBtn.textContent = "Add";
}

// ramdom ảnh
function getRandomImage() {
    return imageList[Math.floor(Math.random() * imageList.length)];
}
imagePreview.src = getRandomImage();

// ================== SUBMIT ==================
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    const category = categoryInput.value.trim();
    const mood = moodSelect.value;
    const content = contentInput.value.trim();
    const status = [...statusRadios].find(r => r.checked)?.value || "public";

    const image = getRandomImage();

    if (!title || !category || !content || category === "") {
        Swal.fire({
            icon: "error",
            title: "Thiếu thông tin",
            text: "Vui lòng nhập đầy đủ!"
        });
        return;
    }

    submitBtn.disabled = true; // chống spam click

    // ADD
    const newArticle = {
        id: Date.now(),
        userId: currentUser?.id || null,
        title,
        entries: category,
        content,
        mood,
        status: status === "public" ? "Public" : "Private",
        image,
        date: new Date().toISOString().split("T")[0]
    };

    articles.push(newArticle);
    localStorage.setItem("articles", JSON.stringify(articles));

    Swal.fire({
        icon: "success",
        title: "Thêm bài viết thành công"
    }).then(goBack);
});

// ================== GO BACK ==================
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "../index.html";
    }
}

// ================== CLOSE ==================
closeBtn.addEventListener("click", goBack);
