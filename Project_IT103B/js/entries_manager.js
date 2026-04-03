// ================== DỮ LIỆU MẪU ==================
const defaultEntries = [
    { id: 1, name: "Nhật ký học tập" },
    { id: 2, name: "Nhật ký mục tiêu và kế hoạch" },
    { id: 3, name: "Nhật ký trải nghiệm- học qua đời sống" }
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

let editId = null; // dùng để biết đang sửa cái nào

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

renderEntries();

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