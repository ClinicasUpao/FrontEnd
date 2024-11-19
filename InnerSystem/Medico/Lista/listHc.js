// Obtener las citas del día desde el backend
async function obtenerCitasDelDia() {
    try {
        const token = localStorage.getItem('token'); // Obtener el token
        if (!token) {
            throw new Error('Token no encontrado. Por favor, inicie sesión.');
        }

        const response = await fetch('http://localhost:8080/api/v1/medical/hoy', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const citas = await response.json(); // Parsear la respuesta JSON
        mostrarCitasEnTabla(citas); // Mostrar las citas en la tabla

    } catch (error) {
        console.error('Error:', error);
        mostrarErrorEnTabla(); // Mostrar error si hay problemas
    }
}

// Mostrar las citas en la tabla HTML
function mostrarCitasEnTabla(citas) {
    const tablaBody = document.querySelector('table tbody');
    tablaBody.innerHTML = ''; // Limpiar las filas existentes

    if (citas.length === 0) {
        const fila = document.createElement('tr');
        fila.innerHTML = `<td colspan="6" style="text-align: center;">No hay citas para hoy</td>`;
        tablaBody.appendChild(fila);
        return;
    }

    citas.forEach(cita => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${cita.nombre}</td>
            <td>${cita.apellido}</td>
            <td>${cita.documentoIdentidad}</td>
            <td>${cita.genero}</td>
            <td>${cita.edad} años</td>
            <td>
                <a href="/InnerSystem/Medico/HC-detalles/hc-detalles.html?pacienteId=${cita.pacienteId}">
                    <i class='bx bx-chevron-right'></i>
                </a>
            </td>
        `;
        tablaBody.appendChild(fila);
    });
}

// Mostrar un mensaje de error si no hay citas
function mostrarErrorEnTabla() {
    const tablaBody = document.querySelector('table tbody');
    tablaBody.innerHTML = '';

    const fila = document.createElement('tr');
    fila.innerHTML = `<td colspan="6" style="text-align: center; color: red;">Parece que hoy no tenemos citas registradas.</td>`;
    tablaBody.appendChild(fila);
}

// Función para crear la historia clínica de un paciente
async function crearHistoriaClinica(pacienteId, historiaClinica) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token no encontrado. Por favor, inicie sesión.');
        }

        const response = await fetch(`http://localhost:8080/api/v1/historias/crear/${pacienteId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(historiaClinica) // Enviar datos de la historia clínica
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        const historiaCreada = await response.json();
        alert('Historia clínica creada con éxito');
        console.log(historiaCreada);

    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
}

// Función para verificar el acceso a la historia clínica de un paciente
async function verificarAccesoHistoriaClinica(pacienteId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token no encontrado. Por favor, inicie sesión.');
        }

        const response = await fetch(`http://localhost:8080/api/v1/pacientes/historiaClinica/${pacienteId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 403) {
            alert('Acceso no autorizado a los datos del paciente.');
            window.location.href = '/InnerSystem/Medico/pacientes.html'; // Redirigir si no tiene acceso
        } else if (response.ok) {
            const historiaClinica = await response.json();
            mostrarDetallesHistoriaClinica(historiaClinica); // Mostrar los detalles
        } else {
            const error = await response.json();
            alert(error.message || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema con la verificación del acceso.');
    }
}

// Mostrar los detalles de la historia clínica del paciente
function mostrarDetallesHistoriaClinica(historiaClinica) {
    console.log(historiaClinica); // Aquí puedes hacer que muestre los datos de manera más amigable en la UI
}

// Obtener el pacienteId de la URL para verificar acceso a la historia clínica
const urlParams = new URLSearchParams(window.location.search);
const pacienteId = urlParams.get('pacienteId');

if (pacienteId) {
    verificarAccesoHistoriaClinica(pacienteId); // Verificar acceso usando el pacienteId
} else {
    alert('No se proporcionó un paciente válido');
}

// Cargar las citas cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    obtenerCitasDelDia(); // Obtener las citas del día al cargar la página
});

// Evento para crear una historia clínica cuando se haga clic en el botón
document.querySelector('#crearHistoriaBtn').addEventListener('click', () => {
    const pacienteId = 1; // Este ID puede ser dinámico dependiendo de la implementación
    const historiaClinica = {
        descripcion: 'Descripción de la historia clínica',
    };
    crearHistoriaClinica(pacienteId, historiaClinica);
});
