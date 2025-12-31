<script>
    import { fade } from 'svelte/transition';
    let { message, type = 'success', duration = 3000, onDismiss } = $props();

    $effect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onDismiss();
            }, duration);
            return () => clearTimeout(timer);
        }
    });
</script>

{#if message}
    <div class="toast {type}" transition:fade>
        {message}
    </div>
{/if}

<style>
    .toast {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        color: white;
        font-weight: 500;
        box-shadow: var(--shadow-md);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }

    .success {
        background-color: var(--color-success);
    }

    .error {
        background-color: var(--color-error);
    }

    @keyframes slideIn {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
</style>
