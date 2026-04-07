// TRUY VẤN CÁC PHẦN TỬ DOM
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

// DANH SÁCH ĐƯỜNG DẪN ẢNH CÓ SẴN
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

// TẢI DỮ LIỆU TỪ LOCALSTORAGE
let articles = JSON.parse(localStorage.getItem("articles")) || [];
let entries = JSON.parse(localStorage.getItem("entries")) || [];

// KIỂM TRA TRẠNG THÁI CHỈNH SỬA (EDIT)
let editId = localStorage.getItem("editArticleId");

// Nếu ID chỉnh sửa không tồn tại trong danh sách bài viết thì reset về thêm mới
if (editId) {
    const exist = articles.find(a => a.id == editId);
    if (!exist) {
        localStorage.removeItem("editArticleId");
        editId = null;
    }
}

// HIỂN THỊ DANH SÁCH DANH MỤC VÀO SELECT OPTION
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

// ĐIỀN DỮ LIỆU VÀO FORM NẾU ĐANG Ở CHẾ ĐỘ CHỈNH SỬA
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
            const val = r.value.toLowerCase();
            const status = article.status.toLowerCase();
            if (val === status) r.checked = true;
        });

        imagePreview.src = article.image;
        titleInput.focus();
    }
} else {
    submitBtn.textContent = "Add";
    imagePreview.src = getRandomImage();
}

// LẤY NGẪU NHIÊN MỘT ẢNH TỪ DANH SÁCH
function getRandomImage() {
    return imageList[Math.floor(Math.random() * imageList.length)];
}

// XỬ LÝ LƯU DỮ LIỆU (THÊM MỚI HOẶC CẬP NHẬT)
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    const category = categoryInput.value.trim();
    const mood = moodSelect.value;
    const content = contentInput.value.trim();
    const status = [...statusRadios].find(r => r.checked)?.value || "public";
    const finalStatus = status.charAt(0).toUpperCase() + status.slice(1);

    // Kiểm tra dữ liệu đầu vào
    if (!title || !category || !content) {
        Swal.fire({ icon: "error", title: "Thiếu thông tin", text: "Vui lòng nhập đầy đủ!" });
        return;
    }

    submitBtn.disabled = true;

    if (editId) {
        // TRƯỜNG HỢP CẬP NHẬT (EDIT)
        const index = articles.findIndex(a => a.id == editId);
        if (index !== -1) {
            articles[index] = {
                ...articles[index],
                title,
                entries: category,
                content,
                mood,
                status: finalStatus
            };
            Swal.fire({ icon: "success", title: "Cập nhật thành công" }).then(goBack);
        }
    } else {
        // TRƯỜNG HỢP THÊM MỚI (ADD)
        const newArticle = {
            id: Date.now(),
            userId: currentUser?.id || null,
            title,
            entries: category,
            content,
            mood,
            status: finalStatus,
            image: imagePreview.src, // Giữ ảnh đã random lúc mở form
            date: new Date().toISOString().split("T")[0]
        };
        articles.push(newArticle);
        Swal.fire({ icon: "success", title: "Thêm bài viết thành công" }).then(goBack);
    }

    localStorage.setItem("articles", JSON.stringify(articles));
});

// QUAY LẠI TRANG TRƯỚC ĐÓ
function goBack() {
    localStorage.removeItem("editArticleId"); // Xóa ID edit khi đóng form
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "../index.html";
    }
}

// SỰ KIỆN NÚT ĐÓNG
closeBtn.addEventListener("click", goBack);