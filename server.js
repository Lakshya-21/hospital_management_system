const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// MODIFIED: Updated dates to September 2025
let patients = [
    { id: 'P001', name: 'John Smith', age: 45, phone: '555-0101', email: 'john@email.com', address: '123 Main St', createdAt: '2025-09-01T10:00:00Z' },
    { id: 'P002', name: 'Sarah Johnson', age: 32, phone: '555-0102', email: 'sarah@email.com', address: '456 Oak Ave', createdAt: '2025-09-05T14:30:00Z' },
    { id: 'P003', name: 'Mike Wilson', age: 28, phone: '555-0103', email: 'mike@email.com', address: '789 Pine Rd', createdAt: '2025-09-10T09:15:00Z' }
];

// MODIFIED: Updated appointments with September 2025 dates
let appointments = [
    { id: 'A001', patientId: 'P001', patientName: 'John Smith', doctor: 'Dr. Saumy', date: '2025-09-20', time: '10:00', reason: 'Regular checkup', status: 'scheduled', createdAt: '2025-09-01T10:00:00Z' },
    { id: 'A002', patientId: 'P002', patientName: 'Sarah Johnson', doctor: 'Dr. Johnson', date: '2025-09-21', time: '14:30', reason: 'Follow-up', status: 'completed', createdAt: '2025-09-05T14:30:00Z' },
    { id: 'A003', patientId: 'P003', patientName: 'Mike Wilson', doctor: 'Dr. Saumy', date: '2025-09-22', time: '09:15', reason: 'Consultation', status: 'scheduled', createdAt: '2025-09-10T09:15:00Z' },
    { id: 'A004', patientId: 'P001', patientName: 'John Smith', doctor: 'Dr. Johnson', date: '2025-09-23', time: '11:00', reason: 'Check-up', status: 'completed', createdAt: '2025-09-11T11:00:00Z' },
    { id: 'A005', patientId: 'P002', patientName: 'Sarah Johnson', doctor: 'Dr. Saumy', date: '2025-09-24', time: '15:00', reason: 'Consultation', status: 'scheduled', createdAt: '2025-09-12T15:00:00Z' }
];

let staff = [
    { id: 'S001', name: 'Dr. Saumy', role: 'doctor', department: 'Cardiology', phone: '123-456-7890', email: 'dr.saumy@hospital.com', salary: 150000 },
    { id: 'S002', name: 'Dr. Johnson', role: 'doctor', department: 'General Medicine', phone: '123-456-7891', email: 'dr.johnson@hospital.com', salary: 140000 },
    { id: 'S003', name: 'Vansh Kumar', role: 'receptionist', department: 'Administration', phone: '123-456-7892', email: 'vansh@hospital.com', salary: 45000 },
    { id: 'S004', name: 'Akhil Sharma', role: 'pharmacist', department: 'Pharmacy', phone: '123-456-7893', email: 'akhil@hospital.com', salary: 55000 }
];

// MODIFIED: Updated billing with September 2025 dates and ₹ currency
let billing = [
    { id: 'B001', patientId: 'P001', patientName: 'John Smith', medicineId: 'M001', medicineName: 'Paracetamol', quantity: 2, unitPrice: 5.50, description: 'Paracetamol - 2 units', amount: 11.00, discount: 0, tax: 0.94, total: 11.94, status: 'paid', date: '2025-09-01', createdAt: '2025-09-01T10:00:00Z' },
    { id: 'B002', patientId: 'P002', patientName: 'Sarah Johnson', medicineId: 'M002', medicineName: 'Amoxicillin', quantity: 1, unitPrice: 12.75, description: 'Amoxicillin - 1 unit', amount: 12.75, discount: 0, tax: 1.08, total: 13.83, status: 'paid', date: '2025-09-02', createdAt: '2025-09-02T11:00:00Z' },
    { id: 'B003', patientId: 'P003', patientName: 'Mike Wilson', medicineId: 'M001', medicineName: 'Paracetamol', quantity: 3, unitPrice: 5.50, description: 'Paracetamol - 3 units', amount: 16.50, discount: 0, tax: 1.40, total: 17.90, status: 'pending', date: '2025-09-03', createdAt: '2025-09-03T12:00:00Z' }
];

// MODIFIED: Updated medicines with September 2025 expiry dates
let medicines = [
    { id: 'M001', name: 'Paracetamol', category: 'Painkiller', stock: 95, price: 5.50, expiry: '2026-09-30', supplier: 'PharmaCorp', createdAt: new Date().toISOString() },
    { id: 'M002', name: 'Amoxicillin', category: 'Antibiotic', stock: 49, price: 12.75, expiry: '2026-09-15', supplier: 'MediSupply', createdAt: new Date().toISOString() },
    { id: 'M003', name: 'Ibuprofen', category: 'Anti-inflammatory', stock: 75, price: 8.25, expiry: '2026-08-20', supplier: 'HealthPlus', createdAt: new Date().toISOString() },
    { id: 'M004', name: 'Aspirin', category: 'Painkiller', stock: 120, price: 4.75, expiry: '2027-01-15', supplier: 'PharmaCorp', createdAt: new Date().toISOString() }
];

