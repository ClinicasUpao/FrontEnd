fetch('http://localhost:8080/api/v1/paciente/lista-citas', {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token') 
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('Error al obtener las citas');
    }
    return response.json();
})
.then(data => {
    const citasContainer = document.querySelector('.historial .main-card');
    citasContainer.innerHTML = ''; // Limpiar contenedor antes de agregar citas

    if (Array.isArray(data) && data.length > 0) {
        displayCitas(data); // Solo llama a displayCitas si hay citas
    } else {
        citasContainer.innerHTML = '<p>No tienes citas registradas.</p>';
    }
})
.catch(error => {
    console.error("Error al obtener las citas:", error);
    alert("Hubo un problema al obtener tus citas. Intenta nuevamente.");
});


function displayCitas(citas) {
    const citasContainer = document.querySelector('.historial .main-card');
    
    // Filtrar las citas por estado
    const citasPendientes = citas.filter(cita => cita.estado === 'PENDIENTE');
    const citasCanceladas = citas.filter(cita => cita.estado === 'CANCELADA');
    const citasPasadas = citas.filter(cita => cita.estado === 'PASADA');
    const citasFaltan = citas.filter(cita => cita.estado === 'FALTA');

    citasContainer.innerHTML = ''; // Limpiar contenedor antes de agregar citas
    function crearCitas(citas, citaClass) {
        citas.forEach(cita => {
            const citaCard = document.createElement('div');
            citaCard.classList.add('card-body');
            citaCard.id = `cita-${cita.id}`; // Añadir un id único
            citaCard.innerHTML = `
                <div class="cita-card ${citaClass}">
                    <h5>${new Date(cita.fechaHora).toLocaleString()}</h5>
                    <div class="cita-detalles">
                        <p>Cita con el <strong>${cita.nombrePaciente} ${cita.apellidoPaciente}</strong> a las ${new Date(cita.fechaHora).toLocaleTimeString()} en el <strong>${cita.tipoAtencion}</strong></p>
                        <p><strong>Motivo:</strong> ${cita.motivo} <strong>| ${cita.estado}</strong></p>    
                    </div>
                    <div class="marco-img">
                        <img class="img-profile" src="/imgs/profile.png" alt="imagen de perfil">
                    </div>
                    <button class="btn-cancelar" onclick="cancelarCita(${cita.id})">Cancelar Cita</button>
                </div>
            `;
            citasContainer.appendChild(citaCard);
        });
    }
    
    
    // Primero agregamos las citas pendientes
    if (citasPendientes.length > 0) {
        crearCitas(citasPendientes, 'pendiente');
    } else {
        citasContainer.innerHTML += '<p>No tienes citas pendientes.</p>';
    }

    // Luego agregamos las citas canceladas
    if (citasCanceladas.length > 0) {
        crearCitas(citasCanceladas, 'cancelada');
    } else {
        citasContainer.innerHTML += '<p>No tienes citas canceladas.</p>';
    }

    // Agregar las citas pasadas
    if (citasPasadas.length > 0) {
        crearCitas(citasPasadas, 'pasada');
    } else {
        citasContainer.innerHTML += '<p>No tienes citas pasadas.</p>';
    }

    // Agregar las citas faltantes
    if (citasFaltan.length > 0) {
        crearCitas(citasFaltan, 'falta');
    } else {
        citasContainer.innerHTML += '<p>No tienes citas faltantes.</p>';
    }
}
function cancelarCita(citaId) {
    if (!confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
        return; 
    }

    fetch(`http://localhost:8080/api/v1/paciente/cancelar-cita/${citaId}`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ motivo: 'Motivo de la cancelación' })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cancelar la cita');
        }
        return response.json();
    })
    .then(data => {
        alert("Cita cancelada exitosamente.");
        window.location.reload();
    })
    .catch(error => {
        console.error("Error al cancelar la cita:", error);
        alert("Hubo un problema al cancelar tu cita. Intenta nuevamente.");
    });
}



function obtenerFechaActual() {
            const fecha = new Date();
            const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
            const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
            document.getElementById('fecha-actual').textContent = fechaFormateada;
        }

    
        async function obtenerNombrePaciente() {
            try {
                const response = await fetch('http://localhost:8080/api/v1/paciente/usuario', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('No se pudo obtener el nombre del paciente');
                }

                const usuario = await response.json(); 
                document.getElementById('nombre-paciente').textContent = usuario.nombre;
            } catch (error) {
                console.error('Error:', error);
            }
        }

      
        window.onload = () => {
            obtenerFechaActual();
            obtenerNombrePaciente();
            obtenerAntecedentes();
        };
