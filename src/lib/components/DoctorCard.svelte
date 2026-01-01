<script>
    import { store } from '../store.svelte.js';
    
    let { doctor, onSelect } = $props();

    function handleDelete(e) {
        e.stopPropagation(); // Prevent card selection when clicking delete
        if(confirm(`Are you sure you want to remove Dr. ${doctor.name}?`)) {
            store.removeDoctor(doctor.id);
        }
    }
</script>

<div 
    class="doctor-card" 
    onclick={() => onSelect(doctor)}
    onkeydown={(e) => e.key === 'Enter' && onSelect(doctor)}
    role="button"
    tabindex="0"
>
    {#if store.isAdmin}
        <button class="delete-btn" onclick={handleDelete} title="Remove Doctor">×</button>
    {/if}
    <div class="header">
        <h3>{doctor.name}</h3>
        <span class="rating">★ {doctor.rating}</span>
    </div>
    <div class="card-body">
        <p class="clinic">🏥 {doctor.clinic}</p>
        <p class="fee">💰 ${doctor.fee} Consultation</p>
    </div>
    <div class="card-footer">
        <button class="btn-outline">View Profile</button>
    </div>
</div>

<style>
    .doctor-card {
        background: var(--color-white);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        box-shadow: var(--shadow-sm);
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: pointer;
        border: 1px solid transparent; /* Changed */
        position: relative; /* For absolute delete button */
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .doctor-card:hover {
        transform: translateY(-2px); /* Changed */
        box-shadow: var(--shadow-md);
        border-color: var(--color-primary-light); /* Added */
    }
    
    .delete-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: var(--color-error);
        color: white;
        border: none;
        border-radius: 50%;
        width: 32px; /* Increased from 24px */
        height: 32px; /* Increased from 24px */
        font-size: 20px; /* Increased from 16px */
        line-height: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.8;
    }
    
    .delete-btn:hover {
        opacity: 1;
        transform: scale(1.1);
    }

    .header { /* This was 'card-header' in the original, but 'header' in the instruction's context. Assuming 'header' is correct based on the HTML structure. */
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
