<script>
    import { store } from '../store.svelte.js';
    import LoginModal from './LoginModal.svelte';

    let { currentTab, onTabChange } = $props();

    let showLoginModal = $state(false);
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
        
        {#if store.isAdmin}
            <span class="admin-badge">Admin</span>
            <button onclick={store.logout}>Logout</button>
        {:else}
            <button onclick={() => showLoginModal = true}>Login</button>
        {/if}
    </nav>
</header>

{#if showLoginModal}
    <LoginModal 
        onCancel={() => showLoginModal = false}
        onLoginSuccess={() => showLoginModal = false}
    />
{/if}

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
        align-items: center;
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
        white-space: nowrap; /* Prevent awkward word breaks */
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

    .admin-badge {
        background-color: var(--color-error);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-sm);
        font-size: 0.8rem;
        font-weight: bold;
        align-self: center;
    }

    /* Mobile Responsive Styles */
    @media (max-width: 768px) {
        .app-header {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem 0.5rem;
        }

        .logo {
            font-size: 1.25rem;
        }

        nav {
            width: 100%;
            justify-content: center;
            gap: 0.5rem;
            flex-wrap: wrap; 
        }

        button {
            font-size: 0.9rem;
            padding: 0.4rem 0.8rem;
        }
    }
</style>
