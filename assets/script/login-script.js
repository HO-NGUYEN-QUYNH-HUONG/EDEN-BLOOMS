// login-script.js

// Hàm xử lý sự kiện khi checkbox được nhấp
function handleTogglePassword() {
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    // Kiểm tra xem checkbox có được chọn hay không
    togglePassword.addEventListener("change", function () {
        const type = this.checked ? "text" : "password"; // Nếu checkbox được chọn, đổi loại thành 'text', ngược lại là 'password'
        passwordInput.setAttribute("type", type);
    });
}

// Hàm hiển thị thông báo lỗi
function showError(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = message;
    errorMessage.style.display = "block"; // Hiển thị thông báo lỗi
}

// Hàm xử lý sự kiện khi trang được tải
document.addEventListener("DOMContentLoaded", function () {
    handleTogglePassword();

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Ngăn chặn gửi form

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Giả lập kiểm tra thông tin đăng nhập
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.username === username);

        if (!user) {
            showError('Tài khoản này không tồn tại. Vui lòng đăng ký.');
        } else if (user.password !== password) {
            showError('Mật khẩu không đúng.');
        } else {
            // Đăng nhập thành công
            localStorage.setItem('username', username); //lưu tên tài khoản vào localStorage
            window.location.href = 'index.html'; // Chuyển hướng đến trang chính
            // window.location.href = "cart.html"; //chuyển hướng đến trang giỏ hàng
        }
    });
});

// Hàm cập nhật header sau khi đăng nhập
// function updateHeader(username) {
//     const usernameDisplay = document.getElementById("username-display");
//     const userMenu = document.getElementById("user-menu");
//     const loginMenu = document.getElementById("login-menu");

//     usernameDisplay.textContent = `Xin chào, ${username}`;
//     userMenu.style.display = 'block'; // Hiển thị menu người dùng
//     loginMenu.style.display = 'none'; // Ẩn menu đăng nhập
// }