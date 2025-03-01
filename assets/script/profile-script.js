document.addEventListener("DOMContentLoaded", function () {
    const profileForm = document.getElementById("profile-form");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const profilePicInput = document.getElementById("profile-pic");
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");

    // Tải thông tin người dùng từ localStorage
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const profilePic = localStorage.getItem('profilePic');

    // Hiển thị thông tin người dùng
    if (username) {
        usernameInput.value = username;
    }
    if (email) {
        emailInput.value = email;
    }
    if (profilePic) {
        document.getElementById("profile-pic-display").src = profilePic; // Hiển thị ảnh đại diện
    }

    // Xử lý sự kiện gửi form
    profileForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của form

        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem('username', usernameInput.value);
        localStorage.setItem('email', emailInput.value);

        // Xử lý ảnh đại diện
        if (profilePicInput.files.length > 0) {
            const file = profilePicInput.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                localStorage.setItem('profilePic', e.target.result);
                document.getElementById("profile-pic-display").src = e.target.result; // Hiển thị ảnh đại diện
                showNotification("Cập nhật thành công!");
            };
            reader.readAsDataURL(file);
        } else {
            showNotification("Cập nhật thành công!");
        }
    });

    // Hàm hiển thị thông báo
    function showNotification(message) {
        notificationMessage.textContent = message;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000); // Ẩn thông báo sau 3 giây
    }
});

// Thêm mã JavaScript để xử lý thay đổi ảnh đại diện
document.getElementById("change-pic-btn").addEventListener("click", function() {
    document.getElementById("profile-pic").click(); // Mở hộp thoại chọn file
});

document.getElementById("profile-pic").addEventListener("change", function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById("profile-pic-display").src = e.target.result; // Hiển thị ảnh đại diện
    };
    reader.readAsDataURL(file);
});