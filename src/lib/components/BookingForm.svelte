<script>
    import { store } from '../store.svelte.js';
    import { fade, scale } from 'svelte/transition';

    let { doctor, existingAppointment = null, onCancel, onBooked } = $props();

    let name = $state(existingAppointment?.patientName || '');
    let phone = $state(existingAppointment?.patientPhone || '');
    let date = $state(existingAppointment?.date || '');
    let selectedTime = $state(existingAppointment?.time || '');
    let notes = $state(existingAppointment?.notes || '');
    
    let error = $state('');

    // Available time slots (fixed list for simulation)
    const timeSlots = ['10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

    function isSlotBooked(t) {
        if (!date) return false;
        // If it's the same slot as the existing appointment, it's not "booked" (it's ours)
        if (existingAppointment && date === existingAppointment.date && t === existingAppointment.time) return false;
        
        const key = `${doctor.id}_${date}_${t}`;
        return !!store.bookedSlots[key];
    }

    function handleSubmit(e) {
        e.preventDefault();
        
        if (!name || !phone || !date || !selectedTime) {
            error = 'Please fill in all required fields.';
            return;
        }

        // Basic phone validation (digits check)
        if (!/^\d{7,15}$/.test(phone.replace(/\D/g, ''))) {
            error = 'Please enter a valid phone number.';
            return;
        }

        if (existingAppointment) {
            // Reschedule logic
            const result = store.rescheduleAppointment(existingAppointment.id, date, selectedTime);
             if (result.success) {
                onBooked();
            } else {
                error = result.message;
            }
        } else {
            // New Booking Logic
            const appointment = {
                doctorId: doctor.id,
                doctorName: doctor.name,
                doctorSpec: doctor.specialization,
                patientName: name,
                patientPhone: phone,
                date,
                time: selectedTime,
                notes
            };

            const result = store.bookAppointment(appointment);
            if (result.success) {
                onBooked();
            } else {
                error = result.message;
            }
        }
    }

    // Reset error on input change
    $effect(() => { 
        if(name || phone || date || selectedTime) error = ''; 
    });
</script>

<div class="modal-backdrop" transition:fade>
    <div class="modal-content" in:scale>
        <div class="modal-header">
            <h2>{existingAppointment ? 'Reschedule Appointment' : 'Book Appointment'}</h2>
            <p>with {doctor.name}</p>
            {#if existingAppointment}
                <small class="reschedule-note">Updating booking for {existingAppointment.patientName}</small>
            {/if}
        </div>

        <form onsubmit={handleSubmit}>
            <div class="form-group">
                <label for="name">Patient Name *</label>
                <input type="text" id="name" bind:value={name} placeholder="John Doe" required />
            </div>

            <div class="form-group">
                <label for="phone">Phone Number *</label>
                <input type="tel" id="phone" bind:value={phone} placeholder="555-0123" required />
            </div>

            <div class="form-group">
                <label for="date">Date *</label>
                <input type="date" id="date" bind:value={date} min={new Date().toISOString().split('T')[0]} required />
            </div>

            <div class="form-group">
                <label>Time Slot *</label>
                <div class="slots-container">
                    {#each timeSlots as t}
                        <button 
                            type="button" 
                            class="slot-btn {selectedTime === t ? 'active' : ''} {isSlotBooked(t) ? 'disabled' : ''}"
                            disabled={isSlotBooked(t)}
                            onclick={() => selectedTime = t}
                        >
                            {t}
                        </button>
                    {/each}
                </div>
                {#if !date}
                    <small class="hint">Select a date to see availability.</small>
                {/if}
            </div>

            <div class="form-group">
                <label for="notes">Notes (Optional)</label>
                <textarea id="notes" bind:value={notes} rows="2"></textarea>
            </div>

            {#if error}
                <div class="error-msg">{error}</div>
            {/if}

            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick={onCancel}>Cancel</button>
                <button type="submit" class="btn-primary">Confirm Booking</button>
            </div>
        </form>
    </div>
</div>

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(4px);
    }

    .modal-content {
        background: var(--color-white);
        padding: 2rem;
        border-radius: var(--radius-lg);
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: var(--shadow-lg);
    }

    .modal-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .modal-header h2 {
        margin: 0;
        color: var(--color-primary);
    }

    .modal-header p {
        margin: 0;
        color: var(--color-text-muted);
    }

    .form-group {
        margin-bottom: 1.25rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--color-text);
        font-size: 0.95rem;
    }

    input, textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-family: inherit;
        font-size: 1rem;
        outline: none;
        transition: border-color 0.2s;
    }

    input:focus, textarea:focus {
        border-color: var(--color-primary);
    }

    .slots-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
        gap: 0.5rem;
    }

    .slot-btn {
        padding: 0.5rem;
        border: 1px solid var(--color-border);
        background: var(--color-white);
        border-radius: var(--radius-md);
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s;
    }

    .slot-btn:hover:not(.disabled) {
        border-color: var(--color-primary);
        color: var(--color-primary);
    }

    .slot-btn.active {
        background: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
    }

    .slot-btn.disabled {
        background: var(--color-bg);
        color: var(--color-text-light);
        cursor: not-allowed;
        text-decoration: line-through;
    }

    .hint {
        color: var(--color-text-light);
        font-size: 0.85rem;
    }

    .error-msg {
        color: var(--color-error);
        background: #fff0f0;
        padding: 0.75rem;
        border-radius: var(--radius-md);
        margin-bottom: 1rem;
        text-align: center;
        font-size: 0.9rem;
    }

    .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }

    button {
        flex: 1;
        padding: 0.75rem;
        border-radius: var(--radius-md);
        border: none;
        font-weight: 600;
        cursor: pointer;
        font-size: 1rem;
    }

    .btn-secondary {
        background: var(--color-bg);
        color: var(--color-text);
    }

    .btn-primary {
        background: var(--color-primary);
        color: white;
    }
</style>
