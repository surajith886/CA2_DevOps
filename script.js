document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedbackForm');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    const successModal = document.getElementById('successModal');
    const successModalClose = document.getElementById('successModalClose');
    const formStatus = document.getElementById('form-status');
    const charCounter = document.getElementById('charCounter');
    const feedbackTextarea = document.getElementById('feedback');

    const API_BASE =
        window.location.port === '5500' || window.location.port === '8080'
            ? `http://localhost:${window.__FEEDBACK_API_PORT__ || '3000'}`
            : '';

    let modalTimer = null;
    let modalKeyHandler = null;

    function announceStatus(message, isError = false) {
        formStatus.textContent = message;
        formStatus.setAttribute('aria-label', isError ? `Error: ${message}` : `Success: ${message}`);
    }

    function clearErrors() {
        document.querySelectorAll('.error').forEach((el) => {
            el.textContent = '';
            el.classList.remove('active');
        });
        announceStatus('');
    }

    function showError(elementId, message) {
        const errorEl = document.getElementById(`${elementId}Error`);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('active');
        }
        announceStatus(message, true);
        if (elementId === 'gender') {
            document.getElementById('male')?.focus();
            document.querySelector('.gender-group')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            const input = document.getElementById(elementId);
            input?.focus();
            input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function closeSuccessModal() {
        if (modalTimer) {
            clearTimeout(modalTimer);
            modalTimer = null;
        }
        if (modalKeyHandler) {
            document.removeEventListener('keydown', modalKeyHandler);
            modalKeyHandler = null;
        }
        successModal.hidden = true;
        successModal.style.display = 'none';
        document.body.style.overflow = '';
        form.reset();
        clearErrors();
        charCounter.textContent = '0/500';
        charCounter.classList.remove('warning');
        announceStatus('');
        submitBtn.focus();
    }

    function openSuccessModal() {
        successModal.hidden = false;
        successModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        announceStatus('Feedback submitted successfully! Thank you.');
        modalTimer = setTimeout(closeSuccessModal, 5000);
        modalKeyHandler = (ev) => {
            if (ev.key === 'Escape') closeSuccessModal();
        };
        document.addEventListener('keydown', modalKeyHandler);
    }

    successModalClose?.addEventListener('click', closeSuccessModal);

    feedbackTextarea.addEventListener('input', function () {
        const length = this.value.length;
        charCounter.textContent = `${length}/500`;
        if (length > 400) {
            charCounter.classList.add('warning');
            announceStatus(`${500 - length} characters remaining`);
        } else {
            charCounter.classList.remove('warning');
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            mobile: document.getElementById('mobile').value.trim(),
            department: document.getElementById('dept').value,
            gender: document.querySelector('input[name="gender"]:checked')?.value,
            feedback: document.getElementById('feedback').value.trim(),
        };

        if (!formData.name) {
            showError('name', 'Student name is required');
            return;
        }
        if (!formData.email) {
            showError('email', 'Email is required');
            return;
        }
        if (!formData.mobile) {
            showError('mobile', 'Mobile number is required');
            return;
        }
        if (!formData.department) {
            showError('dept', 'Please select your department');
            return;
        }
        if (!formData.gender) {
            showError('gender', 'Please select your gender');
            return;
        }
        if (!formData.feedback) {
            showError('feedback', 'Please provide your feedback comments');
            return;
        }

        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/i;
        if (!emailPattern.test(formData.email)) {
            showError('email', 'Please enter a valid email address');
            return;
        }

        if (!/^[0-9]{10}$/.test(formData.mobile)) {
            showError('mobile', 'Mobile number must be exactly 10 digits');
            return;
        }

        const originalSubmitContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.innerHTML =
            '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> <span>Submitting feedback...</span>';
        announceStatus('Submitting your feedback. Please wait.');

        try {
            const res = await fetch(`${API_BASE}/api/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                const msg = data.message || `Server error (${res.status})`;
                showError('feedback', msg);
                announceStatus(msg, true);
                return;
            }

            openSuccessModal();
        } catch (err) {
            console.error(err);
            showError(
                'feedback',
                'Could not reach the server. Run `npm start` and open http://localhost:3000 — or keep using Live Server with the API on port 3000.'
            );
            announceStatus('Network error. Please try again.', true);
        } finally {
            submitBtn.disabled = false;
            submitBtn.removeAttribute('aria-busy');
            submitBtn.innerHTML = originalSubmitContent;
        }
    });

    resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        form.reset();
        setTimeout(() => {
            clearErrors();
            charCounter.textContent = '0/500';
            charCounter.classList.remove('warning');
            announceStatus('Form has been reset.');
        }, 0);
    });

    ['name', 'email', 'mobile', 'dept', 'feedback'].forEach((id) => {
        const input = document.getElementById(id);
        input?.addEventListener('focus', () => {
            const errorEl = document.getElementById(`${id}Error`);
            if (errorEl) errorEl.textContent = '';
        });
    });

    document.querySelectorAll('input[name="gender"]').forEach((radio) => {
        radio.addEventListener('focus', () => {
            document.getElementById('genderError').textContent = '';
        });
    });
});
