<script>
    import { fade } from 'svelte/transition';
    
    let { doctor, onBack, onBook } = $props();

    const stats = [
        { label: 'Patients', value: '1000+' },
        { label: 'Experience', value: '10 Years' },
        { label: 'Rating', value: doctor.rating },
        { label: 'Reviews', value: '500+' }
    ];

    // Simulate simplified slots for display
    const timeSlots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'];
</script>

<div class="details-container" in:fade={{ duration: 200 }}>
    <button class="back-btn" onclick={onBack}>
        ← Back to list
    </button>

    <div class="details-card">
        <div class="header-section">
            <div class="avatar-lg">{doctor.name.charAt(0)}</div>
            <div class="main-info">
                <h1>{doctor.name}</h1>
                <p class="spec">{doctor.specialization}</p>
                <p class="clinic">🏥 {doctor.clinic}</p>
            </div>
            <div class="fee-badge">
                ${doctor.fee}/hr
            </div>
        </div>

        <div class="stats-grid">
            {#each stats as stat}
                <div class="stat-item">
                    <span class="value">{stat.value}</span>
                    <span class="label">{stat.label}</span>
                </div>
            {/each}
        </div>

        <div class="about-section">
            <h3>About Doctor</h3>
            <p>
                {doctor.name} is a dedicated {doctor.specialization} with extensive experience in treating various conditions.
                Committed to providing excellent medical care at {doctor.clinic}.
            </p>
        </div>

        <div class="schedule-preview">
            <h3>Available Days</h3>
            <div class="days-row">
                {#each doctor.availableDays as day}
                    <span class="day-badge">{day}</span>
                {/each}
            </div>
            
            <h3>Typical Slots</h3>
            <div class="slots-grid">
                {#each timeSlots as time}
                    <span class="slot-badge">{time}</span>
                {/each}
            </div>
        </div>

        <div class="action-footer">
            <button class="book-btn" onclick={() => onBook(doctor)}>
                Book Appointment
            </button>
        </div>
    </div>
</div>

<style>
    .details-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 800px;
        margin: 0 auto;
    }

    .back-btn {
        align-self: flex-start;
        background: none;
        border: none;
        color: var(--color-primary);
        font-weight: 600;
        cursor: pointer;
        padding: 0.5rem 0;
    }

    .details-card {
        background: var(--color-white);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .header-section {
        display: flex;
        gap: 1.5rem;
        align-items: center;
        position: relative;
    }

    .avatar-lg {
        width: 80px;
        height: 80px;
        background-color: var(--color-primary-light);
        color: var(--color-primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: 700;
    }

    .main-info h1 {
        margin: 0;
        font-size: 1.5rem;
        color: var(--color-text);
    }

    .spec {
        color: var(--color-primary);
        font-weight: 500;
        margin: 0.25rem 0;
    }

    .clinic {
        color: var(--color-text-muted);
        font-size: 0.9rem;
    }

    .fee-badge {
        margin-left: auto;
        background-color: var(--color-bg);
        padding: 0.5rem 1rem;
        border-radius: var(--radius-md);
        font-weight: 700;
        color: var(--color-text);
        font-size: 1.1rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        padding: 1.5rem 0;
        border-top: 1px solid var(--color-border);
        border-bottom: 1px solid var(--color-border);
    }

    .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
    }

    .stat-item .value {
        font-weight: 700;
        font-size: 1.1rem;
        color: var(--color-primary);
    }

    .stat-item .label {
        font-size: 0.8rem;
        color: var(--color-text-light);
    }

    .about-section h3, .schedule-preview h3 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        color: var(--color-text);
    }

    .about-section p {
        line-height: 1.6;
        color: var(--color-text-muted);
    }

    .days-row {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .day-badge {
        background: var(--color-primary-light);
        color: var(--color-primary);
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
    }

    .slots-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        gap: 0.5rem;
    }

    .slot-badge {
        text-align: center;
        border: 1px solid var(--color-border);
        padding: 0.5rem;
        border-radius: var(--radius-md);
        font-size: 0.85rem;
        color: var(--color-text);
    }

    .action-footer {
        margin-top: 1rem;
    }

    .book-btn {
        width: 100%;
        background-color: var(--color-primary);
        color: white;
        padding: 1rem;
        border: none;
        border-radius: var(--radius-md);
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .book-btn:hover {
        background-color: var(--color-primary-dark);
    }

    @media (max-width: 600px) {
        .header-section {
            flex-direction: column;
            text-align: center;
        }
        .fee-badge {
            margin: 0;
            width: 100%;
            text-align: center;
        }
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>
