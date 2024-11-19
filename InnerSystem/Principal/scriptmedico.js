document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    // Obtener los valores de los campos
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const contrasena = document.getElementById("contrasena").value;
    const dia = document.getElementById("dia").value;
    const mes = document.getElementById("mes").value;
    const anio = document.getElementById("anio").value;
    const genero = document.getElementById("genero").value;
    const paisOrigen = document.getElementById("paisOrigen").value;
    const departamento = document.getElementById("departamento").value;
    const distrito = document.getElementById("distrito").value;
    const direccion = document.getElementById("direccion").value;
    const documentoIdentidad = document.getElementById("documentoIdentidad").value;
    const colegiatura = document.getElementById("colegiatura").value;

    const data = {
        nombre,
        apellido,
        email,
        contrasena,
        fechaNacimiento: `${anio}-${mes}-${dia}`,
        genero,
        paisOrigen,
        departamento,
        distrito,
        direccion,
        documentoIdentidad,
        colegiatura
    };
    fetch('http://localhost:8080/api/v1/auth/registro/medico', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la conexión: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Registro exitoso:', data);
       
        window.location.href = 'login.html';
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error al registrar: ' + error.message);
    });
});
