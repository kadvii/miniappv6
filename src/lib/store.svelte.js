import { doctors as seedDoctors } from './doctors.js';

function createStore() {
    // let doctors = $state(seedDoctors); removed duplicate
    
    // Load initial state from LocalStorage or default
    const storedAppointments = localStorage.getItem('appointments');
    const storedBookedSlots = localStorage.getItem('bookedSlots');
    const storedTheme = localStorage.getItem('theme'); // 'dark' or 'light'
    const storedDoctors = localStorage.getItem('doctors');
    const storedIsAdmin = localStorage.getItem('isAdmin');

    let appointments = $state(storedAppointments ? JSON.parse(storedAppointments) : []);
    let bookedSlots = $state(storedBookedSlots ? JSON.parse(storedBookedSlots) : {});
    let darkMode = $state(storedTheme === 'dark');
    // Initialize doctors from storage OR seed data if empty
    let doctors = $state(storedDoctors ? JSON.parse(storedDoctors) : seedDoctors);
    let isAdmin = $state(storedIsAdmin === 'true');
    let authToken = $state('');

    // Effect to persist appointments and theme
    $effect.root(() => {
        $effect(() => {
            localStorage.setItem('appointments', JSON.stringify(appointments));
        });
        $effect(() => {
            localStorage.setItem('bookedSlots', JSON.stringify(bookedSlots));
        });
        $effect(() => {
            localStorage.setItem('theme', darkMode ? 'dark' : 'light');
            if (darkMode) {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
        });
        $effect(() => {
             localStorage.setItem('doctors', JSON.stringify(doctors));
        });
        $effect(() => {
            localStorage.setItem('isAdmin', isAdmin);
        });
    });

    function toggleTheme() {
        darkMode = !darkMode;
    }

    function login(username, password) {
        if (username === 'admin' && password === 'admin') {
            isAdmin = true;
            return true;
        }
        return false;
    }

    function logout() {
        isAdmin = false;
    }

    function addDoctor(doctor) {
        doctors.push({ ...doctor, id: crypto.randomUUID() });
    }

    function removeDoctor(id) {
        const index = doctors.findIndex(d => d.id === id);
        if (index !== -1) {
            doctors.splice(index, 1);
        }
    }

    function payForAppointment(id) {
        const index = appointments.findIndex(a => a.id === id);
        if (index !== -1) {
            appointments[index].paymentStatus = 'paid';
        }
    }

    function bookAppointment(appointment) {
        // Create a unique key for the slot: doctorId_date_time
        const slotKey = `${appointment.doctorId}_${appointment.date}_${appointment.time}`;

        if (bookedSlots[slotKey]) {
            return { success: false, message: "Slot already booked!" };
        }

        const newAppointment = {
            ...appointment,
            id: crypto.randomUUID(),
            status: 'confirmed',
            paymentStatus: 'pending',
            createdAt: new Date().toISOString()
        };

        appointments.push(newAppointment);
        bookedSlots[slotKey] = true;
        
        return { success: true, message: "Appointment booked successfully!" };
    }

    function cancelAppointment(id) {
        const index = appointments.findIndex(a => a.id === id);
        if (index !== -1) {
            const appt = appointments[index];
            // Don't remove from bookedSlots if we just want to mark as canceled visually,
            // BUT requirements say "cancel (sets status canceled)".
            // Usually canceled appointments free update the slot.
            // Let's decided: "Booking Modal... on submit... mark slot as booked".
            // "Cancel... sets status canceled... does not delete completely".
            // To "Reschedule", we free the old slot.
            // Let's free the slot on cancel so it can be rebooked? 
            // Or typically checking "bookedSlots" prevents double booking.
            // If I cancel, can someone else book it? Yes, logically.
            
            const slotKey = `${appt.doctorId}_${appt.date}_${appt.time}`;
            delete bookedSlots[slotKey]; // Free the slot
            
            appointments[index].status = 'canceled';
            // Trigger reactivity for nested objects/arrays if needed, but push/assignment works in Svelte 5 proxies.
            // However, modifying a property of an object in an array might need care.
            // Svelte 5 proxies should handle this fine.
        }
    }

    function rescheduleAppointment(id, newDate, newTime) {
        const index = appointments.findIndex(a => a.id === id);
        if (index === -1) return { success: false, message: "Appointment not found" };

        const appt = appointments[index];
        const oldSlotKey = `${appt.doctorId}_${appt.date}_${appt.time}`;
        const newSlotKey = `${appt.doctorId}_${newDate}_${newTime}`;

        if (bookedSlots[newSlotKey]) {
            return { success: false, message: "New slot is already booked" };
        }

        // Free old slot
        delete bookedSlots[oldSlotKey];
        
        // Book new slot
        bookedSlots[newSlotKey] = true;

        // Update appointment
        appointments[index].date = newDate;
        appointments[index].time = newTime;
        appointments[index].status = 'confirmed'; // Reset status if it was canceled? Assuming yes.

        return { success: true, message: "Rescheduled successfully" };
    }

    function deleteAppointment(id) {
         const index = appointments.findIndex(a => a.id === id);
         if(index !== -1) {
             const appt = appointments[index];
             // Ensure slot is freed if not already
             const slotKey = `${appt.doctorId}_${appt.date}_${appt.time}`;
             if(bookedSlots[slotKey]) delete bookedSlots[slotKey];

             appointments.splice(index, 1);
         }
    }
    
    function setAuthToken(token) {
        authToken = token;
    }

    // Explicitly return state and methods
    return {
        get doctors() { return doctors; },
        get appointments() { return appointments; },
        get bookedSlots() { return bookedSlots; },
        get darkMode() { return darkMode; },
        get isAdmin() { return isAdmin; },
        get authToken() { return authToken; },
        setAuthToken,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        deleteAppointment,
        toggleTheme,
        addDoctor,
        removeDoctor,
        payForAppointment,
        login,
        logout
    };
}

export const store = createStore();
