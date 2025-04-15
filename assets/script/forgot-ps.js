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
            showError("Please enter a valid email!");
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        currentUser = users.find(user => user.email === email); // Tìm user theo email

        if (!currentUser) {
            showError("This email has not been registered!");
            return;
        }

        // Tạo mã OTP ngẫu nhiên (6 chữ số)
        generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("OTP (giả lập):", generatedOTP); // In OTP ra console (để test)

        showSuccess("OTP code has been sent! Please check your email.");
        recoveryForm.style.display = "none";
        otpForm.style.display = "block";
    });

    // Xử lý kiểm tra OTP
    otpForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const enteredOTP = otpInput.value.trim();

        if (enteredOTP === generatedOTP) {
            showSuccess("Accurate OTP code! Please reset the password.");
            otpForm.style.display = "none";
            newPasswordForm.style.display = "block";
        } else {
            showError("The OTP code is not right! Please try again.");
        }
    });

    // Xử lý đặt lại mật khẩu
    newPasswordForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const newPassword = newPasswordInput.value.trim();

        if (newPassword.length < 6) {
            showError("Password must have at least 6 characters!");
            return;
        }

        if (!currentUser) {
            showError("Error: No account found to reset the password.");
            return;
        }

        // Cập nhật mật khẩu mới vào `localStorage`
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.email === currentUser.email);

        if (userIndex !== -1) {
            users[userIndex].password = newPassword; // Cập nhật mật khẩu mới
            localStorage.setItem('users', JSON.stringify(users));
            showSuccess("The password has been successfully updated!");
            
            setTimeout(() => {
                window.location.href = "login.html"; // Chuyển hướng về trang login
            }, 2000);
        } else {
            showError("Error: No account found!");
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
