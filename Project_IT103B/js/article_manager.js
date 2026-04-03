// ================== DỮ LIỆU MẪU ==================
const defaultArticles = [
    {
        id: 1,
        title: "Deadline đầu tiên của kỳ học",
        entries: "Nhật ký học tập",
        content: "Hôm nay mình vừa nộp xong bài tập lớn. Mệt nhưng thấy nhẹ nhõm!",
        mood: "Căng thẳng",
        status: "Riêng tư",
        image: "https://picsum.photos/200/150?random=1",
        date: "2025-02-23"
    },
    {
        id: 2,
        title: "Cà phê chiều chủ nhật",
        entries: "Nhật ký trải nghiệm- học qua đời sống",
        content: "Ngồi một mình trong quán quen...",
        mood: "Thư giãn",
        status: "Công khai",
        image: "https://picsum.photos/200/150?random=2",
        date: "2025-03-15"
    },
    {
        id: 3,
        title: "Lập kế hoạch tuần mới",
        entries: "Nhật ký mục tiêu và kế hoạch",
        content: "Viết ra những việc cần làm tuần này...",
        mood: "Căng thẳng",
        status: "Công khai",
        image: "https://picsum.photos/200/150?random=3",
        date: "2025-03-20"
    }
];

// ================== KHỞI TẠO LOCAL ==================
let articles = JSON.parse(localStorage.getItem("articles"));
if (!articles) {
    articles = defaultArticles;
    localStorage.setItem("articles", JSON.stringify(articles));
}

// ================== ELEMENT ==================
const tableBody = document.querySelector(".article-table tbody");
const addArticleBtn = document.getElementById("addArticleBtn");

// ================== RENDER ==================
function renderArticles() {
    tableBody.innerHTML = "";

    articles.forEach(a => {
        tableBody.innerHTML += `
        <tr>
            <td><img src="${a.image}" width="80"></td>
            <td>${a.title}</td>
            <td>${a.entries}</td>
            <td>${a.content}</td>
            <td>${a.status}</td>
            <td>
                <select onchange="changeStatus(${a.id}, this.value)">
                    <option ${a.status === "Công khai" ? "selected" : ""}>Công khai</option>
                    <option ${a.status === "Riêng tư" ? "selected" : ""}>Riêng tư</option>
                </select>
            </td>
            <td>
                <div style="display:flex">
                    <button style="background: #16a34a; cursor: pointer; padding: 5px 10px; margin-right: 5px; border: none; border-radius: 3px; color: white;" onclick="editArticle(${a.id})">Sửa</button>
                    <button style="background: #dc2626; cursor: pointer; padding: 5px 10px; margin-right: 5px; border: none; border-radius: 3px; color: white;" onclick="deleteArticle(${a.id})">Xóa</button>
                </div>
            </td>
        </tr>
        `;
    });
}

renderArticles();

// ================== XÓA ==================
function deleteArticle(id) {
    Swal.fire({
        title: "Bạn có chắc?",
        text: "Xóa bài viết này",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy"
    }).then((result) => {
        if (result.isConfirmed) {
            articles = articles.filter(a => a.id !== id);
            localStorage.setItem("articles", JSON.stringify(articles));

            Swal.fire("Đã xóa!", "", "success");

            renderArticles();
        }
    });
}

// ================== SỬA ==================
function editArticle(id) {
    // lưu id vào local để form biết là đang sửa
    localStorage.setItem("editArticleId", id);

    // chuyển sang form
    window.location.href = "../pages/form.html";
    
}

// ================== STATUS ==================
function changeStatus(id, newStatus) {
    let article = articles.find(a => a.id === id);
    article.status = newStatus;

    localStorage.setItem("articles", JSON.stringify(articles));
}

// ================== THÊM ==================
addArticleBtn.onclick = () => {
    localStorage.removeItem("editArticleId"); // đảm bảo là thêm mới
    window.location.href = "../pages/form.html";
};