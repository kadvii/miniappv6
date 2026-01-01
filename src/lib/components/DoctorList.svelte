<script>
    import DoctorCard from './DoctorCard.svelte';
    import AddDoctorForm from './AddDoctorForm.svelte';
    import Toast from './Toast.svelte'; // Assuming global toast is handled in App, but if we need local... usually pass callback.
    // App handles global toast via simple state in App.svelte usually.
    // Let's pass "onDoctorAdded" callback which helps.
    
    import { store } from '../store.svelte.js';

    let { onSelectDoctor } = $props();

    // Removed local searchTerm, using store.searchTerm
    let selectedSpecialization = $state('All');
    let isAdding = $state(false);

    // Get unique specializations
    let specializations = $derived(['All', ...new Set(store.doctors.map(d => d.specialization))]);

    // Derived filtered doctors
    let filteredDoctors = $derived(store.doctors.filter(doc => {
        const term = store.searchTerm || '';
        const matchesSearch = doc.name.toLowerCase().includes(term.toLowerCase());
        const matchesSpec = selectedSpecialization === 'All' || doc.specialization === selectedSpecialization;
        return matchesSearch && matchesSpec;
    }));
</script>

<div class="doctor-list-container">
    <div class="list-header">
        <h2>Available Doctors</h2>
        {#if store.isAdmin}
            <button class="add-btn" onclick={() => isAdding = true}>+ Add Doc</button>
        {/if}
    </div>

    <div class="filters">
        <input 
            type="text" 
            placeholder="Search doctors..." 
            bind:value={store.searchTerm}
            class="search-input"
        />
        <div class="tags">
            {#each specializations as spec}
                <button 
                    class="tag {selectedSpecialization === spec ? 'active' : ''}"
                    onclick={() => selectedSpecialization = spec}
                >
                    {spec}
                </button>
            {/each}
        </div>
    </div>

    <div class="grid">
        {#each filteredDoctors as doctor (doctor.id)}
            <DoctorCard {doctor} onSelect={onSelectDoctor} />
        {/each}
        {#if filteredDoctors.length === 0}
            <div class="empty-state">
                <p>No doctors found matching your criteria.</p>
            </div>
        {/if}
    </div>
</div>

{#if isAdding}
    <AddDoctorForm 
        onCancel={() => isAdding = false}
        onSaved={() => isAdding = false}
    />
{/if}

<style>
    .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .list-header h2 {
        margin: 0;
        color: var(--color-primary-dark);
    }

    .add-btn {
        background-color: var(--color-primary);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
    }

    .doctor-list-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .filters {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        background: var(--color-white);
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
    }

    .search-input {
        padding: 0.75rem 1rem;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: 1rem;
        outline: none;
        transition: border-color 0.2s;
    }

    .search-input:focus {
        border-color: var(--color-primary);
    }

    .tags {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .tag {
        padding: 0.5rem 1rem;
        border: 1px solid var(--color-border);
        background: var(--color-white);
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.2s;
        color: var(--color-text-muted);
        font-size: 0.9rem;
    }

    .tag.active {
        background: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
    }

    .tag:hover:not(.active) {
        background: var(--color-bg);
        border-color: var(--color-text-light);
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        color: var(--color-text-light);
    }
</style>
