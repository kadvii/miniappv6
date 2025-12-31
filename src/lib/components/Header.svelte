<script>
    import { store } from '../store.svelte.js';
    let { currentTab, onTabChange } = $props();
</script>

<header class="app-header">
    <div class="logo">DoctorBook</div>
    <nav>
        <button 
            class:active={currentTab === 'home'} 
            onclick={() => onTabChange('home')}
        >
            Home
        </button>
        <button 
            class:active={currentTab === 'appointments'} 
            onclick={() => onTabChange('appointments')}
        >
            My Appointments
        </button>
        <button class="theme-btn" onclick={store.toggleTheme} aria-label="Toggle Dark Mode">
            {store.darkMode ? '☀️' : '🌙'}
        </button>
    </nav>
</header>

<style>
    .app-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background-color: var(--color-white);
        box-shadow: var(--shadow-sm);
        position: sticky;
        top: 0;
        z-index: 100;
    }

    .logo {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-primary);
    }

    nav {
        display: flex;
        gap: 1rem;
    }

    button {
        background: none;
        border: none;
        font-size: 1rem;
        font-weight: 500;
        color: var(--color-text-light);
        cursor: pointer;
        padding: 0.5rem 1rem;
        border-radius: var(--radius-md);
        transition: all 0.2s;
    }

    button:hover {
        background-color: var(--color-bg);
        color: var(--color-primary);
    }

    button.active {
        background-color: var(--color-primary-light);
        color: var(--color-primary);
        font-weight: 600;
    }

    .theme-btn {
        font-size: 1.25rem;
        padding: 0.25rem 0.75rem;
    }
</style>
