document.addEventListener("DOMContentLoaded", function () {
    const orderList = document.getElementById("order-list");
    const userInfoElement = document.getElementById("user-info");
    const username = localStorage.getItem("username"); // Lấy tên tài khoản từ localStorage

    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!username) {
        orderList.innerHTML = "<li>Please <a href='login.html'>login</a> to view the history of order.</li>";
        return; // Dừng lại nếu chưa đăng nhập
    }

    // Hiển thị tên tài khoản
    userInfoElement.textContent = `${username}`; // Hiển thị tên tài khoản

    // Lấy danh sách đơn hàng từ localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    // Kiểm tra xem có đơn hàng nào không
    if (orders.length === 0) {
        orderList.innerHTML = "<li>There are no orders.</li>"; // Hiển thị thông báo nếu không có đơn hàng
    } else {
        // Hiển thị danh sách đơn hàng
        orders.forEach(order => {
            const listItem = document.createElement("li");

            // Thêm hình ảnh sản phẩm
            const img = document.createElement("img");
            img.src = `../assets/img/${order.name.toLowerCase()}.jpg`; // Đường dẫn đến hình ảnh
            img.alt = order.name;

            // Thêm thông tin đơn hàng
            const orderInfo = document.createElement("span");
            orderInfo.className = "order-info"; // Thêm lớp CSS cho thông tin
            orderInfo.textContent = `Order: ${order.name}, Price: ${formatCurrency(order.price)}, Quantity: ${order.quantity}`;

            // Thêm nút "Mua lại"
            const buyAgainBtn = document.createElement("button");
            buyAgainBtn.className = "buy-again-btn"; // Thêm lớp CSS cho nút
            buyAgainBtn.textContent = "Acquire";
            buyAgainBtn.onclick = function() {
                addToCart(order); // Gọi hàm thêm vào giỏ hàng
            };

            // Thêm tất cả vào listItem
            listItem.appendChild(img);
            listItem.appendChild(orderInfo);
            listItem.appendChild(buyAgainBtn);
            orderList.appendChild(listItem);
        });
    }
});

// Hàm định dạng số tiền với dấu chấm
function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
}

//hàm thêm sản phẩm vào giỏ nếu bấm mua lại
function addToCart(order) {
    let cart = JSON.parse(localStorage.getItem("cart")) || []; // Lấy giỏ hàng hiện tại
    let existingItem = cart.find(item => item.name === order.name);
    
    if (existingItem) {
        existingItem.quantity += order.quantity; // Tăng số lượng nếu sản phẩm đã tồn tại
    } else {
        cart.push(order); // Nếu chưa có, thêm vào giỏ hàng
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart(); // Gọi updateCart để cập nhật giao diện giỏ hàng
}

// localStorage.clear();
localStorage.removeItem("cart");


