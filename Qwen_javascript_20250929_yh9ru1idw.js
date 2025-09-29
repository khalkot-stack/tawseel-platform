// Passenger-specific JavaScript functions

// Function to handle trip requests
function handleRequestTrip(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const tripData = {
        currentLocation: formData.get('currentLocation'),
        destination: formData.get('destination'),
        tripTime: formData.get('tripTime'),
        contactPhone: formData.get('contactPhone'),
        passengerId: currentUser.id,
        status: 'pending'
    };

    // Simulate trip request (in real app, this would call API)
    fetch('/api/trips/request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(tripData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('تم إرسال طلب الرحلة بنجاح!');
            e.target.reset();
            loadPassengerRequests();
        } else {
            alert('حدث خطأ أثناء إرسال طلب الرحلة');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('حدث خطأ أثناء إرسال طلب الرحلة');
    });
}

// Function to load passenger requests
function loadPassengerRequests() {
    fetch('/api/trips/passenger/' + currentUser.id, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayRequests(data.requests);
        }
    })
    .catch(error => {
        console.error('Error loading requests:', error);
    });
}

// Function to display requests
function displayRequests(requests) {
    const container = document.getElementById('requestsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (requests.length === 0) {
        container.innerHTML = '<p>لا توجد طلبات رحلات</p>';
        return;
    }

    requests.forEach(request => {
        const requestElement = document.createElement('div');
        requestElement.className = 'request-item';
        
        requestElement.innerHTML = `
            <h4>طلب رحلة #${request.id}</h4>
            <div class="request-details">
                <p><strong>من:</strong> ${request.currentLocation}</p>
                <p><strong>إلى:</strong> ${request.destination}</p>
                <p><strong>الوقت:</strong> ${request.tripTime}</p>
                <p><strong>الحالة:</strong> <span class="status-${request.status}">${getStatusText(request.status)}</span></p>
                <p><strong>الاتصال:</strong> ${request.contactPhone}</p>
            </div>
        `;
        
        container.appendChild(requestElement);
    });
}

// Function to get status text
function getStatusText(status) {
    const statusMap = {
        'pending': 'في الانتظار',
        'accepted': 'مقبول',
        'completed': 'مكتمل',
        'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
}

// Function to get auth token
function getAuthToken() {
    return localStorage.getItem('tawseelToken') || '';
}

// Function to cancel a request
function cancelRequest(requestId) {
    if (confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) {
        fetch(`/api/trips/cancel/${requestId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('تم إلغاء الطلب بنجاح');
                loadPassengerRequests();
            } else {
                alert('حدث خطأ أثناء إلغاء الطلب');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('حدث خطأ أثناء إلغاء الطلب');
        });
    }
}

// Function to update request status when driver accepts
function updateRequestStatus(requestId, newStatus) {
    fetch(`/api/trips/update/${requestId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
            status: newStatus
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadPassengerRequests();
        }
    })
    .catch(error => {
        console.error('Error updating status:', error);
    });
}

// Function to rate a driver
function rateDriver(tripId, rating, comment) {
    fetch('/api/ratings/driver', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
            tripId: tripId,
            rating: rating,
            comment: comment
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('تم تقييم الناقل بنجاح');
        } else {
            alert('حدث خطأ أثناء التقييم');
        }
    })
    .catch(error => {
        console.error('Error rating driver:', error);
        alert('حدث خطأ أثناء التقييم');
    });
}

// Initialize passenger dashboard
function initPassengerDashboard() {
    console.log('Passenger dashboard initialized');
    // Load requests when dashboard opens
    if (currentUser && currentRole === 'passenger') {
        loadPassengerRequests();
    }
}

// Call initialization when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if this is passenger dashboard
    const dashboardModal = document.getElementById('passengerDashboardModal');
    if (dashboardModal && dashboardModal.style.display !== 'none') {
        initPassengerDashboard();
    }
});

// Add event listener for when passenger dashboard modal opens
document.getElementById('passengerDashboardModal').addEventListener('click', function(e) {
    if (this.style.display !== 'none') {
        initPassengerDashboard();
    }
});

// Export functions
window.handleRequestTrip = handleRequestTrip;
window.loadPassengerRequests = loadPassengerRequests;
window.displayRequests = displayRequests;
window.getStatusText = getStatusText;
window.cancelRequest = cancelRequest;
window.updateRequestStatus = updateRequestStatus;
window.rateDriver = rateDriver;
window.initPassengerDashboard = initPassengerDashboard;