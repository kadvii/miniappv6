import { doctors as seedDoctors } from './doctors.js';

function createStore() {
    let doctors = $state(seedDoctors);
    
    // Load initial state from LocalStorage or default
    const storedAppointments = localStorage.getItem('appointments');
    const storedBookedSlots = localStorage.getItem('bookedSlots');
    const storedTheme = localStorage.getItem('theme'); // 'dark' or 'light'

    let appointments = $state(storedAppointments ? JSON.parse(storedAppointments) : []);
    let bookedSlots = $state(storedBookedSlots ? JSON.parse(storedBookedSlots) : {});
    let darkMode = $state(storedTheme === 'dark');

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
    });

    function toggleTheme() {
        darkMode = !darkMode;
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
    
    // Explicitly return state and methods
    return {
        get doctors() { return doctors; },
        get appointments() { return appointments; },
        get bookedSlots() { return bookedSlots; },
        get darkMode() { return darkMode; },
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        deleteAppointment,
        toggleTheme
    };
}

export const store = createStore();
