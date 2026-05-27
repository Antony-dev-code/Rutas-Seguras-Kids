# 🚌 Rutas Seguras Kids - Sistema de Control de Rutas Escolares

¡Bienvenido a **Rutas Seguras Kids**! Este es un sistema de gestión modular e interactivo diseñado para optimizar la asignación de estudiantes a rutas de transporte escolar en tiempo real. 

La aplicación utiliza tecnologías web nativas (**HTML5, CSS3 y JavaScript Moderno**) para ofrecer una experiencia fluida, responsiva y altamente visual basada en la dinámica de tableros organizacionales (Drag & Drop).

---

## 🚀 ¿Cómo descargar y poner en funcionamiento el proyecto?

Sigue estos sencillos pasos para ejecutar la aplicación en tu computadora local:

### 1. Descargar el código fuente
Tienes dos opciones para obtener los archivos:
* **Opción A (Descarga directa):** Haz clic en el botón **Code** (en la parte superior de este repositorio) y selecciona **Download ZIP**. Descomprime el archivo en tu computadora.
* **Opción B (Por consola con Git):** Abre tu terminal y ejecuta el siguiente comando:
  ```bash
  git clone [https://github.com/Antony-dev-code/Rutas-Seguras-Kids.git](https://github.com/Antony-dev-code/Rutas-Seguras-Kids.git)


# 🚌 Sistema de Gestión de Rutas Escolares

Este proyecto es una aplicación web interactiva diseñada para optimizar la logística de transporte escolar. Permite administrar de forma dinámica la asignación de estudiantes a conductores utilizando mecánicas de *Drag & Drop*, filtros en tiempo real y consumo de datos asíncronos.

---

## 2. Ejecutar la aplicación

Debido a que el proyecto consume un archivo de datos local (`Estudiantes.Json`) y se conecta a la API externa de **OpenWeather** mediante peticiones asíncronas (`fetch`), no se puede abrir el archivo HTML dándole doble clic directamente. Requiere ejecutarse a través de un servidor local:

1. Abre la carpeta del proyecto en **Visual Studio Code**.
2. Instala la extensión **Live Server** (si no la tienes aún).
3. Haz clic derecho sobre el archivo `index.html` (o `rutas.html`) y selecciona **Open with Live Server**.

¡Listo! Tu navegador web se abrirá automáticamente en la dirección `http://127.0.0.1:5500` con el sistema operando al 100%.

---

## 🛠️ Panel de Control y Capturas de Pantalla (Dashboard)

El núcleo del sistema de rutas se organiza en un tablero de **tres columnas integradas** que interactúan entre sí. A continuación se detalla su funcionamiento y estructura visual:

### 📋 Columna Izquierda: Banco de Estudiantes
![Modulo de estudiantes](/Img/Estudiantes%20Modulo.png)
Esta columna precarga automáticamente la lista de alumnos registrados en la institución.
* **Persistencia de Datos:** Los datos provienen de un archivo estático de base de datos tipo `Estudiantes.Json`, el cual es leído e inyectado en el documento de forma asíncrona mediante la función `fetch()` de JavaScript.
* **Interactividad:** Cada tarjeta de estudiante cuenta con propiedades nativas de arrastre (`draggable="true"`) programadas por JS para poder ser movilizadas al centro.

### 🎛️ Columna Central: Zona de Asignación Interactiva

* `Zona de asignación de ruta.png`
![Modulo de asignación de rutas](/Img/Zona%20de%20asignación%20de%20ruta.png)
Es el motor lógico del tablero. Funciona como una zona gris receptora de elementos.
* **Lógica Drag & Drop:** Utiliza los escuchadores de eventos `dragover`, `dragleave` y `drop` de JavaScript.
![Modulo de asignación de rutas con rutas asignadas](/Img/Asignación%20rutas%20Modulo.png)
* **Reglas de Negocio:** Valida en tiempo real que solo se pueda soltar **un (1) conductor** a la vez y múltiples estudiantes. Al cumplir la condición, el botón inferior se activa para compilar y generar una nueva tarjeta estructurada en la sección de **RUTAS ESCOLARES ACTIVAS**.

### 🩻 Columna Derecha: Gestión de Conductores

![Modulo de Rutas y conductores](/Img/Modulo%20Rutas%20y%20conductores.png)
Módulo dedicado a dar de alta la logística de los vehículos disponibles.
* **Creador de Tarjetas:** Cuenta con un botón que despliega una ventana emergente (**Modal**) para registrar *Nombre, Edad, Ruta* y *Horario de inicio* del conductor.
* **Flexibilidad:** Al igual que los estudiantes, estas tarjetas se pueden jalar al centro. Si decides deshacer una ruta activa mediante el botón *Desligar*, el JavaScript destruye la tarjeta consolidada y retorna automáticamente al conductor y sus estudiantes a sus respectivas columnas de origen sin perder sus datos.

![Modulo de Rutas escolares activas](/Img/Rutas%20escolares%20activas%20Modulo.png)

---

## ⚙️ Características Principales del Sistema

* **Estrategia Modular:** Archivos HTML y JavaScript totalmente independientes y especializados para facilitar el mantenimiento del código.
* **Filtros Inteligentes en Tiempo Real:** Barra de búsqueda optimizada con *Web Elements* que oculta o muestra estudiantes instantáneamente según las coincidencias de texto.
* **Consumo de API Externa:** Conexión asíncrona mediante `async/await` con los servidores de **OpenWeather API** para desplegar la temperatura y el estado meteorológico actual de **Bucaramanga** directamente en el banner superior.
* **Diseño 100% Responsive:** Capa de estilos CSS unificada mediante *CSS Grid* y *Flexbox* que adapta toda la interfaz para operar cómodamente en computadoras de escritorio, tablets y pantallas móviles (como iPhone).

---

## 👥 Guía de Uso del Sistema (Paso a Paso)

Para experimentar el flujo completo del software, realiza las siguientes acciones en la pantalla de Rutas:

1. **Filtrar Estudiantes:** Filtra o busca un alumno en la columna izquierda usando la barra superior para comprobar la velocidad de respuesta del sistema.
2. **Crear Conductor:** Ve a la columna derecha y haz clic en *Crear Ruta/Conductor*, llena el formulario del modal y presiona *Guardar*. Aparecerá la tarjeta del conductor.
3. **Asignar Conductor:** Arrastra y suelta (*Drag & Drop*) la tarjeta del conductor recién creado hacia la zona gris central.
4. **Asignar Pasajeros:** Arrastra y suelta uno o varios estudiantes de la columna izquierda hacia esa misma zona gris central.
5. **Consolidar Ruta:** Verás cómo el botón *"Agregar a la ruta"* se enciende. Haz clic en él.
6. **Resultado:** El cuadro central se limpiará y verás cómo abajo del todo, en la sección de consolidados, aparece la nueva **Ruta Activa** armada con el nombre del chofer y la lista viñetada de sus pasajeros asignados.
7. **Deshacer Cambios:** Si cometiste un error, haz clic en *Desligar Ruta* en la tarjeta de abajo y observa cómo todos los elementos regresan mágicamente a sus puestos originales.