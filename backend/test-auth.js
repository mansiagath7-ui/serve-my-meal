const API_URL = 'http://localhost:5000/api/auth';

const testAuth = async () => {
    try {
        console.log('--- Auth Backend Test ---');

        // 1. Register Admin
        console.log('\nTesting Admin Registration...');
        const adminData = {
            name: "Main Admin",
            email: "admin_" + Date.now() + "@servemymeal.com",
            password: "password123",
            role: "admin"
        };
        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(adminData)
            });
            const data = await res.json();
            console.log('✅ Admin registration result:', data.success, data.message || '');
        } catch (e) {
            console.log('Admin registration failed:', e.message);
        }

        // 2. Try duplicate Admin
        console.log('\nTesting Duplicate Admin check...');
        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...adminData, email: "another_admin@servemymeal.com" })
            });
            const data = await res.json();
            console.log(data.success ? '❌ Error: Duplicate admin allowed!' : '✅ Correctly blocked duplicate admin:', data.message);
        } catch (e) {
            console.log('Error during check:', e.message);
        }

        // 3. Register Customer
        console.log('\nTesting Customer Registration...');
        const customerEmail = "customer_" + Date.now() + "@example.com";
        const customerData = {
            name: "John Doe",
            email: customerEmail,
            password: "password123",
            role: "customer"
        };
        const resCust = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customerData)
        });
        const dataCust = await resCust.json();
        console.log('✅ Customer registered:', dataCust.success);

        // 4. Login
        console.log('\nTesting Login...');
        const resLogin = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: customerEmail,
                password: "password123"
            })
        });
        const dataLogin = await resLogin.json();
        console.log('✅ Login success! JWT received:', !!dataLogin.token);
        const token = dataLogin.token;

        // 5. Get Me (Protected)
        console.log('\nTesting Protected Route (Get Me)...');
        const resMe = await fetch(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const dataMe = await resMe.json();
        console.log('✅ Get Me success! User name:', dataMe.data.name);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
};

testAuth();
