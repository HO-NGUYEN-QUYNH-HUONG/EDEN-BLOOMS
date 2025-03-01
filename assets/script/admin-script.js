document.addEventListener("DOMContentLoaded", function () {
    const adminUsername = "admin"; // Tên đăng nhập cố định
    const adminPassword = "admin123"; // Mật khẩu cố định
    const loginContainer = document.getElementById("admin-login");
    const adminContainer = document.getElementById("admin-panel");
    const loginBtn = document.getElementById("admin-login-btn");
    const logoutBtn = document.getElementById("admin-logout");
    const headerLogoutBtn = document.getElementById("logout"); // Nút đăng xuất trên header
    const loginError = document.getElementById("login-error");
    const productName = document.getElementById("product-name");
    const productPrice = document.getElementById("product-price");
    const productImage = document.getElementById("product-image");
    const productQuantity = document.getElementById("product-quantity"); // Trường số lượng
    const addProductBtn = document.getElementById("add-product");
    const productList = document.getElementById("product-list");

    // Kiểm tra trạng thái đăng nhập
    if (localStorage.getItem("isAdmin") === "true") {
        showAdminPanel();
    }

    // Xử lý đăng nhập
    loginBtn.addEventListener("click", function () {
        const enteredUsername = document.getElementById("admin-username").value;
        const enteredPassword = document.getElementById("admin-password").value;

        if (enteredUsername === adminUsername && enteredPassword === adminPassword) {
            localStorage.setItem("isAdmin", "true");
            localStorage.setItem("username", adminUsername); // Lưu tên admin
            showAdminPanel();
        } else {
            loginError.textContent = "Tên đăng nhập hoặc mật khẩu không đúng!";
        }
    });

    // Đăng xuất từ nút trong header
    headerLogoutBtn.addEventListener("click", function () {
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("username");
        window.location.href = "index.html"; // Chuyển hướng về trang chính
    });

    // Đăng xuất từ admin panel
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("username");
        window.location.href = "index.html"; // Chuyển hướng về trang chính
    });

    // Hiển thị giao diện admin
    function showAdminPanel() {
        loginContainer.classList.add("hidden");
        adminContainer.classList.remove("hidden");
        loadProducts();
    }

    // Thêm sản phẩm
addProductBtn.addEventListener("click", function () {
    const name = productName.value.trim();
    const price = productPrice.value.trim();
    const image = productImage.value.trim();
    const quantity = productQuantity.value.trim(); // Lấy số lượng
    const description = productDescription.value.trim(); // Lấy mô tả

    if (name && price && image && quantity && description) {
        const numericPrice = parseInt(price.replace(/\./g, ''), 10);
        const numericQuantity = parseInt(quantity, 10); // Chuyển đổi số lượng thành số
        const products = getProducts();
        products.push({ name, price: numericPrice, image, quantity: numericQuantity, description }); // Lưu mô tả
        saveProducts(products);
        loadProducts();
        updateHomePageProducts(); // Cập nhật sản phẩm trên trang chủ
        productName.value = "";
        productPrice.value = "";
        productImage.value = "";
        productQuantity.value = ""; // Reset số lượng
        productDescription.value = ""; // Reset mô tả
    }
});

// Hiển thị giao diện admin
function showAdminPanel() {
    loginContainer.classList.add("hidden");
    adminContainer.classList.remove("hidden");
    loadProducts(); // Gọi hàm này để tải sản phẩm
}

    // Tải danh sách sản phẩm
function loadProducts() {
    productList.innerHTML = "";
    const products = getProducts();
    products.forEach((product, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text" value="${product.name}" data-index="${index}" class="edit-name"></td>
            <td><input type="text" value="${formatCurrency(product.price)}" data-index="${index}" class="edit-price"></td>
            <td><input type="text" value="${product.image}" data-index="${index}" class="edit-image"></td>
            <td><input type="number" value="${product.quantity}" data-index="${index}" class="edit-quantity"></td>
            <td>
                <button class="save-btn" data-index="${index}">Lưu</button>
                <button class="delete-btn" data-index="${index}">Xóa</button>
            </td>
        `;
        productList.appendChild(row);
    });
    attachEventListeners();
}

// Cập nhật sản phẩm trên trang chủ
function updateHomePageProducts() {
    const homeProductList = document.getElementById("home-product-list"); // ID của danh sách sản phẩm trên trang index.html
    homeProductList.innerHTML = ""; // Xóa danh sách hiện tại
    const products = getProducts(); // Lấy danh sách sản phẩm từ localStorage
    products.forEach(product => {
        const item = document.createElement("div");
        item.className = "flower-info"; // Thêm class để định dạng
        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p><b>Description: </b>${product.description || "No description available."}</p>
            <p><b>Price: </b>${formatCurrency(product.price)}</p>
            <p><b>Quantity: </b>${product.quantity}</p>
            <button class="addToCartBtn" data-flower="${product.name}" data-price="${product.price}">Add to the cart</button>
        `;
        homeProductList.appendChild(item);
    });
}

    // Gắn sự kiện cho nút sửa và xóa
    function attachEventListeners() {
        document.querySelectorAll(".save-btn").forEach(btn => {
            btn.addEventListener("click", function () {
                const index = this.dataset.index;
                const name = document.querySelector(`.edit-name[data-index='${index}']`).value;
                const price = document.querySelector(`.edit-price[data-index='${index}']`).value;
                const image = document.querySelector(`.edit-image[data-index='${index}']`).value;
                const quantity = document.querySelector(`.edit-quantity[data-index='${index}']`).value; // Lấy số lượng
                updateProduct(index, name, price, image, quantity);
            });
        });
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", function () {
                const index = this.dataset.index;
                deleteProduct(index);
            });
        });
    }

    // Cập nhật sản phẩm
function updateProduct(index, name, price, image, quantity, description) {
    const products = getProducts();
    const numericPrice = parseInt(price.replace(/\./g, ''), 10);
    const numericQuantity = parseInt(quantity, 10); // Chuyển đổi số lượng thành số
    products[index] = { name, price: numericPrice, image, quantity: numericQuantity, description }; // Cập nhật mô tả
    saveProducts(products);
    loadProducts();
}

    // Xóa sản phẩm
    function deleteProduct(index) {
        const products = getProducts();
        products.splice(index, 1);
        saveProducts(products);
        loadProducts();
    }

    // Lấy danh sách sản phẩm từ localStorage
    function getProducts() {
        return JSON.parse(localStorage.getItem("products")) || [];
    }

    // Lưu danh sách sản phẩm vào localStorage
    function saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }

    // Hàm định dạng giá tiền
    function formatCurrency(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
    }
});

// Tải danh sách liên hệ
function loadContacts() {
    const contactList = document.getElementById("contact-list");
    contactList.innerHTML = "";
    const contacts = getContacts(); // Hàm này sẽ lấy danh sách liên hệ từ localStorage
    contacts.forEach(contact => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.message}</td>
        `;
        contactList.appendChild(row);
    });
}

// Lấy danh sách liên hệ từ localStorage
function getContacts() {
    return JSON.parse(localStorage.getItem("contacts")) || [];
}