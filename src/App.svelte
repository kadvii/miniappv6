<script>
    import { store } from './lib/store.svelte.js';
    import Header from './lib/components/Header.svelte';
    import DoctorList from './lib/components/DoctorList.svelte';
    import DoctorDetails from './lib/components/DoctorDetails.svelte';
    import BookingForm from './lib/components/BookingForm.svelte';
    import AppointmentCard from './lib/components/AppointmentCard.svelte';
    import Toast from './lib/components/Toast.svelte';
    import WelcomePage from './lib/components/WelcomePage.svelte';

    let currentTab = $state('home'); // 'home' | 'appointments'
    let showWelcome = $state(true);
    let selectedDoctor = $state(null); // When viewing details
    let isBooking = $state(false); // When modal is open
    let editingAppointment = $state(null); // For rescheduling

    let toastMessage = $state('');
    let toastType = $state('success');

    function showToast(msg, type = 'success') {
        toastMessage = msg;
        toastType = type;
    }

    function onTabChange(tab) {
        currentTab = tab;
        selectedDoctor = null;
        isBooking = false;
        window.scrollTo(0, 0);
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

{#if showWelcome}
    <WelcomePage onComplete={() => showWelcome = false} />
{:else}
    <Header {currentTab} {onTabChange} />

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
                <!-- Pass current date if needed, or DoctorList handles it -->
                <DoctorList onSelectDoctor={handleSelectDoctor} />
            {/if}

        {:else if currentTab === 'appointments'}
            <div class="container container-margin">
                <h2>My Appointments</h2>
                {#if store.appointments.length === 0}
                    <div class="empty-state">
                        <p>No appointments booked yet.</p>
                        <button class="btn-primary" onclick={() => currentTab = 'home'}>Find a Doctor</button>
                    </div>
                {:else}
                    <div class="appointments-grid">
                        {#each store.appointments as appointment (appointment.id)}
                            <AppointmentCard 
                                {appointment} 
                                onCancel={handleCancelAppointment} 
                                onReschedule={handleRescheduleRequest}
                            />
                        {/each}
                    </div>
                {/if}
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
{/if}

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

    /* .appointments-view removed as we use simple container now */

    .appointments-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
    }

    .empty-state {
        text-align: center;
        padding: 4rem;
        color: var(--color-text-light);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .container-margin {
        margin-top: 0;
    }
    
    .btn-primary {
         background-color: var(--color-primary);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
    }
</style>
