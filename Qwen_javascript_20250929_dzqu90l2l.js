// Driver-specific JavaScript functions

// Function to handle search for passengers
function handleSearchPassengers(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const searchData = {
        startLocation: formData.get('startLocation'),
        destination: formData.get('driverDestination'),
        timeFilter: formData.get('timeFilter'),
        governorateFilter: formData.get('governorateFilter'),
        driverId: currentUser.id
    };

    // Simulate search for passengers (in real app, this would call API)
    fetch('/api/trips/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(searchData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayPassengers(data.passengers);
        } else {
            alert('حدث خطأ أثناء البحث عن الركاب');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('حدث خطأ أثناء البحث عن الركاب');
    });
}

// Function to load available passengers
function loadAvailablePassengers() {
    fetch('/api/trips/available', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayPassengers(data.passengers);
        }
    })
    .catch(error => {
        console.error('Error loading passengers:', error);
    });
}

// Function to display passengers
function displayPassengers(passengers) {
    const container = document.getElementById('passengersContainer');
    if (!container) return;

    container.innerHTML = '';

    if (passengers.length === 0) {
        container.innerHTML = '<p>لا توجد ركاب متاحين في هذا الوقت</p>';
        return;
    }

    passengers.forEach(passenger => {
        const passengerElement = document.createElement('div');
        passengerElement.className = 'passenger-item';
        
        passengerElement.innerHTML = `
            <h4>${passenger.passengerName}</h4>
            <div class="passenger-details">
                <p><strong>من:</strong> ${passenger.currentLocation}</p>
                <p><strong>إلى:</strong> ${passenger.destination}</p>
                <p><strong>الوقت:</strong> ${passenger.tripTime}</p>
                <p><strong>الاتصال:</strong> ${passenger.contactPhone}</p>
                <p><strong>الحالة:</strong> <span class="status-${passenger.status}">${getStatusText(passenger.status)}</span></p>
                <button class="btn btn-primary" onclick="acceptPassenger(${passenger.id})">قبول الرحلة</button>
            </div>
        `;
        
        container.appendChild(passengerElement);
    });
}

// Function to accept a passenger
function acceptPassenger(requestId) {
    if (confirm('هل أنت متأكد من قبول هذا الراكب؟')) {
        fetch(`/api/trips/accept/${requestId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({
                driverId: currentUser.id
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('تم قبول الراكب بنجاح');
                loadAvailablePassengers();
            } else {
                alert('حدث خطأ أثناء قبول الراكب');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('حدث خطأ أثناء قبول الراكب');
        });
    }
}

// Function to complete a trip
function completeTrip(tripId) {
    if (confirm('هل أنت متأكد من إكمال هذه الرحلة؟')) {
        fetch(`/api/trips/complete/${tripId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('تم إكمال الرحلة بنجاح');
                loadDriverTrips();
            } else {
                alert('حدث خطأ أثناء إكمال الرحلة');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('حدث خطأ أثناء إكمال الرحلة');
        });
    }
}

// Function to load driver's trips
function loadDriverTrips() {
    fetch('/api/trips/driver/' + currentUser.id, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayDriverTrips(data.trips);
        }
    })
    .catch(error => {
        console.error('Error loading driver trips:', error);
    });
}

// Function to display driver's trips
function displayDriverTrips(trips) {
    const container = document.getElementById('driverTripsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (trips.length === 0) {
        container.innerHTML = '<p>لا توجد رحلات مسجلة</p>';
        return;
    }

    trips.forEach(trip => {
        const tripElement = document.createElement('div');
        tripElement.className = 'trip-item';
        
        tripElement.innerHTML = `
            <h4>رحلة #${trip.id}</h4>
            <div class="trip-details">
                <p><strong>الراكب:</strong> ${trip.passengerName}</p>
                <p><strong>من:</strong> ${trip.currentLocation}</p>
                <p><strong>إلى:</strong> ${trip.destination}</p>
                <p><strong>الحالة:</strong> <span class="status-${trip.status}">${getStatusText(trip.status)}</span></p>
                <p><strong>الاتصال:</strong> ${trip.contactPhone}</p>
                ${trip.status === 'accepted' ? `<button class="btn btn-primary" onclick="completeTrip(${trip.id})">إكمال الرحلة</button>` : ''}
            </div>
        `;
        
        container.appendChild(tripElement);
    });
}

// Function to rate a passenger
function ratePassenger(tripId, rating, comment) {
    fetch('/api/ratings/passenger', {
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
            alert('تم تقييم الراكب بنجاح');
        } else {
            alert('حدث خطأ أثناء التقييم');
        }
    })
    .catch(error => {
        console.error('Error rating passenger:', error);
        alert('حدث خطأ أثناء التقييم');
    });
}

// Function to get auth token
function getAuthToken() {
    return localStorage.getItem('tawseelToken') || '';
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

// Initialize driver dashboard
function initDriverDashboard() {
    console.log('Driver dashboard initialized');
    // Load passengers when dashboard opens
    if (currentUser && currentRole === 'driver') {
        loadAvailablePassengers();
    }
}

// Call initialization when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if this is driver dashboard
    const dashboardModal = document.getElementById('driverDashboardModal');
    if (dashboardModal && dashboardModal.style.display !== 'none') {
        initDriverDashboard();
    }
});

// Add event listener for when driver dashboard modal opens
document.getElementById('driverDashboardModal').addEventListener('click', function(e) {
    if (this.style.display !== 'none') {
        initDriverDashboard();
    }
});

// Export functions
window.handleSearchPassengers = handleSearchPassengers;
window.loadAvailablePassengers = loadAvailablePassengers;
window.displayPassengers = displayPassengers;
window.acceptPassenger = acceptPassenger;
window.completeTrip = completeTrip;
window.loadDriverTrips = loadDriverTrips;
window.displayDriverTrips = displayDriverTrips;
window.ratePassenger = ratePassenger;
window.getAuthToken = getAuthToken;
window.getStatusText = getStatusText;
window.initDriverDashboard = initDriverDashboard;