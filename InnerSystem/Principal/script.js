document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario

    const email = document.getElementById('email').value;
    const password = document.getElementById('contrasena').value;

    fetch('http://localhost:8080/api/v1/auth/login', { // Asegúrate de que la URL sea correcta
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            contrasena: password, 
        }),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Error en el inicio de sesión');
    })
    .then(data => {
   
        console.log(data);
        document.getElementById('message').textContent = 'Inicio de sesión exitoso';
    })
    .catch(error => {
        console.error(error);
        document.getElementById('message').textContent = 'Credenciales incorrectas';
    });
});