// Users for authentication
const users = [
    { id: 1, username: 'admin', password: bcrypt.hashSync('admin123', 10), role: 'admin', name: 'Lakshya' },
    { id: 2, username: 'doctor', password: bcrypt.hashSync('doctor123', 10), role: 'doctor', name: 'Dr. Saumy' },
    { id: 3, username: 'receptionist', password: bcrypt.hashSync('recept123', 10), role: 'receptionist', name: 'Vansh' },
    { id: 4, username: 'pharmacist', password: bcrypt.hashSync('pharm123', 10), role: 'pharmacist', name: 'Akhil' }
];

// ID generators
let patientIdCounter = 4;
let appointmentIdCounter = 6;
let staffIdCounter = 5;
let billingIdCounter = 4;
let medicineIdCounter = 5;

// Auth middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Authentication Routes
app.post('/api/auth/login', async (req, res) => {
    const { username, password, role } = req.body;

    const user = users.find(u => u.username === username && u.role === role);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role
        }
    });
});

// MODIFIED: Dashboard Stats with fixed appointment calculation logic
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    // FIXED: Calculate average appointments per day based on unique dates
    const appointmentDates = [...new Set(appointments.map(apt => apt.date))];
    const totalAppointments = appointments.length;
    const avgAppointmentsPerDay = appointmentDates.length > 0 ? (totalAppointments / appointmentDates.length) : 0;
    
    // Calculate total revenue from paid bills only
    const totalRevenue = billing
        .filter(b => b.status === 'paid')
        .reduce((sum, bill) => sum + bill.total, 0);

    res.json({
        totalPatients: patients.length,
        totalStaff: staff.length,
        avgAppointmentsPerDay: parseFloat(avgAppointmentsPerDay.toFixed(2)),
        totalAppointments: totalAppointments,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalBilling: billing.reduce((sum, bill) => sum + bill.total, 0)
    });
});

// Patient Routes
app.get('/api/patients', authenticateToken, (req, res) => {
    // Only receptionist and admin can view all patients
    if (!['receptionist', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    res.json(patients);
});

app.get('/api/patients/:id', authenticateToken, (req, res) => {
    if (!['receptionist', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    const patient = patients.find(p => p.id === req.params.id);
    if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
});

app.post('/api/patients', authenticateToken, (req, res) => {
    // Only receptionist can add patients
    if (req.user.role !== 'receptionist') {
        return res.status(403).json({ error: 'Receptionist access required' });
    }

    const { name, age, phone, email, address, emergency } = req.body;
    
    if (!name || !age || !phone) {
        return res.status(400).json({ error: 'Name, age, and phone are required' });
    }

    const newPatient = {
        id: `P${String(patientIdCounter++).padStart(3, '0')}`,
        name,
        age: parseInt(age),
        phone,
        email: email || '',
        address: address || '',
        emergency: emergency || '',
        createdAt: new Date().toISOString()
    };

    patients.push(newPatient);
    res.status(201).json(newPatient);
});

app.delete('/api/patients/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    const index = patients.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Patient not found' });
    }

    patients.splice(index, 1);
    res.json({ message: 'Patient deleted successfully' });
});

// Appointment Routes
app.get('/api/appointments', authenticateToken, (req, res) => {
    // Doctors and receptionists can view appointments
    if (!['doctor', 'receptionist'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    res.json(appointments);
});

app.post('/api/appointments', authenticateToken, (req, res) => {
    // Only receptionist can create appointments
    if (req.user.role !== 'receptionist') {
        return res.status(403).json({ error: 'Receptionist access required' });
    }

    const { patientId, doctor, date, time, reason } = req.body;

    if (!patientId || !doctor || !date || !time) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
    }

    const newAppointment = {
        id: `A${String(appointmentIdCounter++).padStart(3, '0')}`,
        patientId,
        patientName: patient.name,
        doctor,
        date,
        time,
        reason: reason || 'General consultation',
        status: 'scheduled',
        createdAt: new Date().toISOString()
    };

    appointments.push(newAppointment);
    res.status(201).json(newAppointment);
});

app.patch('/api/appointments/:id/status', authenticateToken, (req, res) => {
    if (!['doctor', 'receptionist'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { status } = req.body;
    const appointment = appointments.find(a => a.id === req.params.id);

    if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
    }

    appointment.status = status;
    res.json(appointment);
});

// Staff Routes
app.get('/api/staff', authenticateToken, (req, res) => {
    // FIXED: Allow both admin and receptionist to access staff data for doctor dropdown
    if (!['admin', 'receptionist'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    res.json(staff);
});

app.post('/api/staff', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    const { name, role, department, phone, email, salary } = req.body;

    if (!name || !role || !department || !phone || !email || !salary) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newStaff = {
        id: `S${String(staffIdCounter++).padStart(3, '0')}`,
        name,
        role,
        department,
        phone,
        email,
        salary: parseFloat(salary),
        createdAt: new Date().toISOString()
    };

    staff.push(newStaff);
    res.status(201).json(newStaff);
});

app.delete('/api/staff/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    const index = staff.findIndex(s => s.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Staff member not found' });
    }

    staff.splice(index, 1);
    res.json({ message: 'Staff member deleted successfully' });
});

