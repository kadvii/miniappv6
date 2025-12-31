<script>
    import { store } from './lib/store.svelte.js';
    import Header from './lib/components/Header.svelte';
    import DoctorList from './lib/components/DoctorList.svelte';
    import DoctorDetails from './lib/components/DoctorDetails.svelte';
    import BookingForm from './lib/components/BookingForm.svelte';
    import AppointmentCard from './lib/components/AppointmentCard.svelte';
    import Toast from './lib/components/Toast.svelte';

    let currentTab = $state('home'); // 'home' | 'appointments'
    let selectedDoctor = $state(null); // When viewing details
    let isBooking = $state(false); // When modal is open
    let editingAppointment = $state(null); // For rescheduling

    let toastMessage = $state('');
    let toastType = $state('success');

    function showToast(msg, type = 'success') {
        toastMessage = msg;
        toastType = type;
    }

    function handleSelectDoctor(doctor) {
        selectedDoctor = doctor;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleBackToHome() {
        selectedDoctor = null;
    }

    function handleStartBooking(doctor) {
        selectedDoctor = doctor; // Ensure selected
        editingAppointment = null;
        isBooking = true;
    }

    function handleRescheduleRequest(appointment) {
        // Find doctor for this appointment to pass to form
        const doctor = store.doctors.find(d => d.id === appointment.doctorId);
        if (doctor) {
            selectedDoctor = doctor;
            editingAppointment = appointment;
            isBooking = true;
        } else {
            showToast("Doctor info not found!", "error");
        }
    }

    function handleBookingComplete() {
        isBooking = false;
        editingAppointment = null;
        selectedDoctor = null; // Go back to list or stay? Usually back to home or appointments.
        currentTab = 'appointments'; // Auto switch to appointments view
        showToast(editingAppointment ? "Rescheduled successfully!" : "Booked successfully!");
    }

    function handleCancelAppointment(id) {
        if (confirm("Are you sure you want to cancel this appointment?")) {
            store.cancelAppointment(id);
            showToast("Appointment canceled.", "success");
        }
    }

    function handleCancelBooking() {
        isBooking = false;
        editingAppointment = null;
    }
</script>

<Header 
    {currentTab} 
    onTabChange={(tab) => {
        currentTab = tab;
        selectedDoctor = null;
        isBooking = false;
        window.scrollTo(0, 0);
    }} 
/>

<main>
    {#if currentTab === 'home'}
        {#if selectedDoctor}
            <DoctorDetails 
                doctor={selectedDoctor} 
                onBack={handleBackToHome}
                onBook={handleStartBooking}
            />
        {:else}
            <div class="hero">
                <h1>Find Your Doctor</h1>
                <p>Book appointments with the best specialists in your city.</p>
            </div>
            <DoctorList onSelectDoctor={handleSelectDoctor} />
        {/if}

    {:else if currentTab === 'appointments'}
        <div class="appointments-view">
            <h1>My Appointments</h1>
            <div class="appointments-list">
                {#each store.appointments as appt (appt.id)}
                    <AppointmentCard 
                        appointment={appt} 
                        onCancel={handleCancelAppointment} 
                        onReschedule={handleRescheduleRequest}
                    />
                {/each}
                {#if store.appointments.length === 0}
                    <div class="empty-msg">
                        <p>No appointments yet.</p>
                        <button class="btn-link" onclick={() => currentTab = 'home'}>Book one now</button>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</main>

{#if isBooking && selectedDoctor}
    <BookingForm 
        doctor={selectedDoctor}
        existingAppointment={editingAppointment}
        onCancel={handleCancelBooking}
        onBooked={handleBookingComplete}
    />
{/if}

<Toast 
    message={toastMessage} 
    type={toastType} 
    onDismiss={() => toastMessage = ''} 
/>

<style>
    main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
        min-height: 80vh;
    }

    .hero {
        text-align: center;
        margin-bottom: 3rem;
    }

    .hero h1 {
        font-size: 2.5rem;
        color: var(--color-primary-dark);
        margin-bottom: 0.5rem;
    }

    .hero p {
        color: var(--color-text-muted);
        font-size: 1.1rem;
    }

    .appointments-view {
        max-width: 800px;
        margin: 0 auto;
    }

    .appointments-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-top: 2rem;
    }

    .empty-msg {
        text-align: center;
        padding: 4rem;
        color: var(--color-text-light);
    }

    .btn-link {
        background: none;
        border: none;
        color: var(--color-primary);
        text-decoration: underline;
        cursor: pointer;
        font-size: 1rem;
    }
</style>
