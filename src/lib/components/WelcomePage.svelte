    import { store } from '../store.svelte.js'; // Ensure store is imported
    import { fade } from 'svelte/transition';

    let { onComplete } = $props();
    let authCode = $state('');

    function authenticate() {
        // Check if 'my' object exists (environment check)
        if (typeof my === 'undefined') {
            alert('Hylid Bridge not found. Are you running in the SuperApp? (Simulating success for dev)');
            store.setAuthToken('dev-token-123'); // Set a mock token for dev
            onComplete(); 
            return;
        }

        my.getAuthCode({
            scopes: ['auth_base', 'USER_ID'],
            success: (res) => {
                authCode = res.authCode;
                // document.getElementById('authCode').textContent = authCode; 

                fetch('https://its.mouamle.space/api/auth-with-superQi', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: authCode
                    })
                }).then(res => res.json()).then(data => {
                    // Assuming data contains the token as 'token' or 'accessToken' or strictly implies the next steps use the authCode? 
                    // The user prompt implies 'token' variable is used later for payment.
                    // We'll optimistically save data.token if it exists, or fall back to authCode if the API is just an echo. 
                    // Given common patterns, it's likely data.token.
                    const tokenToSave = data.token || data.accessToken || authCode;
                    store.setAuthToken(tokenToSave);

                    my.alert({
                        content: "Login successful",
                    });
                    // Navigate to app after success
                    setTimeout(() => {
                        onComplete();
                    }, 1000);
                }).catch(err => {
                    let errorDetails = '';
                    if (err && typeof err === 'object') {
                        errorDetails = JSON.stringify(err, null, 2);
                    } else {
                        errorDetails = String(err);
                    }
                    my.alert({
                        content: "Error: " + errorDetails,
                    });
                });
            },
            fail: (res) => {
                console.log(res.authErrorScopes);
                my.alert({ content: "Auth failed: " + JSON.stringify(res) });
            },
        });
    }

    function copyAuthCode() {
        navigator.clipboard.writeText(authCode);
        alert('Code copied!');
    }
    
    function skipForDev() {
        onComplete();
    }
</script>

<div class="welcome-container" transition:fade>
    <div class="content">
        <h1>Welcome to DoctorBook</h1>
        <p class="intro">
            Connect with top specialists and manage your health journey with ease. 
            Secure, fast, and reliable appointment booking.
        </p>

        <div class="auth-box">
            <button class="btn-primary login-btn" onclick={authenticate}>
                Login with SuperQi
            </button>
            
            {#if authCode}
                <div class="code-display">
                    <p>Auth Code:</p>
                    <code id="authCode">{authCode}</code>
                    <button class="btn-sm" onclick={copyAuthCode}>Copy</button>
                </div>
            {/if}
        </div>

        <!-- Dev Only Link -->
        <button class="btn-link" onclick={skipForDev}>Skip (Dev Mode)</button>
    </div>
</div>

<style>
    .welcome-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: linear-gradient(135deg, var(--color-primary) 0%, #4a90e2 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 5000;
        color: white;
        text-align: center;
        padding: 2rem;
    }

    .content {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        padding: 3rem 2rem;
        border-radius: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        max-width: 500px;
        width: 100%;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        font-weight: 800;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .intro {
        font-size: 1.1rem;
        margin-bottom: 2.5rem;
        line-height: 1.6;
        opacity: 0.9;
    }

    .auth-box {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;
        margin-bottom: 2rem;
    }

    .login-btn {
        background: white;
        color: var(--color-primary);
        font-size: 1.2rem;
        padding: 1rem 2.5rem;
        border-radius: 50px;
        border: none;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        width: 100%;
    }

    .login-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }

    .login-btn:active {
        transform: translateY(0);
    }

    .code-display {
        background: rgba(0,0,0,0.2);
        padding: 1rem;
        border-radius: 8px;
        width: 100%;
        text-align: left;
        word-break: break-all;
    }

    code {
        display: block;
        font-family: monospace;
        background: rgba(0,0,0,0.3);
        padding: 0.5rem;
        border-radius: 4px;
        margin: 0.5rem 0;
    }

    .btn-sm {
        background: rgba(255,255,255,0.2);
        border: 1px solid white;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .btn-link {
        background: none;
        border: none;
        color: rgba(255,255,255,0.6);
        text-decoration: underline;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .btn-link:hover {
        color: white;
    }
</style>
