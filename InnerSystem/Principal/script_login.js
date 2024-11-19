document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar envío por defecto

    const email = document.getElementById("email").value;
    const contrasena = document.getElementById("contrasena").value;

    const data = {
        email,
        contrasena
    };

    fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la autenticación');
        }
        return response.json();
    })
    .then(data => {
        console.log('Inicio de sesión exitoso:', data);
        
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al iniciar sesión: ' + error.message);
    });
});
