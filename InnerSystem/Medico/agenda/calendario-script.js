// Referencias a elementos del DOM
const mesActualElemento = document.getElementById("mes-actual");
const diasCalendario = document.querySelector(".dias-calendario");
const botonAnterior = document.getElementById("anterior-mes");
const botonSiguiente = document.getElementById("siguiente-mes");
const detallesElemento = document.querySelector(".tarjeta.detalles");
const fechaSeleccionadaElemento = document.getElementById("fechaSeleccionada");
const botonCita = document.getElementById("crear-cita");
const botonIntervalo = document.getElementById("crear-intervalo");
const modalCita = document.getElementById("modal-crear-cita");
const modalIntervalo = document.getElementById("modal-crear-intervalo");
const cerrarCita = document.getElementById("cerrar-cita");
const cerrarIntervalo = document.getElementById("cerrar-intervalo");
let fechaActual = new Date();
const fechaHoy = new Date(); 
let fechaSeleccionada = new Date(); 
async function obtenerCitasPorFecha(fecha) {
    console.log("Obteniendo citas canceladas para la fecha: ", fecha);
    const nombreDia = fecha.toLocaleString("es-ES", { weekday: "long" });
    const fechaFormateada = `${nombreDia}, ${fecha.getDate()} de ${fecha.toLocaleString("es-ES", { month: "long" })} de ${fecha.getFullYear()}`;
    fechaSeleccionadaElemento.textContent = fechaFormateada;

    const fechaConsulta = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;

    try {
        const response = await fetch(`http://localhost:8080/api/v1/medical/citas/canceladas/dia/${fechaConsulta}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            throw new Error('No se pudieron obtener las citas canceladas');
        }

        const citasCanceladas = await response.json();

        citasCanceladas.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));

        detallesElemento.innerHTML = ''; 

        if (citasCanceladas.length > 0) {
            citasCanceladas.forEach(cita => {
                const citaElemento = document.createElement('div');
                citaElemento.classList.add('cita-cancelada');

              
                citaElemento.innerHTML = `
                    <p><strong>Cita cancelada:</strong></p>
                    <h3>${cita.nombrePaciente} ${cita.apellidoPaciente}</h3>
                    <p><strong>Motivo: </strong>${cita.motivo}</p>
                    <p><strong>Fecha: </strong>${new Date(cita.fechaHora).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}</p>
                    <p><strong>Estado: </strong>${cita.estado}</p>
                    <hr>
                `;
                detallesElemento.appendChild(citaElemento);
            });
        } else {
        
            obtenerCitasProgramadasPorFecha(fecha);
        }
    } catch (error) {
        console.error('Error al obtener las citas canceladas:', error);
        detallesElemento.innerHTML = `<p>Error al cargar las citas canceladas.</p>`;
    }
}

async function obtenerCitasProgramadasPorFecha(fecha) {
    console.log("Obteniendo citas programadas para la fecha: ", fecha);
    const fechaConsulta = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;

    try {
        
        const response = await fetch(`http://localhost:8080/api/v1/medical/citas/dia/${fechaConsulta}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            throw new Error('No se pudieron obtener las citas programadas');
        }

        const citasProgramadas = await response.json();
        citasProgramadas.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));
        detallesElemento.innerHTML = '';

        if (citasProgramadas.length > 0) {
            citasProgramadas.forEach(cita => {
                const citaElemento = document.createElement('div');
                citaElemento.classList.add('cita-programada');
                citaElemento.innerHTML = `
                    <p><strong>Cita programada:</strong></p>
                    <h3>${cita.nombrePaciente} ${cita.apellidoPaciente}</h3>
                    <p><strong>Motivo: </strong>${cita.motivo}</p>
                    <p><strong>Fecha: </strong>${new Date(cita.fechaHora).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}</p>
                    <p><strong>Estado: </strong>${cita.estado}</p>
                    <hr>
                `;
                detallesElemento.appendChild(citaElemento);
            });
        } else {
            detallesElemento.innerHTML = `<p>No hay citas programadas para esta fecha.</p>`;
        }
    } catch (error) {
        console.error('Error al obtener las citas programadas:', error);
        detallesElemento.innerHTML = `<p>Error al cargar las citas programadas.</p>`;
    }
}

