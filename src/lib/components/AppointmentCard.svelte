<script>
    import { store } from '../store.svelte.js';
    import { fade } from 'svelte/transition';

    let { appointment, onCancel, onReschedule } = $props();

    function getStatusColor(status) {
        switch (status) {
            case 'confirmed': return 'status-confirmed';
            case 'paid': return 'status-paid';
            case 'canceled': return 'status-canceled';
            default: return 'status-default';
        }
    }

    function handlePay() {
        // Use user provided function structure
        const token = store.authToken;
        
        if (typeof my === 'undefined') {
             // Dev / Desktop Fallback
             alert(`Simulating Hylid Pay for ${appointment.doctorFee}...`);
             store.payForAppointment(appointment.id);
             return;
        }

        fetch('https://its.mouamle.space/api/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            // Note: User snippet had no body. Assuming backend knows what to charge or returns a generic test link.
            // If we needed to send amount: body: JSON.stringify({ amount: appointment.doctorFee })
        }).then(res => res.json()).then(data => {
             // my.tradePay logic from user
            my.tradePay({
                paymentUrl: data.url, // User snippet expected data.url
                success: (res) => {
                    my.alert({
                        content: "Payment successful",
                    });
                    store.payForAppointment(appointment.id); // Update UI
                },
                fail: (res) => {
                     my.alert({
                        content: "Payment failed (Bridge Fail): " + JSON.stringify(res),
                    });
                }
            });
        }).catch(err => {
            let errorDetails = String(err);
            my.alert({
                content: "Payment Error: " + errorDetails,
            });
        });
    }
</script>

<div class="appt-card" transition:fade>
    <div class="appt-header">
        <div class="date-time">
            <span class="day">{new Date(appointment.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            <span class="time">{appointment.time}</span>
        </div>
        <div class="status-badge {getStatusColor(appointment.status)}">
            {appointment.status}
        </div>
        {#if appointment.paymentStatus === 'paid'}
            <div class="status-badge status-paid" style="margin-left: 0.5rem;">PAID</div>
        {/if}
    </div>
    
    <div class="appt-body">
        <h3>{appointment.doctorName}</h3>
        <p class="spec">{appointment.doctorSpec}</p>
        <div class="patient-info">
            <small>Patient:</small> <span>{appointment.patientName}</span>
        </div>
        {#if appointment.notes}
            <div class="notes">
                <small>Notes:</small> <p>{appointment.notes}</p>
            </div>
        {/if}
    </div>

    <div class="appt-actions">
        {#if appointment.status !== 'canceled'}
            {#if appointment.paymentStatus !== 'paid'}
                 <button class="btn-pay" onclick={handlePay}>
                    Pay ${appointment.doctorFee || '0'}
                 </button>
            {/if}
            <button class="btn-text" onclick={() => onReschedule(appointment)}>Reschedule</button>
            <button class="btn-text danger" onclick={() => onCancel(appointment.id)}>Cancel</button>
        {/if}
    </div>
</div>

<style>
    .appt-card {
        background: var(--color-white);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
        border-left: 4px solid var(--color-primary);
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .appt-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .date-time {
        display: flex;
        flex-direction: column;
    }

    .day {
        font-weight: 700;
        color: var(--color-text);
    }

    .time {
        color: var(--color-primary);
        font-weight: 600;
        font-size: 1.1rem;
    }

    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        text-transform: capitalize;
        font-weight: 500;
    }

    .status-confirmed {
        background-color: var(--color-success-light);
        color: var(--color-success);
    }
    
    .status-paid {
        background-color: #dbeafe; /* Blue 100 */
        color: #1d4ed8; /* Blue 700 */
    }

    .status-canceled {
        background-color: var(--color-bg);
        color: var(--color-text-light);
    }

    .appt-body h3 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--color-text);
    }

    .spec {
        margin: 0.25rem 0 0.5rem;
        color: var(--color-text-muted);
        font-size: 0.9rem;
    }

    .patient-info {
        display: flex;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: var(--color-text);
    }

    .notes {
        margin-top: 0.5rem;
        font-size: 0.85rem;
        color: var(--color-text-muted);
        background: var(--color-bg);
        padding: 0.5rem;
        border-radius: var(--radius-sm);
    }
    
    .notes p { margin: 0; }

    .appt-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 0.5rem;
        border-top: 1px solid var(--color-border);
        padding-top: 0.75rem;
    }

    .btn-pay {
        background-color: var(--color-primary);
        color: white;
        border: none;
        padding: 0.6rem 1rem; /* Larger */
        border-radius: var(--radius-sm);
        cursor: pointer;
        font-weight: 600;
        font-size: 0.95rem;
        margin-right: auto;
    }

    .btn-text {
        background: none;
        border: 1px solid transparent; /* Ensure box model integrity */
        cursor: pointer;
        font-weight: 600;
        font-size: 0.95rem;
        color: var(--color-primary);
        padding: 0.6rem 1rem; /* Larger touch target */
        border-radius: var(--radius-sm);
        transition: background-color 0.2s;
    }

    .btn-text:hover {
        background: var(--color-primary-light);
    }

    .btn-text.danger {
        color: var(--color-error);
    }

    .btn-text.danger:hover {
        background: #fff0f0;
    }
</style>
