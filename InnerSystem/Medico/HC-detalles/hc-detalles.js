// Variable global para pacienteId
let pacienteId;

// Obtener el pacienteId al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    pacienteId = urlParams.get('pacienteId'); // Extraer el pacienteId de la URL

    if (!pacienteId) {
        alert('No se encontró el pacienteId en la URL');
        console.error('No se encontró el pacienteId en la URL');
    } else {
        console.log('Paciente ID cargado:', pacienteId);

        // Llamar al backend para obtener los detalles del paciente
        obtenerDetallesPaciente(pacienteId);
    }
});

// Función para obtener los detalles del paciente
async function obtenerDetallesPaciente(pacienteId) {
    if (!pacienteId) return;

    try {
        const response = await fetch(`http://localhost:8080/api/v1/paciente/detalles/${pacienteId}`);

        if (response.ok) {
            const paciente = await response.json();
            console.log('Datos del paciente recibidos:', paciente);

            // Actualizar la UI con los datos del paciente
            actualizarUIPaciente(paciente);
        } else {
            const errorMessage = await response.text();
            console.error('Error al obtener los detalles del paciente:', errorMessage);
            alert('No se pudo cargar la información del paciente.');
        }
    } catch (error) {
        console.error('Error al conectar con el backend:', error);
        alert('Ocurrió un error al obtener la información del paciente.');
    }
}

// Actualizar la interfaz de usuario con los datos del paciente
function actualizarUIPaciente(paciente) {
    const nombreElem = document.querySelector('.info-card .nombres');
    const apellidoElem = document.querySelector('.info-card .apellidos');
    const shortDataElem = document.querySelector('.info-card .short-data');
    const descriptionElem = document.querySelector('.info-card .description');
    const direccionElem = document.querySelector('.info-card .bx-home').nextElementSibling;
    const emailElem = document.querySelector('.info-card .bx-envelope').nextElementSibling;
    const telefonoElem = document.querySelector('.info-card .bx-phone').nextElementSibling;

    if (nombreElem) nombreElem.textContent = paciente.nombre || 'Nombre no disponible';
    if (apellidoElem) apellidoElem.textContent = paciente.apellido || 'Apellido no disponible';
    if (shortDataElem) {
        const generoEdad = `${paciente.genero || 'Género no disponible'}, ${calcularEdad(paciente.fechaNacimiento)} años`;
        shortDataElem.textContent = generoEdad;
    }
    if (descriptionElem) descriptionElem.textContent = paciente.descripcion || 'Sin descripción';
    if (direccionElem) direccionElem.textContent = paciente.direccion || 'Sin dirección';
    if (emailElem) emailElem.textContent = paciente.email || 'Sin correo electrónico';
    if (telefonoElem) telefonoElem.textContent = paciente.telefono || 'Sin teléfono';
}

// Función para calcular la edad
function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return 'Edad no disponible';
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }
    return edad;
}

// Manejo del formulario de antecedente
const formularioAntecedente = document.querySelector('form');
const btnCancelar = document.querySelector('.btn-cancel');

formularioAntecedente.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita el envío tradicional del formulario

    // Recoger los datos del formulario
    const tipo = document.querySelector('#cita').value;
    const estado = document.querySelector('#estado').value;
    const descripcion = document.querySelector('#examen').value;
    const detalle = document.querySelector('#detalle').value;

    if (!pacienteId) {
        alert('No se ha encontrado el paciente ID.');
        return;
    }

    // Crear el objeto para enviar al backend
    const antecedenteData = {
        pacienteId: pacienteId,
        tipo: tipo,
        estado: estado,
        descripcion: descripcion,
        anotacion: detalle,
        fechaRegistro: new Date().toISOString()
    };

    try {
        const response = await fetch('http://localhost:8080/api/v1/antecedentes/crearAntecedente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(antecedenteData),
        });

        if (response.ok) {
            const nuevoAntecedente = await response.json();
            alert('Antecedente creado correctamente.');
            console.log('Antecedente creado:', nuevoAntecedente);
            cerrarModal(); // Cerrar el modal si la creación fue exitosa
        } else {
            const errorData = await response.json();
            alert('Error al crear el antecedente: ' + errorData.message);
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Ocurrió un error al crear el antecedente.');
    }
});

// Funciones para manejar los modales
const btnAbrirModal = document.querySelector("#btn-abrir-modal");
const btnCerrarModal = document.querySelector("#btn-cerrar-modal");
const antcdModal = document.querySelector("#antcd-modal");

function abrirModal() {
    antcdModal.style.display = "flex";
}

function cerrarModal() {
    antcdModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target === antcdModal) {
        cerrarModal();
    }
};

btnCancelar.addEventListener('click', () => cerrarModal());
