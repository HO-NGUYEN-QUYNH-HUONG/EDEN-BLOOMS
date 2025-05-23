document.addEventListener("DOMContentLoaded", function () {
    // Khai báo các biến cho các phần tử DOM
    const searchIcon = document.getElementById("search-icon");
    const searchInput = document.querySelector("#search-box input");
    const notifications = document.getElementById("search-notification");

    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const closeBtn = document.getElementById("close-btn");
    const overlay = document.getElementById("overlay");

    const buyBtns = document.querySelectorAll('.addToCartBtn'); // Nút mua hoa
    const notification = document.getElementById("notification"); // Phần tử thông báo

    const usernameDisplay = document.getElementById("username-display");
    const userMenu = document.getElementById("user-menu");
    const loginMenu = document.getElementById("login-menu");
    const logoutButton = document.getElementById("logout");

    // Xử lý mở menu sidebar
    menuToggle.addEventListener("click", function () {
        sidebar.classList.add("active");
        overlay.classList.add("active");
    });

    // Đóng sidebar khi bấm nút X hoặc ra ngoài
    closeBtn.addEventListener("click", closeSidebar);
    overlay.addEventListener("click", closeSidebar);

    function closeSidebar() {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    }

    // Slider
    let slideIndex = 0;
    showSlides();

    function showSlides() {
        let slides = document.getElementsByClassName("image-sliderfade");
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  // Ẩn tất cả các slide
        }
        slideIndex++;
        if (slideIndex >= slides.length) { slideIndex = 0; }
        slides[slideIndex].style.display = "block";  // Hiển thị slide hiện tại
        setTimeout(showSlides, 5000); // Thay đổi hình ảnh mỗi 5 giây
    }

    // Hàm di chuyển slide
    window.moveSlide = function (n) {
        slideIndex += n;
        let slides = document.getElementsByClassName("image-sliderfade");
        if (slideIndex >= slides.length) { slideIndex = 0; }
        if (slideIndex < 0) { slideIndex = slides.length - 1; }
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  // Ẩn tất cả các slide
        }
        slides[slideIndex].style.display = "block";  // Hiển thị slide hiện tại
    }

    // Hàm hiển thị thông báo khi thêm hoa vào giỏ hàng
    function showNotification(message) {
        const notificationMessage = document.getElementById("notification-message");
        notificationMessage.textContent = message;
        notification.style.display = 'block';

        // Thêm sự kiện click cho thông báo
        notification.addEventListener('click', function () {
            window.location.href = 'cart.html'; // Chuyển hướng đến trang giỏ hàng
        });

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000); // Ẩn thông báo sau 3 giây
    }

    // Lặp qua từng thẻ button và nghe hành vi click để thêm sản phẩm vào giỏ hàng
    buyBtns.forEach(btn => {
        btn.addEventListener('click', function (event) {
            const flowerName = event.target.getAttribute('data-flower');
            const flowerPrice = parseFloat(event.target.getAttribute('data-price'));
            const flowerQuantity = 1; // Hoặc có thể lấy từ một input nếu cần

            // Kiểm tra xem người dùng đã đăng nhập chưa
            const username = localStorage.getItem('username');
            if (!username) {
                // Nếu chưa đăng nhập, hiển thị thông báo yêu cầu đăng nhập
                showNotification("Please login to add more goods.");
                return; // Dừng lại không thực hiện thêm vào giỏ hàng
            }

            // Tạo đối tượng sản phẩm
            const flower = {
                name: flowerName,
                price: flowerPrice,
                quantity: flowerQuantity
            };

            // Lấy giỏ hàng từ localStorage
            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const existingFlowerIndex = cart.findIndex(item => item.name === flowerName);
            if (existingFlowerIndex > -1) {
                // Nếu đã có, tăng số lượng
                cart[existingFlowerIndex].quantity += flowerQuantity;
            } else {
                // Nếu chưa có, thêm sản phẩm mới vào giỏ hàng
                cart.push(flower);
            }

            // Cập nhật giỏ hàng vào localStorage
            localStorage.setItem("cart", JSON.stringify(cart));

            // Hiển thị thông báo
            showNotification(`${flowerName} already added to the cart!`);
        });
    });

    // Tăng số lượng trong cart-icon
    let cartCount = localStorage.getItem('cartCount') ? parseInt(localStorage.getItem('cartCount')) : 0;

    // Hàm cập nhật số lượng giỏ hàng
    function updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        cartCountElement.textContent = cartCount; // Cập nhật số lượng hiển thị
        localStorage.setItem('cartCount', cartCount); // Lưu số lượng vào local storage
    }

    // Cập nhật số lượng giỏ hàng ban đầu
    updateCartCount();

    // Cập nhật số lượng giỏ hàng khi quay lại trang index.html
    function updateCartCountOnLoad() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        updateCartCount();
    }

    // Gọi hàm cập nhật số lượng giỏ hàng khi tải trang
    updateCartCountOnLoad();

    // Kiểm tra xem có tên người dùng trong localStorage không
    const username = localStorage.getItem('username');

    if (username) {
        updateHeader(username); // Cập nhật header
    }

    // Hàm cập nhật header sau khi đăng nhập
    function updateHeader(username) {
        if (username) {
            usernameDisplay.textContent = `${username}`;
            userMenu.style.display = 'block';
            loginMenu.style.display = 'none';
            usernameDisplay.onclick = () => window.location.href = 'profile.html';
        } else {
            userMenu.style.display = 'none';
            loginMenu.style.display = 'block';
        }
    }

    // Thêm sự kiện cho nút đăng xuất
    if (logoutButton) {
        logoutButton.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.removeItem('username');
            localStorage.removeItem('isLoggedIn');
            updateHeader(null);
            window.location.href = 'index.html';
        });
    }

    // Lấy phần tử nút "Cuộn lên đầu trang"
    let mybutton = document.getElementById("back-to-top");

    // Ẩn nút khi ở đầu trang
    mybutton.style.display = "none";

    // Lắng nghe sự kiện cuộn trang
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            mybutton.style.display = "block"; // Hiện nút khi cuộn xuống
        } else {
            mybutton.style.display = "none"; // Ẩn nút khi ở đầu trang
        }
    });

    // Khi người dùng nhấn vào nút, cuộn lên đầu trang mượt mà
    mybutton.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // Xử lý đăng nhập từ form
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("username", username);
                window.location.href = "index.html";
            } else {
                document.getElementById("login-error").textContent = "Users do not exist!";
            }
        });
    }

    //tìm kiếm hoa theo tên
    function goToSearchPage() {
        const flowerName = searchInput.value.trim();
        if (flowerName) {
            window.location.href = "search.html?flower=" + encodeURIComponent(flowerName);
        } else {
            notifications.textContent = "Please enter the name of Hoa to search.";
            notifications.style.display = "block";

            // Ẩn thông báo sau 2.5 giây
            setTimeout(() => {
                notifications.style.display = "none";
            }, 2500);
        }
    }

    if (searchIcon && searchInput) {
        // Click vào icon tìm kiếm
        searchIcon.addEventListener("click", function (event) {
            event.preventDefault();
            goToSearchPage();
        });

        // Nhấn phím Enter trong input
        searchInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                goToSearchPage();
            }
        });
    } else {
        console.error("No search-icon or search-input!");
    }
});