function actualizarCalendario() {
    diasCalendario.innerHTML = `
        <li class="day-name">Lun</li>
        <li class="day-name">Mar</li>
        <li class="day-name">Mié</li>
        <li class="day-name">Jue</li>
        <li class="day-name">Vie</li>
        <li class="day-name">Sáb</li>
        <li class="day-name">Dom</li>
    `;

    const mes = fechaActual.toLocaleString("es-ES", { month: "long" });
    const año = fechaActual.getFullYear();
    mesActualElemento.textContent = `${mes.charAt(0).toUpperCase() + mes.slice(1)} ${año}`;

    const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).getDay();
    const diasEnMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0).getDate();

    for (let i = 0; i < primerDiaMes; i++) {
        diasCalendario.appendChild(document.createElement("li"));
    }
    for (let dia = 1; dia <= diasEnMes; dia++) {
        const diaElemento = document.createElement("li");
        diaElemento.textContent = dia;
        diaElemento.classList.add("dia");

        const fecha = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), dia);

        // Verificar si es el día actual
        if (fecha.toDateString() === fechaHoy.toDateString()) {
            diaElemento.classList.add("current"); 
        }

        if (fechaSeleccionada.toDateString() === fecha.toDateString()) {
            diaElemento.classList.add("selected");
        }

        diaElemento.addEventListener("click", () => {
            fechaSeleccionada = fecha;
            actualizarCalendario();
            obtenerCitasPorFecha(fechaSeleccionada);
        });

        diasCalendario.appendChild(diaElemento);
    }
}


botonAnterior.addEventListener("click", () => {
    fechaActual.setMonth(fechaActual.getMonth() - 1);
    actualizarCalendario();
});

botonSiguiente.addEventListener("click", () => {
    fechaActual.setMonth(fechaActual.getMonth() + 1);
    actualizarCalendario();
});


actualizarCalendario();
obtenerCitasPorFecha(fechaSeleccionada);
const btnAbrirCrearCita = document.getElementById('btn-abrir-crear-cita');
const btnAbrirCrearIntervalo = document.getElementById('btn-abrir-crear-intervalo');
const modalCrearCita = document.getElementById('modal-crear-cita');
const modalCrearIntervalo = document.getElementById('modal-crear-intervalo');


btnAbrirCrearCita.addEventListener('click', () => {
    modalCrearCita.style.display = 'block';
});

cerrarCita.addEventListener('click', () => {
    modalCrearCita.style.display = 'none';
});

btnAbrirCrearIntervalo.addEventListener('click', () => {
    modalCrearIntervalo.style.display = 'block';
});

cerrarIntervalo.addEventListener('click', () => {
    modalCrearIntervalo.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modalCrearCita) {
        modalCrearCita.style.display = 'none';
    }
    if (event.target === modalCrearIntervalo) {
        modalCrearIntervalo.style.display = 'none';
    }
});
async function registrarIntervaloTrabajo() {
    const form = document.getElementById("form-intervalo");
    const fecha = document.getElementById("fecha").value; 
    const tipoAtencion = document.getElementById("tipoAtencion").value;
    const horaInicio = document.getElementById("horaInicio").value; 
    const horaFin = document.getElementById("horaFin").value; 
    const maxCitas = document.getElementById("maxCitas").value;
    const duracionCita = document.getElementById("duracionCita").value;
    const fechaHoraInicio = `${fecha}T${horaInicio}:00`; 
    const fechaHoraFin = `${fecha}T${horaFin}:00`; 

    const intervaloData = {
        fecha: fecha,
        tipoAtencion: tipoAtencion,
        horaInicio: fechaHoraInicio,
        horaFin: fechaHoraFin,
        maxCitas: maxCitas,
        duracionCita: duracionCita
    };

    try {
     
        const response = await fetch("http://localhost:8080/api/v1/medical/horario-trabajo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}` 
            },
            body: JSON.stringify(intervaloData)
        });

 
        if (response.ok) {
            alert("Intervalo de trabajo registrado con éxito");
        } else {
            const error = await response.text();
            alert("Error al registrar el intervalo de trabajo: " + error);
        }
    } catch (error) {
        console.error("Error en la conexión con el servidor:", error);
    }
}


document.getElementById("form-intervalo").addEventListener("submit", function (e) {
    e.preventDefault();
    registrarIntervaloTrabajo();
});

async function registrarCita() {
    const form = document.getElementById("formRegistrarCita");
    const fechaInicio = document.getElementById("fechaInicio").value;
    const documentoIdentidad = document.getElementById("documentoIdentidad").value;

    const citaData = {
        fechaInicio: fechaInicio,
        documentoIdentidad: documentoIdentidad
    };

    try {
        const response = await fetch("http://localhost:8080/api/v1/medical/citas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}` 
            },
            body: JSON.stringify(citaData)
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message || "Cita registrada con éxito");
        } else {
            const error = await response.json();
            alert("Error al registrar la cita: " + error.message);
        }
    } catch (error) {
        console.error("Error en la conexión con el servidor:", error);
    }
}


