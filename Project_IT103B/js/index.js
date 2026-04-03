let currentUser = JSON.parse(localStorage.getItem("currentUser"));
const btn = document.getElementById("authButtons");

if(currentUser){
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
        </div>`
}else{
    btn.innerHTML = `
    <a href="../pages/register.html">
                <button id="signupBtn">Sign Up</button>
            </a>
            <a href="../pages/login.html">
                <button id="signinBtn">Sign In</button>
    </a>
    `
}

document.addEventListener("click", function(e){
    const avatar = document.getElementById("avatar");
    const dropdown = document.getElementById("dropdownMenu");
    if(avatar && avatar.contains(e.target)){
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    } else {
        if(dropdown && !dropdown.contains(e.target)){
            dropdown.style.display = "none";
        }
    }
    if(e.target.classList.contains("logout")){
        localStorage.removeItem("currentUser");
        window.location.reload();
    }
});