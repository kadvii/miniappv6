<script>
    let { doctor, onSelect } = $props();
</script>

<div class="doctor-card" onclick={() => onSelect(doctor)}>
    <div class="card-header">
        <div class="avatar">{doctor.name.charAt(0)}</div>
        <div class="info">
            <h3>{doctor.name}</h3>
            <span class="specialization">{doctor.specialization}</span>
        </div>
    </div>
    <div class="card-body">
        <p class="clinic">🏥 {doctor.clinic}</p>
        <p class="rating">⭐ {doctor.rating} Rating</p>
        <p class="fee">💰 ${doctor.fee} Consultation</p>
    </div>
    <div class="card-footer">
        <button class="btn-outline">View Profile</button>
    </div>
</div>

<style>
    .doctor-card {
        background: white;
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        box-shadow: var(--shadow-sm);
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: pointer;
        border: 1px solid var(--color-border);
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .doctor-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
    }

    .card-header {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .avatar {
        width: 50px;
        height: 50px;
        background-color: var(--color-primary-light);
        color: var(--color-primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        font-weight: 700;
    }

    .info h3 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--color-text);
    }

    .specialization {
        color: var(--color-text-light);
        font-size: 0.9rem;
    }

    .card-body {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-size: 0.95rem;
        color: var(--color-text-muted);
    }

    .btn-outline {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--color-primary);
        background: transparent;
        color: var(--color-primary);
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-outline:hover {
        background: var(--color-primary);
        color: white;
    }
</style>