document.getElementById("formRegistrarCita").addEventListener("submit", function (e) {
    e.preventDefault();
    registrarCita();
});

async function obtenerCitasDelDia() {
    const fechaHoy = new Date();
    const fechaFormateada = fechaHoy.toISOString().split("T")[0];
    const url = `http://localhost:8080/api/v1/reporte/medico/citas/dia/${fechaFormateada}`;

    try {
        const token = localStorage.getItem("token");
        
        if (!token) {
            alert("No estás autenticado. Por favor, inicia sesión.");
            return;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            const citas = await response.json();
            const citasContainer = document.getElementById("citasContainer");
            citasContainer.innerHTML = '';

            if (citas.length === 0) {
                citasContainer.innerHTML = "<p>No se encontraron citas para hoy.</p>";
                return;
            }

            citas.forEach(cita => {
                const card = document.createElement("div");
                card.classList.add("card");
                const hora = cita.fechaHora.split("T")[1].split(":")[0];
                const minuto = cita.fechaHora.split("T")[1].split(":")[1];

                card.innerHTML = `
                    <div class="hora">Hora: ${hora}:${minuto}</div>
                    <div class="nombre-paciente">${cita.nombrePaciente} ${cita.apellidoPaciente}</div>
                    <div class="estado">${cita.estado}</div>
                    <div class="motivo">${cita.motivoCancelacion || 'No cancelada'}</div>
                    <button class="btn-crear-historia-clinica" data-id="${cita.idPaciente}">Crear Historia Clínica</button>
                `;

                citasContainer.appendChild(card);
            });


            document.querySelectorAll(".btn-crear-historia-clinica").forEach(button => {
                button.addEventListener("click", (event) => {
                    const pacienteId = event.target.getAttribute("data-id");
                    window.location.href = `/InnerSystem/Medico/HC-detalles/hc-detalles.html?pacienteId=${pacienteId}`;
                });
            });

        } else {
            console.error('Error al obtener las citas:', response.statusText);
            alert("Error al obtener las citas del día.");
        }
    } catch (error) {
        console.error("Error al obtener las citas:", error);
        alert("Ocurrió un error al obtener las citas.");
    }
}


document.addEventListener("DOMContentLoaded", obtenerCitasDelDia);



function agregarCita(cita) {
    const citasContainer = document.getElementById("citasContainer");


    const card = document.createElement("div");
    card.classList.add("card");

 
    const hora = cita.fechaHora.split("T")[1].split(":")[0]; 
    const minuto = cita.fechaHora.split("T")[1].split(":")[1]; 
    card.innerHTML = `
        <div class="hora">Hora: ${hora}:${minuto}</div>
        <div class="nombre-paciente">${cita.nombrePaciente} ${cita.apellidoPaciente}</div>
        <div class="estado">${cita.estado}</div>
        
    `;


    citasContainer.appendChild(card);
}

function mostrarFechaHoy() {

    const fechaHoy = new Date();
    const dia = String(fechaHoy.getDate()).padStart(2, '0'); 
    const mes = String(fechaHoy.getMonth() + 1).padStart(2, '0'); 
    const año = fechaHoy.getFullYear(); 
    const fechaFormateada = `${dia}/${mes}/${año}`;
    document.getElementById("fechaSeleccionada").innerText = fechaFormateada;
}
async function obtenerNombreUsuario() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("No estás autenticado. Por favor, inicia sesión.");
        return;
    }

    try {

        const response = await fetch("http://localhost:8080/api/v1/medical/usuario", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            const usuario = await response.json();

            const horaActual = new Date().getHours();
            let saludo = "Buenos días"; 

 
            if (horaActual >= 12 && horaActual < 18) {
                saludo = "Buenas tardes";
            } else if (horaActual >= 18 || horaActual < 6) {
                saludo = "Buenas noches";
            }


            document.getElementById("mensajeBienvenida").textContent = `${saludo} Md. ${usuario.nombre}`;


            const fechaHoy = new Date();
            const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
            const fechaFormateada = fechaHoy.toLocaleDateString('es-ES', opciones);
            document.getElementById("fechaActual").textContent = `/ ${fechaFormateada}`;

        } else {
            alert("Error al obtener los datos del usuario.");
        }
    } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        alert("Ocurrió un error al obtener los datos.");
    }
}


document.addEventListener("DOMContentLoaded", obtenerNombreUsuario);

function navegar(url) {
    window.location.href = url; 
}