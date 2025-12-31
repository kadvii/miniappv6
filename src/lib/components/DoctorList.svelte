<script>
    import DoctorCard from './DoctorCard.svelte';
    import { store } from '../store.svelte.js';

    let { onSelectDoctor } = $props();

    let searchTerm = $state('');
    let selectedSpecialization = $state('All');

    // Get unique specializations
    let specializations = $derived(['All', ...new Set(store.doctors.map(d => d.specialization))]);

    // Derived filtered doctors
    let filteredDoctors = $derived(store.doctors.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpec = selectedSpecialization === 'All' || doc.specialization === selectedSpecialization;
        return matchesSearch && matchesSpec;
    }));
</script>

<div class="doctor-list-container">
    <div class="filters">
        <input 
            type="text" 
            placeholder="Search doctors..." 
            bind:value={searchTerm}
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

<style>
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
