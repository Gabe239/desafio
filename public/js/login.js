document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    try {
      const response = await fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (result.status === 'success') {
        // Redirect to the home page after successful login
        window.location.replace('/');
      } else {
        // Handle login failure (display error message, etc.)
        alert('Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      // Handle any network errors or exceptions during login
      alert('An error occurred during login.');
      console.error('Login error:', error);
    }
  });
});