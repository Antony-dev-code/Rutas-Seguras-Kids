// Buscador personalizado
class SearchBar extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="search-container">
                <input type="text" class="search-input" placeholder="Buscar estudiante por nombre o curso...">
            </div>
        `;
    }
    connectedCallback() {
        const input = this.querySelector('.search-input');
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const searchEvent = new CustomEvent('studentSearch', {
                detail: searchTerm,
                bubbles: true
            });
            this.dispatchEvent(searchEvent);
        });
    }
}
customElements.define('search-bar', SearchBar);

// Estado de la aplicación
let listaEstudiantes = [];
let listaConductores = [];

// Variables de arrastre
let conductorEnZona = null;
let estudiantesEnZona = [];

// Carga de estudiantes
async function cargarEstudiantes() {
    try {
        const respuesta = await fetch('/JS/Estudiantes.Json');
        if (!respuesta.ok) throw new Error('No se pudo cargar el archivo JSON');
        
        listaEstudiantes = await respuesta.json();
        renderizarEstudiantes(listaEstudiantes);
    } catch (error) {
        console.error('Error al inicializar los estudiantes:', error);
        document.getElementById('students-pool').innerHTML = '<p>Error al cargar estudiantes. Verifica la ruta de tu JSON.</p>';
    }
}

// Renderizado de tarjetas de estudiantes
function renderizarEstudiantes(estudiantes) {
    const contenedor = document.getElementById('students-pool');
    contenedor.innerHTML = '';

    estudiantes.forEach(estudiante => {
        const tarjeta = document.createElement('article');
        tarjeta.className = 'card-item';
        tarjeta.setAttribute('draggable', 'true');
        tarjeta.id = `student-${estudiante.id}`;

        tarjeta.innerHTML = `
            <h4>${estudiante.nombre}</h4>
            <p><strong>Curso:</strong> ${estudiante.curso}</p>
            <p><strong>Tel. Acudiente:</strong> ${estudiante.telefono_acudiente}</p>
            <span class="card-badge">Sangre: ${estudiante.tipo_sangre}</span>
        `;

        tarjeta.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', tarjeta.id);
            e.dataTransfer.setData('type', 'student');
        });

        contenedor.appendChild(tarjeta);
    });
}

// Configuración de elementos del modal
const modal = document.getElementById('modal-conductor');
const btnAbrirModal = document.getElementById('btn-create-route');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const formConductor = document.getElementById('form-conductor');

// Eventos de apertura y cierre del modal
btnAbrirModal.addEventListener('click', () => modal.style.display = 'flex');
btnCerrarModal.addEventListener('click', () => modal.style.display = 'none');

// Registro de nuevo conductor
formConductor.addEventListener('submit', (e) => {
    e.preventDefault();

    const nuevoConductor = {
        id: Date.now(),
        nombre: document.getElementById('cond-nombre').value,
        ruta: document.getElementById('cond-ruta').value,
        edad: document.getElementById('cond-edad').value,
        hora: document.getElementById('cond-hora').value
    };

    listaConductores.push(nuevoConductor);
    renderizarConductor(nuevoConductor);

    formConductor.reset();
    modal.style.display = 'none';
});

// Renderizado de tarjetas de conductores
function renderizarConductor(conductor) {
    const contenedor = document.getElementById('routes-pool');

    const tarjeta = document.createElement('article');
    tarjeta.className = 'card-item card-driver';
    tarjeta.setAttribute('draggable', 'true');
    tarjeta.id = `driver-${conductor.id}`;

    tarjeta.innerHTML = `
        <button class="btn-delete-card" onclick="eliminarConductorPermanente('${tarjeta.id}')">X</button>
        <h4>${conductor.nombre}</h4>
        <p><strong>Ruta:</strong> ${conductor.ruta}</p>
        <p><strong>Horario:</strong> ${conductor.hora}</p>
        <span class="card-badge" style="background-color: var(--verde-palido)">Edad: ${conductor.edad}</span>
    `;

    tarjeta.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', tarjeta.id);
        e.dataTransfer.setData('type', 'driver');
    });

    contenedor.appendChild(tarjeta);
}

// Eliminación de conductor
window.eliminarConductorPermanente = function(idTarjeta) {
    const tarjeta = document.getElementById(idTarjeta);
    if(tarjeta) tarjeta.remove();
    const idNumerico = parseInt(idTarjeta.replace('driver-', ''));
    listaConductores = listaConductores.filter(c => c.id !== idNumerico);
};

// Configuración de la zona de caída
const dropZone = document.getElementById('main-drop-zone');
const btnAsignarRuta = document.getElementById('btn-assign-route');

// Eventos de arrastre sobre el cuadro central
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

// Soltar elementos en la zona central
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');

    const idElemento = e.dataTransfer.getData('text/plain');
    const tipoElemento = e.dataTransfer.getData('type');
    const elementoDOM = document.getElementById(idElemento);

    if (!elementoDOM) return;

    if (tipoElemento === 'driver') {
        if (conductorEnZona !== null) {
            alert("Verificación: Sólo se permite asignar un (1) conductor por ruta a la vez.");
            return;
        }
        conductorEnZona = idElemento;
        dropZone.appendChild(elementoDOM);
    } 
    else if (tipoElemento === 'student') {
        if (estudiantesEnZona.includes(idElemento)) return;
        
        estudiantesEnZona.push(idElemento);
        dropZone.appendChild(elementoDOM);
    }

    const placeholderText = dropZone.querySelector('.drop-placeholder');
    if (placeholderText) placeholderText.style.display = 'none';

    comprobarBotonAsignacion();
});

// Validación del estado del botón
function comprobarBotonAsignacion() {
    if (conductorEnZona !== null && estudiantesEnZona.length > 0) {
        btnAsignarRuta.removeAttribute('disabled');
    } else {
        btnAsignarRuta.setAttribute('disabled', 'true');
    }
}

// Creación de ruta consolidada
btnAsignarRuta.addEventListener('click', () => {
    const contenedorRutasActivas = document.getElementById('active-routes-container');
    
    const tarjetaConductorDOM = document.getElementById(conductorEnZona);
    const nombreConductor = tarjetaConductorDOM.querySelector('h4').innerText;
    const infoRuta = tarjetaConductorDOM.querySelector('p').innerHTML;
    
    // CAPTURA DE HORA: Extraemos el texto del segundo párrafo <p> que contiene el Horario
    const parrafosConductor = tarjetaConductorDOM.querySelectorAll('p');
    const infoHorario = parrafosConductor[1] ? parrafosConductor[1].innerHTML : ''; 

    const nuevaRutaActiva = document.createElement('article');
    nuevaRutaActiva.className = 'active-route-card';
    nuevaRutaActiva.dataset.conductorId = conductorEnZona;
    nuevaRutaActiva.dataset.estudiantesIds = JSON.stringify(estudiantesEnZona);

    // Renderizado de la lista de estudiantes con su checkbox de asistencia
    let listaHTMLEstudiantes = '';
    estudiantesEnZona.forEach(idEst => {
        const estudianteDOM = document.getElementById(idEst);
        const nombreEst = estudianteDOM.querySelector('h4').innerText;
        const cursoEst = estudianteDOM.querySelector('p').innerText;
        
        listaHTMLEstudiantes += `
            <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span>${nombreEst} (${cursoEst})</span>
                <input type="checkbox" class="check-asistencia" style="cursor: pointer;">
            </li>
        `;
    });

    // Estructura interna de la tarjeta con el contador al final
    nuevaRutaActiva.innerHTML = `
        <button class="btn-delete-card">Desligar Ruta</button>
        <h4>Ruta Activa: ${nombreConductor}</h4>
        ${infoRuta}
        <p>${infoHorario}</p> 
        <p style="margin-top:10px;"><strong>Pasajeros Asignados:</strong></p>
        <ul style="list-style: none; padding-left: 0;">
            ${listaHTMLEstudiantes}
        </ul>
        <hr style="border: 0; border-top: 1px solid #ccc; margin: 10px 0;">
        <p class="contador-asistencia"><strong>Asistencias:</strong> <span class="num-asistencias">0</span> / ${estudiantesEnZona.length}</p>
    `;

    // Control de los checkboxes para actualizar el contador
    const checkboxes = nuevaRutaActiva.querySelectorAll('.check-asistencia');
    const visorContador = nuevaRutaActiva.querySelector('.num-asistencias');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const totalChequeados = nuevaRutaActiva.querySelectorAll('.check-asistencia:checked').length;
            visorContador.innerText = totalChequeados;
        });
    });

    // Botón para deshacer asignación de ruta
    nuevaRutaActiva.querySelector('.btn-delete-card').addEventListener('click', () => {
        const condId = nuevaRutaActiva.dataset.conductorId;
        const condDOM = document.getElementById(condId);
        if(condDOM) {
            document.getElementById('routes-pool').appendChild(condDOM);
            condDOM.classList.remove('is-assigned');
        }

        const estIds = JSON.parse(nuevaRutaActiva.dataset.estudiantesIds);
        estIds.forEach(idEst => {
            const estDOM = document.getElementById(idEst);
            if(estDOM) {
                document.getElementById('students-pool').appendChild(estDOM);
                estDOM.classList.remove('is-assigned');
            }
        });

        nuevaRutaActiva.remove();
    });

    contenedorRutasActivas.appendChild(nuevaRutaActiva);

    tarjetaConductorDOM.classList.add('is-assigned');
    estudiantesEnZona.forEach(idEst => {
        document.getElementById(idEst).classList.add('is-assigned');
    });

    vaciarZonaArrastre();
});
// Limpieza de la zona intermedia
function vaciarZonaArrastre() {
    if(conductorEnZona) {
        const c = document.getElementById(conductorEnZona);
        if(c && !c.classList.contains('is-assigned')) document.getElementById('routes-pool').appendChild(c);
    }
    estudiantesEnZona.forEach(idEst => {
        const e = document.getElementById(idEst);
        if(e && !e.classList.contains('is-assigned')) document.getElementById('students-pool').appendChild(e);
    });

    conductorEnZona = null;
    estudiantesEnZona = [];
    
    dropZone.innerHTML = `<p class="drop-placeholder">Arrastre aquí al estudiante o estudiantes y a la respectiva ruta para ser asignado a una ruta</p>`;
    const placeholderText = dropZone.querySelector('.drop-placeholder');
    if (placeholderText) placeholderText.style.display = 'block';

    comprobarBotonAsignacion();
}

// Filtro en tiempo real del buscador
document.addEventListener('studentSearch', (evento) => {
    const terminoBusqueda = evento.detail;

    listaEstudiantes.forEach(estudiante => {
        const tarjeta = document.getElementById(`student-${estudiante.id}`);
        if (!tarjeta) return;

        if (tarjeta.classList.contains('is-assigned')) return;

        const coincideNombre = estudiante.nombre.toLowerCase().includes(terminoBusqueda);
        const coincideCurso = estudiante.curso.toLowerCase().includes(terminoBusqueda);

        if (coincideNombre || coincideCurso) {
            tarjeta.style.display = 'block';
        } else {
            tarjeta.style.display = 'none';
        }
    });
});

// Carga inicial del sistema
document.addEventListener('DOMContentLoaded', () => {
    cargarEstudiantes();
});

// Conexión con la API de OpenWeather
async function obtenerClimaBucaramanga() {
    const apiKey = "bd5e378503939ddaee76f12ad7a97608";
    const ciudad = "Bucaramanga";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error("No se pudo conectar con el servicio de clima");
        
        const datosClima = await respuesta.json();
        const temperatura = Math.round(datosClima.main.temp);
        const descripcion = datosClima.weather[0].description;
        const icono = datosClima.weather[0].icon;
        const urlIcono = `https://openweathermap.org/img/wn/${icono}.png`;

        const widget = document.getElementById("weather-widget");
        widget.innerHTML = `
            <img src="${urlIcono}" alt="${descripcion}" style="width: 35px; height: 35px;">
            <span><strong>${ciudad}:</strong> ${temperatura}°C, ${descripcion}</span>
        `;

    } catch (error) {
        console.error("Error al obtener el clima:", error);
        document.getElementById("weather-widget").innerHTML = `<span>Clima no disponible</span>`;
    }
}

// Inicialización de módulos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarEstudiantes();
    obtenerClimaBucaramanga();
});