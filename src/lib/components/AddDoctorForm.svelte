<script>
    import { store } from '../store.svelte.js';
    import { fade, scale } from 'svelte/transition';

    let { onCancel, onSaved } = $props();

    let name = $state('');
    let specialization = $state('');
    let clinic = $state('');
    let fee = $state('');
    let error = $state('');

    // Predefined days for simplicity
    const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    let selectedDays = $state([]);

    function toggleDay(day) {
        if (selectedDays.includes(day)) {
            selectedDays = selectedDays.filter(d => d !== day);
        } else {
            selectedDays = [...selectedDays, day];
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        
        if (!name || !specialization || !clinic || !fee || selectedDays.length === 0) {
            error = 'Please fill in all fields and select at least one available day.';
            return;
        }

        const newDoctor = {
            name,
            specialization,
            clinic,
            rating: 5.0, // Default new rating
            fee: parseInt(fee),
            availableDays: selectedDays
        };

        store.addDoctor(newDoctor);
        onSaved();
    }
</script>

<div class="modal-backdrop" transition:fade>
    <div class="modal-content" in:scale>
        <div class="modal-header">
            <h2>Add New Doctor</h2>
        </div>

        <form onsubmit={handleSubmit}>
            <div class="form-group">
                <label for="doc-name">Name</label>
                <input type="text" id="doc-name" bind:value={name} placeholder="Dr. New Name" required />
            </div>

            <div class="form-group">
                <label for="doc-spec">Specialization</label>
                <input type="text" id="doc-spec" bind:value={specialization} placeholder="e.g. Cardiologist" required />
            </div>

            <div class="form-group">
                <label for="doc-clinic">Clinic Name</label>
                <input type="text" id="doc-clinic" bind:value={clinic} placeholder="e.g. City Hospital" required />
            </div>

            <div class="form-group">
                <label for="doc-fee">Consultation Fee ($)</label>
                <input type="number" id="doc-fee" bind:value={fee} placeholder="100" min="0" required />
            </div>

            <div class="form-group">
                <label>Available Days</label>
                <div class="days-grid">
                    {#each allDays as day}
                        <button 
                            type="button" 
                            class="day-btn {selectedDays.includes(day) ? 'active' : ''}"
                            onclick={() => toggleDay(day)}
                        >
                            {day}
                        </button>
                    {/each}
                </div>
            </div>

            {#if error}
                <div class="error-msg">{error}</div>
            {/if}

            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick={onCancel}>Cancel</button>
                <button type="submit" class="btn-primary">Save Doctor</button>
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
        box-shadow: var(--shadow-lg);
    }

    .modal-header h2 {
        margin: 0 0 1.5rem;
        color: var(--color-primary);
        text-align: center;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--color-text);
    }

    input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-family: inherit;
        font-size: 1rem;
        background: var(--color-white);
        color: var(--color-text);
    }

    .days-grid {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .day-btn {
        padding: 0.5rem;
        border: 1px solid var(--color-border);
        background: var(--color-white);
        border-radius: var(--radius-md);
        cursor: pointer;
        font-size: 0.9rem;
        color: var(--color-text);
    }

    .day-btn.active {
        background: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
    }

    .error-msg {
        color: var(--color-error);
        margin-bottom: 1rem;
        text-align: center;
    }

    .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
    }

    button {
        flex: 1;
        padding: 0.75rem;
        border-radius: var(--radius-md);
        border: none;
        font-weight: 600;
        cursor: pointer;
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
