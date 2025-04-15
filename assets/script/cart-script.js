document.addEventListener("DOMContentLoaded", function () {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price"); //tổng tiền ban đầu
    const discountedPriceElement = document.getElementById("discounted-price"); // Giá sau giảm
    const checkoutBtn = document.getElementById("checkout-btn");
    const modal = document.querySelector('.js-modal');
    const modalClose = document.querySelector('.js-modal-close');
    const orderForm = document.getElementById("orderForm");
    const confirmationMessage = document.getElementById("confirmation-message");
    const flowerInfoElement = document.getElementById("flower-info");
    const emptyCartMessage = document.getElementById("empty-cart-message");
    const noProductsMessage = document.getElementById("no-products-message");
    const applyPromoBtn = document.getElementById("apply-promo-btn");
    const promoCodeInput = document.getElementById("promo-code");
    
    // Định nghĩa các mã khuyến mãi và tỷ lệ giảm giá
    const promoCodes = {
        "50% OFF": { discount: 0.5, used: false }, // Giảm 50%
        "10% OFF": { discount: 0.1, used: false }, // Giảm 10%
        "SAVE20": { discount: 0.2, used: false } // Giảm 20%
    };

    // định nghĩa mã giảm giá cho từng loại hoa
    const discountCodes = {
        "chrysanthemum": "10% OFF",
        "roses": "50% OFF",
        "tulips": "50% OFF"
    };

    // Lấy giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Cập nhật giỏ hàng
function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        totalPriceElement.textContent = "0 VND";
        discountedPriceElement.textContent = "0 VND"; // Hiển thị giá giảm là 0 VND khi giỏ hàng rỗng
    } else {
        emptyCartMessage.style.display = 'none';
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const discountText = discountCodes[item.name.toLowerCase()] || ""; // Lấy mã giảm giá tương ứng
            
            const cartHTML = cart.map((item, index) =>{
                return`
                    <div class="cart-item" style="position: relative;">
                        <img src="../assets/img/${item.name.toLowerCase()}.jpg" alt="${item.name}" style="width: 50px; height: 50px;">
                        <span class="discount-code" style="position: absolute; top: 0; right: 730px; padding: 2px 5px; font-size: 0.8em; color: red;">${discountText}</span>
                        <div class="cart-item-info">
                        <span class="product-name">${item.name}</span>
                        </div>
                        <div class="quantity-controls">
                            <button class="removeBtn" data-index="${index}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="addBtn" data-index="${index}">+</button>
                        </div>
                    </div>
                `;
            }).join('');
            cartItemsContainer.innerHTML = cartHTML;    
        });
    }

    // Hiển thị tổng tiền ban đầu và giá giảm là 0 VND khi chưa nhập mã
    totalPriceElement.textContent = `${formatCurrency(total)}`;
    discountedPriceElement.textContent = "0 VND";
}

    // Hàm định dạng số tiền với dấu chấm
    function formatCurrency(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
    }

    // Xóa sản phẩm khỏi giỏ hàng
    cartItemsContainer.addEventListener('click', function(event) {
        const index = event.target.getAttribute('data-index');
        if (event.target.classList.contains('removeBtn')) {
            if (cart[index].quantity > 1) {
                cart[index].quantity--; // Giảm số lượng
            } else {
                cart.splice(index, 1); // Xóa sản phẩm nếu số lượng = 1
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
        } else if (event.target.classList.contains('addBtn')) {
            cart[index].quantity++; // Tăng số lượng
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
        }
    });

    // Hiển thị giỏ hàng khi tải trang
    updateCart();

    // Hiển thị modal thanh toán
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            noProductsMessage.style.display = 'block';
            setTimeout(() => {
                noProductsMessage.style.display = 'none';
            }, 3000);
            return;
        }

        const flowerDetails = cart.map(item => `${item.name} - ${item.quantity}`).join(', ');
        flowerInfoElement.textContent = `You have set: ${flowerDetails}`;
        modal.classList.add('open');
    });

    // Đóng modal
    modalClose.addEventListener('click', function() {
        modal.classList.remove('open');
        confirmationMessage.textContent = "";
    });

    // Nghe hành vi click vào khoảng không modal thì đóng modal
    modal.addEventListener('click', function() {
        modal.classList.remove('open');
    });

    // Nghe hành vi click vào modal nhưng ngừng từ modalContainer
    const modalContainer = document.querySelector('.js-modal-container');
    modalContainer.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    // Xử lý việc gửi biểu mẫu
    orderForm.onsubmit = function(event) {
        event.preventDefault();
        const customerName = document.getElementById("name").value.trim();
        const flowerEmail = document.getElementById("email").value.trim();
        const flowerDate = document.getElementById("date").value;
        const flowerTime = document.getElementById("time").value;
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

        // Kiểm tra thông tin
        if (!flowerEmail || !flowerEmail.includes("@")) {
            confirmationMessage.style.color = "red";
            confirmationMessage.textContent = "Please enter a valid email!";
            return;
        }

        // Tạo nội dung email
        const flowerQuantity = cart.map(item => `${item.name}: ${item.quantity}`).join(', ');
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0); //hàm tính giá gốc
        const discountedTotal = calculateDiscountedTotal(); // Hàm tính tổng sau khi áp mã giảm giá

        // Ghi nhận đơn hàng vào localStorage
        let orders = JSON.parse(localStorage.getItem("orders")) || [];
        cart.forEach(item => {
            orders.push({
                name: item.name,
                price: item.price,
                quantity: item.quantity
            });
        });
        localStorage.setItem("orders", JSON.stringify(orders)); // Lưu lại danh sách đơn hàng


        confirmationMessage.style.color = "green";
        confirmationMessage.textContent = `Information will be sent to email: ${flowerEmail}`;

        // Nội dung email
        const subject = encodeURIComponent("Confirmation of buying flowers from Eden Blooms");
        const body = encodeURIComponent(
            `Congratulations ${customerName}!\n\n` +
            `You have successfully ordered:\n` +
            `${flowerQuantity}\n` +
            //`Tổng giá: ${formatCurrency(totalPrice)}\n` + tính tổng giá gốc
            `Total price: ${formatCurrency(discountedTotal)}\n` + // Cập nhật giá sau giảm
            `Date of appointment: ${flowerDate} in the ${flowerTime}\n\n` +
            `Payment method: ${paymentMethod}\n\n` +
            `Please check the information and be on time to receive flowers!\n\n` +
            `Best regards,\n` +
            `Eden Blooms`
        );

        // Mở Gmail trực tiếp
        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${flowerEmail}&su=${subject}&body=${body}`;
        window.open(gmailLink, "_blank");

        // Đóng modal sau 20 giây
        setTimeout(function() {
            modal.classList.remove('open');
            confirmationMessage.textContent = "";
            cart = [];
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
        }, 20000);
    };

    // Hàm tính tổng sau khi áp mã giảm giá
    function calculateDiscountedTotal() {
        const total = cart.reduce((total, item) => total + (item.price *     item.quantity), 0);
        const promo = Object.values(promoCodes).find(p => p.used); // Tìm mã khuyến mãi đã sử dụng
        if (promo) {
            const discountRate = promo.discount;
            return total - (total * discountRate);
        }
        return total; // Nếu không có mã khuyến mãi, trả về tổng gốc
    }

    // Áp dụng mã khuyến mãi
    applyPromoBtn.addEventListener("click", function() {
        const promoCode = promoCodeInput.value.trim();
        const promo = promoCodes[promoCode];
        const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const originalTotal = total; // Lưu tổng giá gốc

        // Kiểm tra nếu giỏ hàng trống
        if (cart.length === 0) {
            showPromoMessage("The shopping cart is empty!", true);
            return;
        }

        if (!promoCode) {
            showPromoMessage("Please enter the code.", true);
            return;
        }

        if (promo) {
            if (promo.used) {
                showPromoMessage("The code has been used!", true);
                return;
            }
        
            const discountRate = promo.discount;
            const discount = total * discountRate;
            const newTotal = total - discount;
        
            // Hiển thị giá cũ và giá mới
            document.getElementById("total-price").textContent = `${formatCurrency(originalTotal)}`;
            document.getElementById("total-price").classList.add("applied"); // Thêm class khi áp mã
            document.getElementById("total-price").style.display = "inline";
            
            document.getElementById("discounted-price").textContent = `${formatCurrency(newTotal)}`;
        
            showPromoMessage(`Promotion code "${promoCode}" has been applied!`, false);
            promo.used = true;

            //xóa nội dung ô nhập mã sau khi áp dụng
            promoCodeInput.value = "";
        } else {
            showPromoMessage("Promotion code is not valid!", true);
        }
    });

    // Hàm hiển thị thông báo khuyến mãi
    function showPromoMessage(message, isError = false) {
        const promoMessageBox = document.getElementById("promo-message");
        promoMessageBox.textContent = message;
        promoMessageBox.classList.remove("fade-out");
        promoMessageBox.style.display = "block"; // Hiển thị thông báo

        // Thêm lớp màu tương ứng
        if (isError) {
            promoMessageBox.classList.add("red");
            promoMessageBox.classList.remove("green");
        } else {
            promoMessageBox.classList.add("green");
            promoMessageBox.classList.remove("red");
        }

        setTimeout(() => {
            promoMessageBox.classList.add("fade-out"); // Thêm lớp fade-out
            setTimeout(() => {
                promoMessageBox.style.display = "none"; // Ẩn sau khi animation kết thúc
            }, 500); // Đợi animation kết thúc mới ẩn hẳn
        }, 3000); // Hiển thị trong 3 giây
    }

    // Hàm hiển thị thông báo giỏ hàng trống, hãy đặt hàng
    function showMessage(message, isError = false) {
        const messageBox = document.getElementById("no-products-message");
        messageBox.textContent = message;
        messageBox.classList.remove("fade-out");
        messageBox.style.display = "block"; // Hiển thị thông báo
        if (isError) {
            messageBox.style.color = "red";
        } else {
            messageBox.style.color = "green";
        }
        setTimeout(() => {
            messageBox.classList.add("fade-out"); // Ẩn sau 3 giây
            setTimeout(() => {
                messageBox.style.display = "none";
            }, 500); // Đợi animation kết thúc mới ẩn hẳn
        }, 3000);
    }
});

//tăng giảm số lượng
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".addBtn").forEach(button => {
        button.addEventListener("click", function() {
            let index = this.getAttribute("data-index");
            updateQuantity(index, 1);
        });
    });

    document.querySelectorAll(".removeBtn").forEach(button => {
        button.addEventListener("click", function() {
            let index = this.getAttribute("data-index");
            updateQuantity(index, -1);
        });
    });

    function updateQuantity(index, change) {
        let quantitySpan = document.querySelectorAll(".quantity")[index];
        let newQuantity = Math.max(1, parseInt(quantitySpan.textContent) + change);
        quantitySpan.textContent = newQuantity;
    }
});

// Hiển thị tên tài khoản nếu có
const username = localStorage.getItem("username");
const userInfoElement = document.getElementById("user-info");
if (username) {
    userInfoElement.innerHTML = `<strong>${username}</strong>`; // Hiển thị tên tài khoản
} else {
    userInfoElement.textContent = "You have not logged in."; // Thông báo nếu chưa đăng nhập
}

// Thêm sự kiện click cho phần hiển thị tên tài khoản
userInfoElement.addEventListener("click", function() {
    if (!username) {
        window.location.href = "login.html"; // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    } 
});




