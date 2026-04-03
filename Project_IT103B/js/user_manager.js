const userList = document.getElementById("tableBody");

function renderUsers() {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    userList.innerHTML = "";

    if (users.length === 0) {
        userList.innerHTML = `<tr><td colspan="4">No users found.</td></tr>`;
        return;
    }

    let html = "";

    users.forEach((u) => {
        html += `
        <tr>
            <td>
                <div class="user">
                    <img src="https://i.pravatar.cc/35?u=${u.email}">
                    <div>
                        <p>${u.firstname} ${u.lastname}</p>
                        <span>${u.email}</span>
                    </div>
                </div>
            </td>
            <td>hoạt động</td>
            <td>${u.email}</td>
            <td>
                <button class="block">block</button>
                <button class="unblock">unblock</button>
            </td>
        </tr>`;
    });

    userList.innerHTML = html;
}

// chạy khi load trang
renderUsers();

// cập nhật khi có thay đổi localStorage (mở nhiều tab)
window.addEventListener("storage", renderUsers);