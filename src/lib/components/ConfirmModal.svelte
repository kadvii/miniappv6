<script>
    import { fade, scale } from 'svelte/transition';

    let { message, title = 'Confirm Action', onConfirm, onCancel, confirmText = 'Yes', cancelText = 'No' } = $props();
</script>

<div class="modal-backdrop" transition:fade>
    <div class="modal-content" in:scale>
        <h3>{title}</h3>
        <p>{message}</p>
        <div class="actions">
            <button class="btn-cancel" onclick={onCancel}>{cancelText}</button>
            <button class="btn-confirm" onclick={onConfirm}>{confirmText}</button>
        </div>
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
        z-index: 3000;
        backdrop-filter: blur(2px);
        padding: 1rem;
    }

    .modal-content {
        background: var(--color-white);
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        width: 100%;
        max-width: 320px; /* Small width for mobile */
        box-shadow: var(--shadow-lg);
        text-align: center;
        border: 1px solid var(--color-border);
    }

    h3 {
        margin: 0 0 0.5rem;
        color: var(--color-text);
        font-size: 1.25rem;
    }

    p {
        margin-bottom: 1.5rem;
        color: var(--color-text-light);
        line-height: 1.5;
    }

    .actions {
        display: flex;
        gap: 1rem;
        justify-content: stretch;
    }

    button {
        flex: 1;
        padding: 0.8rem; /* Larger touch target */
        border: none;
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        font-size: 1rem;
        transition: transform 0.1s;
    }

    button:active {
        transform: scale(0.96);
    }

    .btn-cancel {
        background: var(--color-bg);
        color: var(--color-text);
    }

    .btn-confirm {
        background: var(--color-primary);
        color: white;
    }
</style>