// Billing Routes
app.get('/api/billing', authenticateToken, (req, res) => {
    if (!['admin', 'receptionist'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    res.json(billing);
});

app.post('/api/billing', authenticateToken, (req, res) => {
    // Only receptionist can create bills
    if (req.user.role !== 'receptionist') {
        return res.status(403).json({ error: 'Receptionist access required' });
    }

    const { patientId, medicineId, quantity, description } = req.body;

    if (!patientId || !medicineId || !quantity) {
        return res.status(400).json({ error: 'Patient, medicine, and quantity are required' });
    }

    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
    }

    const medicine = medicines.find(m => m.id === medicineId);
    if (!medicine) {
        return res.status(404).json({ error: 'Medicine not found' });
    }

    if (medicine.stock < quantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
    }

    const amount = medicine.price * quantity;
    const discount = 0;
    const tax = 8.5;
    const discountAmount = amount * (discount / 100);
    const subtotal = amount - discountAmount;
    const taxAmount = subtotal * (tax / 100);
    const total = subtotal + taxAmount;

    const newBill = {
        id: `B${String(billingIdCounter++).padStart(3, '0')}`,
        patientId,
        patientName: patient.name,
        medicineId,
        medicineName: medicine.name,
        quantity,
        unitPrice: medicine.price,
        description: description || `${medicine.name} - ${quantity} units`,
        amount,
        discount: discountAmount,
        tax: taxAmount,
        total,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
    };

    // Update medicine stock
    medicine.stock -= quantity;

    billing.push(newBill);
    res.status(201).json(newBill);
});

app.patch('/api/billing/:id/status', authenticateToken, (req, res) => {
    if (!['admin', 'receptionist'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { status } = req.body;
    const bill = billing.find(b => b.id === req.params.id);

    if (!bill) {
        return res.status(404).json({ error: 'Bill not found' });
    }

    bill.status = status;
    res.json(bill);
});

// Medicine Routes
app.get('/api/medicines', authenticateToken, (req, res) => {
    // All roles can view medicines for different purposes
    res.json(medicines);
});

app.post('/api/medicines', authenticateToken, (req, res) => {
    // Only pharmacist can add medicines
    if (req.user.role !== 'pharmacist') {
        return res.status(403).json({ error: 'Pharmacist access required' });
    }

    const { name, category, stock, price, expiry, supplier } = req.body;

    if (!name || !category || stock === undefined || !price || !expiry || !supplier) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newMedicine = {
        id: `M${String(medicineIdCounter++).padStart(3, '0')}`,
        name,
        category,
        stock: parseInt(stock),
        price: parseFloat(price),
        expiry,
        supplier,
        createdAt: new Date().toISOString()
    };

    medicines.push(newMedicine);
    res.status(201).json(newMedicine);
});

app.patch('/api/medicines/:id/stock', authenticateToken, (req, res) => {
    // Only pharmacist can update stock
    if (req.user.role !== 'pharmacist') {
        return res.status(403).json({ error: 'Pharmacist access required' });
    }

    const { stock, operation } = req.body;
    const medicine = medicines.find(m => m.id === req.params.id);

    if (!medicine) {
        return res.status(404).json({ error: 'Medicine not found' });
    }

    if (operation === 'add') {
        medicine.stock += parseInt(stock);
    } else if (operation === 'subtract') {
        medicine.stock = Math.max(0, medicine.stock - parseInt(stock));
    } else if (operation === 'set') {
        medicine.stock = parseInt(stock);
    }

    res.json(medicine);
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Hospital Management System API running on http://localhost:${PORT}`);
    console.log('Default login credentials:');
    console.log('Admin: admin/admin123 (Lakshya)');
    console.log('Doctor: doctor/doctor123 (Dr. Saumy)');
    console.log('Receptionist: receptionist/recept123 (Vansh)');
    console.log('Pharmacist: pharmacist/pharm123 (Akhil)');
});