// Simulación de datos de médicos (en una aplicación real, estos se obtendrían del servidor)
const medicos = {
    cardiologia: [
        { nombre: "Dr. Juan Pérez", especialidad: "Cardiología", disponibilidad: "Lunes a Viernes, 9:00 AM - 4:00 PM" },
        { nombre: "Dra. María Sánchez", especialidad: "Cardiología", disponibilidad: "Lunes a Viernes, 10:00 AM - 3:00 PM" }
    ],
    dermatologia: [
        { nombre: "Dr. Carlos Ruiz", especialidad: "Dermatología", disponibilidad: "Lunes a Viernes, 8:00 AM - 2:00 PM" }
    ],
    neurologia: [
        { nombre: "Dra. Ana Gómez", especialidad: "Neurología", disponibilidad: "Martes y Jueves, 10:00 AM - 5:00 PM" }
    ]
};

// Función para cargar los médicos según la especialidad seleccionada
function cargarMedicos() {
    const especialidad = document.getElementById("selectEspecialidad").value;
    const selectMedico = document.getElementById("selectMedico");

    // Limpiar lista actual
    selectMedico.innerHTML = '<option selected disabled>Seleccione un médico</option>';

    // Cargar nuevos médicos
    medicos[especialidad].forEach(medico => {
        const option = document.createElement("option");
        option.value = medico.nombre;
        option.textContent = medico.nombre;
        option.dataset.especialidad = medico.especialidad;
        option.dataset.disponibilidad = medico.disponibilidad;
        selectMedico.appendChild(option);
    });
}

// Mostrar información del médico seleccionado
document.getElementById("selectMedico").addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex];
    document.getElementById("medicoNombre").textContent = selectedOption.value;
    document.getElementById("medicoEspecialidad").textContent = selectedOption.dataset.especialidad;
    document.getElementById("medicoDisponibilidad").textContent = selectedOption.dataset.disponibilidad;
});
// Asumimos que existe una API para obtener médicos y sus horarios
document.getElementById('medico').addEventListener('input', function() {
    const medicoNombre = this.value;

    // Buscar médicos por nombre (puedes ajustar esto según tu backend)
    if (medicoNombre.length > 2) {
        fetch(`/api/medicos?nombre=${medicoNombre}`)
            .then(response => response.json())
            .then(medicos => {
                // Lógica para mostrar los médicos encontrados
                if (medicos.length > 0) {
                    // Aquí puedes mostrar los médicos, por ahora solo tomamos el primero como ejemplo
                    const medico = medicos[0];
                    fetchHorarios(medico.id);
                } else {
                    alert('No se encontraron médicos con ese nombre.');
                }
            });
    }
});

// Función para obtener los horarios disponibles de un médico
function fetchHorarios(medicoId) {
    const fecha = document.getElementById('fecha').value;
    if (!fecha) return;

    fetch(`/api/horarios/${medicoId}?fecha=${fecha}`)
        .then(response => response.json())
        .then(horarios => {
            const horariosContainer = document.getElementById('horarios');
            horariosContainer.innerHTML = ''; // Limpiar horarios anteriores

            // Crear un botón para cada horario disponible
            horarios.forEach(horario => {
                const btn = document.createElement('button');
                btn.classList.add('btn', 'btn-secondary');
                btn.textContent = `${horario.hora}`;
                btn.addEventListener('click', function() {
                    // Aquí puedes manejar la acción al seleccionar un horario
                    alert(`Horario seleccionado: ${horario.hora}`);
                });
                horariosContainer.appendChild(btn);
            });
        });
}

// Manejar el envío del formulario de cita
document.getElementById('cita-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombreMedico = document.getElementById('medico').value;
    const fechaAtencion = document.getElementById('fecha').value;

    // Validar que haya un médico y una fecha
    if (nombreMedico && fechaAtencion) {
        alert(`Cita registrada con ${nombreMedico} para el ${fechaAtencion}`);
        // Aquí iría el código para guardar la cita en la base de datos
    } else {
        alert('Por favor, completa todos los campos.');
    }
});


