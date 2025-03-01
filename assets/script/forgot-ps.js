document.addEventListener("DOMContentLoaded", function () {
    const recoveryForm = document.getElementById("forgotPasswordForm");
    const otpForm = document.getElementById("otpForm");
    const newPasswordForm = document.getElementById("newPasswordForm");

    const emailInput = document.getElementById("email");
    const otpInput = document.getElementById("otp");
    const newPasswordInput = document.getElementById("newPassword");
    
    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");

    let generatedOTP = ""; // Lưu OTP giả lập
    let currentUser = null; // Lưu thông tin user đang reset mật khẩu

    // Xử lý gửi OTP
    recoveryForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = emailInput.value.trim();

        if (!isValidEmail(email)) {
            showError("Vui lòng nhập email hợp lệ!");
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        currentUser = users.find(user => user.email === email); // Tìm user theo email

        if (!currentUser) {
            showError("Email này chưa được đăng ký!");
            return;
        }

        // Tạo mã OTP ngẫu nhiên (6 chữ số)
        generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("OTP (giả lập):", generatedOTP); // In OTP ra console (để test)

        showSuccess("Mã OTP đã được gửi! Vui lòng kiểm tra email.");
        recoveryForm.style.display = "none";
        otpForm.style.display = "block";
    });

    // Xử lý kiểm tra OTP
    otpForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const enteredOTP = otpInput.value.trim();

        if (enteredOTP === generatedOTP) {
            showSuccess("Mã OTP chính xác! Vui lòng đặt lại mật khẩu.");
            otpForm.style.display = "none";
            newPasswordForm.style.display = "block";
        } else {
            showError("Mã OTP không đúng! Vui lòng thử lại.");
        }
    });

    // Xử lý đặt lại mật khẩu
    newPasswordForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const newPassword = newPasswordInput.value.trim();

        if (newPassword.length < 6) {
            showError("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        if (!currentUser) {
            showError("Lỗi: Không tìm thấy tài khoản để đặt lại mật khẩu.");
            return;
        }

        // Cập nhật mật khẩu mới vào `localStorage`
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.email === currentUser.email);

        if (userIndex !== -1) {
            users[userIndex].password = newPassword; // Cập nhật mật khẩu mới
            localStorage.setItem('users', JSON.stringify(users));
            showSuccess("Mật khẩu đã được cập nhật thành công!");
            
            setTimeout(() => {
                window.location.href = "login.html"; // Chuyển hướng về trang login
            }, 2000);
        } else {
            showError("Lỗi: Không tìm thấy tài khoản!");
        }
    });

    // Kiểm tra email hợp lệ
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Hiển thị thông báo lỗi
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
        successMessage.style.display = "none";
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000);
    }

    // Hiển thị thông báo thành công
    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = "block";
        errorMessage.style.display = "none";
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 3000);
    }
});
