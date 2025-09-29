// Main JavaScript file for Tawseel website

// Global variables
let currentUser = null;
let currentRole = null;

// Modal functions
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showLogin() {
    showModal('loginModal');
}

function showPassengerRegister() {
    showModal('passengerRegisterModal');
}

function showDriverRegister() {
    showModal('driverRegisterModal');
}

function showRegister() {
    // Close login modal and show register
    closeModal('loginModal');
    showModal('passengerRegisterModal');
}

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Passenger registration form
    const passengerRegisterForm = document.getElementById('passengerRegisterForm');
    if (passengerRegisterForm) {
        passengerRegisterForm.addEventListener('submit', handlePassengerRegister);
    }

    // Driver registration form
    const driverRegisterForm = document.getElementById('driverRegisterForm');
    if (driverRegisterForm) {
        driverRegisterForm.addEventListener('submit', handleDriverRegister);
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Request trip form
    const requestTripForm = document.getElementById('requestTripForm');
    if (requestTripForm) {
        requestTripForm.addEventListener('submit', handleRequestTrip);
    }

    // Search passengers form
    const searchPassengersForm = document.getElementById('searchPassengersForm');
    if (searchPassengersForm) {
        searchPassengersForm.addEventListener('submit', handleSearchPassengers);
    }

    // Close modals when clicking outside
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    }
});

function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    // Simulate login (in real app, this would call API)
    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            currentUser = data.user;
            currentRole = data.user.role;
            closeModal('loginModal');
            
            if (currentRole === 'passenger') {
                showModal('passengerDashboardModal');
            } else if (currentRole === 'driver') {
                showModal('driverDashboardModal');
            }
        } else {
            alert('بيانات تسجيل الدخول غير صحيحة');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('حدث خطأ أثناء تسجيل الدخول');
    });
}

function handlePassengerRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        password: formData.get('password'),
        governorate: formData.get('governorate'),
        role: 'passenger'
    };

    // Simulate registration (in real app, this would call API)
    fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('تم التسجيل بنجاح!');
            closeModal('passengerRegisterModal');
            // Auto-login after registration
            currentUser = data.user;
            currentRole = 'passenger';
            showModal('passengerDashboardModal');
        } else {
            alert('حدث خطأ أثناء التسجيل');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('حدث خطأ أثناء التسجيل');
    });
}

function handleDriverRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        password: formData.get('password'),
        governorate: formData.get('governorate'),
        vehicleType: formData.get('vehicleType'),
        licensePlate: formData.get('licensePlate'),
        role: 'driver'
    };

    // Simulate registration (in real app, this would call API)
    fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('تم التسجيل بنجاح!');
            closeModal('driverRegisterModal');
            // Auto-login after registration
            currentUser = data.user;
            currentRole = 'driver';
            showModal('driverDashboardModal');
        } else {
            alert('حدث خطأ أثناء التسجيل');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('حدث خطأ أثناء التسجيل');
    });
}

function handleContactForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };

    // Simulate contact form submission
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('تم إرسال الرسالة بنجاح!');
            e.target.reset();
        } else {
            alert('حدث خطأ أثناء إرسال الرسالة');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('حدث خطأ أثناء إرسال الرسالة');
    });
}

// Utility functions
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // In a real app, you would reverse geocode to get address
                // For demo, we'll just show coordinates
                document.getElementById('currentLocation').value = `(${lat.toFixed(6)}, ${lng.toFixed(6)})`;
            },
            function(error) {
                alert('لا يمكن تحديد موقعك');
            }
        );
    } else {
        alert('المتصفح لا يدعم تحديد الموقع');
    }
}

// Navigation functions
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// Initialize the app
function initApp() {
    console.log('Tawseel App initialized');
    // Load any saved user data from localStorage
    const savedUser = localStorage.getItem('tawseelUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        currentUser = user.data;
        currentRole = user.role;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Export functions for other modules
window.showModal = showModal;
window.closeModal = closeModal;
window.showLogin = showLogin;
window.showPassengerRegister = showPassengerRegister;
window.showDriverRegister = showDriverRegister;