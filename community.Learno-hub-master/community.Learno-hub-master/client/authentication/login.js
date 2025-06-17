function validate() {
    const data = {
        username: $('#username').val(),
        password: $('#password').val()
    };

    // Ensure envData is defined (loaded via /env.js)
    if (typeof envData === 'undefined' || !envData.API_URL) {
        console.error('API URL not found. Check if /env.js is loaded.');
        return;
    }

    fetch(envData.API_URL + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        // Save token
        sessionStorage.setItem('token', data.token);

        // Load and display redirected page
        return fetch(data.redirectLink);
    })
    .then(response => response.text())
    .then(htmlText => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // Replace <body> content only
        document.body.innerHTML = doc.body.innerHTML;

        // OPTIONAL: re-run necessary scripts from loaded content
        const scripts = doc.querySelectorAll('script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.textContent;
            }
            document.body.appendChild(newScript);
        });
    })
    .catch(error => {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    });
}
