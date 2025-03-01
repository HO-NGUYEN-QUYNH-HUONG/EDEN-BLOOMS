// register-script.js

// Hàm xử lý sự kiện khi checkbox được nhấp
function handleTogglePassword() {
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    togglePassword.addEventListener("change", function () {
        const type = this.checked ? "text" : "password";
        passwordInput.setAttribute("type", type);
        confirmPasswordInput.setAttribute("type", type); // Cũng thay đổi loại cho trường xác thực mật khẩu
    });
}

// Hàm xử lý sự kiện khi trang được tải
document.addEventListener("DOMContentLoaded", function () {
    handleTogglePassword();

    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim(); // Loại bỏ khoảng trắng
        const email = document.getElementById("email").value.trim(); // Loại bỏ khoảng trắng
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Kiểm tra xác thực mật khẩu
        if (password !== confirmPassword) {
            showError("Xác thực mật khẩu không đúng."); // Hiển thị thông báo lỗi
            return; // Dừng lại nếu mật khẩu không khớp
        }

        // Kiểm tra xem tên người dùng đã tồn tại chưa
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser  = users.find(user => user.username === username);

        if (existingUser ) {
            showError("Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác."); // Thông báo nếu tên người dùng đã tồn tại
            return; // Dừng lại nếu tên người dùng đã tồn tại
        }

        // Nếu tất cả thông tin hợp lệ, lưu thông tin người dùng vào localStorage
        if (username && email && password) {
            // Tạo đối tượng người dùng mới
            const newUser  = {
                username: username,
                email: email,
                password: password
            };

            // Lưu người dùng vào localStorage
            users.push(newUser );
            localStorage.setItem('users', JSON.stringify(users));

            // Xóa dữ liệu cũ nếu cần
           //localStorage.removeItem('users'); // Xóa danh sách người dùng cũ
          // localStorage.clear(); // Xóa tất cả dữ liệu trong localStorage

            // Hiển thị thông báo thành công
            showSuccess("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
            setTimeout(() => {
                window.location.href = "login.html"; // Chuyển hướng đến trang đăng nhập
            }, 3000); // Chờ 3 giây trước khi chuyển hướng
        } else {
            showError("Vui lòng nhập thông tin hợp lệ."); // Thông báo nếu thông tin không hợp lệ
        }
    });
});

// Hàm hiển thị thông báo lỗi
function showError(message) {
    const errorMessageDiv = document.getElementById("error-message");
    errorMessageDiv.textContent = message; // Đặt nội dung thông báo
    errorMessageDiv.style.display = "block"; // Hiển thị thông báo
    errorMessageDiv.style.backgroundColor = "rgba(255, 0, 0, 0.7)"; // Màu nền đỏ mờ
    errorMessageDiv.style.color = "white"; // Màu chữ trắng
    errorMessageDiv.style.padding = "10px"; // Padding cho thông báo
    errorMessageDiv.style.borderRadius = "5px"; // Bo góc cho thông báo
    errorMessageDiv.style.position = "fixed"; // Đặt vị trí cố định
    errorMessageDiv.style.top = "20px"; // Đặt vị trí từ trên xuống
    errorMessageDiv.style.left = "50%"; // Căn giữa
    errorMessageDiv.style.transform = "translateX(-50%)"; // Căn giữa
    errorMessageDiv.style.zIndex = "1000"; // Đặt z-index cao để hiển thị trên các phần tử khác
    
    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
        errorMessageDiv.style.display = "none"; // Ẩn thông báo
    }, 3000);
}
    
    // Hàm hiển thị thông báo thành công
    function showSuccess(message) {
        const overlay = document.getElementById("overlay");
        const successMessageDiv = document.getElementById("success-message");
    
        successMessageDiv.textContent = message; // Đặt nội dung thông báo
        overlay.style.display = "block"; // Hiển thị overlay
        successMessageDiv.style.display = "block"; // Hiển thị thông báo
        successMessageDiv.style.backgroundColor = "rgba(105, 190, 105, 0.7)"; // Màu nền xanh mờ
        successMessageDiv.style.color = "white"; // Màu chữ trắng
        successMessageDiv.style.padding = "10px"; // Padding cho thông báo
        successMessageDiv.style.borderRadius = "5px"; // Bo góc cho thông báo
        successMessageDiv.style.position = "fixed"; // Đặt vị trí cố định
        successMessageDiv.style.top = "20px"; // Căn giữa theo chiều dọc
        successMessageDiv.style.left = "50%"; // Căn giữa theo chiều ngang
        successMessageDiv.style.transform = "translateX(-50%)"; // Căn giữa
        successMessageDiv.style.zIndex = "1001"; // Đặt z-index cao hơn overlay
    
        // Ẩn thông báo và overlay sau 3 giây
        setTimeout(() => {
            overlay.style.display = "none"; // Ẩn overlay
            successMessageDiv.style.display = "none"; // Ẩn thông báo
        }, 3000);
    }