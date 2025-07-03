# CodeViz Research Context

> **Note**: This file contains research context from CodeViz. Most recent contexts are at the bottom.

---

## Research Query

me puedes enseñar como fuye el sistema desde el logeo del usuario hasta las diferentes ramas por las que puede navegar

*Session: 63796596fa8b3f303a12a102e671ca33 | Generated: 7/2/2025, 7:17:58 PM*

### Analysis Summary

# Flujo del Sistema: Desde el Login del Usuario hasta la Navegación por Ramas

Este informe detalla el flujo del sistema desde el inicio de sesión del usuario hasta la navegación por las diferentes ramas, incluyendo la autenticación, la gestión de sesiones y cómo los permisos del usuario influyen en el acceso a las distintas funcionalidades.

## 1. Arquitectura General

El sistema sigue una arquitectura Model-View-Controller (MVC) con un backend basado en Node.js (Express.js) y un frontend que utiliza EJS para las vistas y JavaScript para la lógica del cliente. La autenticación se maneja a través de sesiones y tokens JWT, y la autorización se basa en un campo `permisos` en el modelo de usuario.

## 2. Flujo de Login del Usuario

El proceso de login se inicia en el cliente y se completa en el servidor, estableciendo una sesión autenticada.

### 2.1. Interacción del Cliente (Frontend)

El cliente interactúa con el formulario de login y envía las credenciales al servidor.

#### 2.1.1. Vista de Login (file:src/views/auth/login.ejs)

La página de login presenta un formulario con los siguientes campos:

*   **Número de Empleado**: Campo de texto (`codigoempleado`) para ingresar el identificador del usuario.
*   **Contraseña**: Campo de tipo `password` (`password`) para la contraseña del usuario.
*   **Token CSRF**: Un campo oculto (`_csrf`) para protección contra ataques de falsificación de solicitudes entre sitios.

#### 2.1.2. Lógica de Login del Cliente (file:src/public/scripts/login.js)

Este script maneja la interacción del usuario con el formulario de login:

*   **Captura de Evento**: Escucha el evento `submit` del formulario de login (`loginForm`).
*   **Prevención de Envío por Defecto**: Detiene el envío tradicional del formulario para manejarlo de forma asíncrona.
*   **Envío de Credenciales**: Recopila los datos del formulario y realiza una solicitud `POST` a la ruta `/login` del servidor.
*   **Manejo de Respuesta**:
    *   Si la autenticación es **exitosa**, el servidor envía una URL de redirección (`res.redirect`), y el cliente navega a esa URL.
    *   Si la autenticación **falla**, el servidor envía un mensaje de error (`res.msg`), que se muestra al usuario mediante una alerta (SweetAlert2).

### 2.2. Interacción del Servidor (Backend)

El servidor recibe las credenciales, las valida y gestiona la sesión del usuario.

#### 2.2.1. Rutas de Autenticación (file:src/routes/userRoutes.js)

Las rutas principales para el login son:

*   **`GET /` y `GET /login`**: Ambas rutas renderizan el formulario de login a través de `customerController.formularioLogin`.
*   **`POST /login`**: Esta ruta es el punto de entrada para la autenticación. Es manejada por `customerController.autenticar`.

#### 2.2.2. Modelo de Usuario (file:src/models/Usuario.js)

El modelo `Usuario` define la estructura de los datos del usuario en la base de datos. Los campos relevantes para la autenticación y autorización son:

*   **`codigoempleado`**: Identificador único del empleado (clave primaria).
*   **`password`**: Contraseña del usuario (almacenada de forma hasheada).
*   **`permisos`**: Campo de tipo `STRING` que almacena los permisos del usuario. Este campo es crucial para la autorización y determinar las ramas de navegación accesibles.
*   **`token`**: Utilizado para procesos como la recuperación de contraseña o confirmación de cuenta.
*   **`confirmado`**: Un booleano que indica si la cuenta del usuario ha sido confirmada.

#### 2.2.3. Middleware de Protección de Rutas (file:src/middleware/protegetRuta.js)

Este middleware es fundamental para asegurar que solo los usuarios autenticados puedan acceder a ciertas rutas:

*   **Verificación de Token**: Comprueba la existencia y validez de un token JWT (`_token`) en las cookies de la solicitud.
*   **Redirección en Caso de Fallo**: Si no hay token o es inválido, el usuario es redirigido a la página de inicio (`/`).
*   **Recuperación de Datos del Usuario**: Si el token es válido, decodifica el `codigoempleado` del token y busca al usuario en la base de datos utilizando el modelo `Usuario`.
*   **Adjuntar Usuario a la Solicitud**: Si el usuario es encontrado, el objeto `usuario` se adjunta a `req.usuario`, haciéndolo disponible para los controladores y otros middlewares.
*   **No hay Verificación de Permisos Explícita aquí**: Es importante destacar que este middleware **solo autentica** al usuario. La lógica para verificar los `permisos` del usuario y restringir el acceso a rutas específicas **no se encuentra en este archivo**, sino que se espera que se implemente en los controladores o en middlewares adicionales que utilicen `req.usuario.permisos`.

## 3. Navegación Post-Login y Ramas Accesibles

Una vez que el usuario ha iniciado sesión, el sistema lo redirige a diferentes secciones o "ramas" de navegación. El acceso a estas ramas está influenciado por los permisos del usuario.

### 3.1. Redirección Inicial

Tras un login exitoso, el cliente es redirigido a una URL proporcionada por el servidor. La ruta `/inicio` (manejada por `customerController.inicio`) es un candidato probable para la página de inicio o dashboard principal después del login.

### 3.2. Ramas de Navegación Comunes

El archivo `src/routes/userRoutes.js` revela una variedad de rutas que representan las diferentes funcionalidades o "ramas" a las que un usuario puede navegar. Estas incluyen:

*   **`/inicio`**: Página principal o dashboard.
*   **`/requisicion`**: Funcionalidad para gestionar requisiciones.
*   **`/asistencia`**: Módulo de control de asistencia.
*   **`/checklist`**: Acceso a listas de verificación.
*   **`/agregar-imagen`**: Funcionalidad para subir imágenes.
*   **`/controlDispositivos`**: Gestión de dispositivos.
*   **`/encuestaSatisfaccion`**: Módulo de encuestas de satisfacción.
*   **`/directorio`**: Acceso a un directorio.
*   **`/mantenimiento`**: Módulo de mantenimiento.
*   **`/solicitud`**: Funcionalidad para enviar solicitudes.
*   **`/documentosControlados`**: Acceso a documentos controlados.
*   **`/calidad/:documento`**: Visualización de documentos relacionados con la calidad.
*   **`/juegos`**: Una sección de juegos.

### 3.3. Influencia de los Permisos en la Navegación

Aunque el middleware `protegetRuta.js` no implementa la lógica de permisos directamente, el campo `permisos` en el modelo `Usuario` (file:src/models/Usuario.js) es el mecanismo para controlar el acceso.

*   **Implementación de Autorización**: La lógica para verificar el campo `permisos` y permitir o denegar el acceso a las rutas específicas debe residir en los controladores (por ejemplo, en `customerController.js`) o en middlewares adicionales que se ejecuten *después* de `protegetRuta.js`. Estos componentes accederían a `req.usuario.permisos` para tomar decisiones de autorización.
*   **Ejemplo de Flujo de Autorización (Conceptual)**:
    1.  El usuario intenta acceder a una ruta como `/requisicion`.
    2.  El middleware `protegetRuta.js` verifica que el usuario esté autenticado y adjunta el objeto `usuario` a `req`.
    3.  Antes de ejecutar `customerController.requisicion`, un middleware de autorización (o el propio controlador) examinaría `req.usuario.permisos`.
    4.  Si `req.usuario.permisos` contiene el permiso necesario para "requisiciones", se permite el acceso. De lo contrario, se deniega el acceso (por ejemplo, redirigiendo a una página de error o al login).

## 4. Resumen del Flujo

1.  **Cliente (Frontend)**: El usuario ingresa `codigoempleado` y `password` en el formulario de login (file:src/views/auth/login.ejs).
2.  **Envío Asíncrono**: `src/public/scripts/login.js` intercepta el envío del formulario y realiza una solicitud `POST` a `/login`.
3.  **Servidor (Backend)**:
    *   La ruta `POST /login` en `src/routes/userRoutes.js` invoca a `customerController.autenticar`.
    *   `customerController.autenticar` valida las credenciales del usuario contra la base de datos (utilizando el modelo `Usuario` en file:src/models/Usuario.js).
    *   Si las credenciales son válidas, se genera un token JWT y se establece una cookie (`_token`). El servidor envía una respuesta de éxito con una URL de redirección (ej. `/inicio`).
    *   Si las credenciales son inválidas, se envía una respuesta de error.
4.  **Redirección y Acceso a Rutas Protegidas**:
    *   El cliente es redirigido a la URL proporcionada por el servidor.
    *   Para acceder a rutas protegidas (como `/requisicion`, `/asistencia`, etc.), el middleware `src/middleware/protegetRuta.js` verifica el token JWT.
    *   Si el token es válido, el objeto `usuario` (incluyendo el campo `permisos`) se adjunta a la solicitud.
    *   Los controladores o middlewares de autorización posteriores utilizan el campo `permisos` de `req.usuario` para determinar si el usuario tiene acceso a la funcionalidad solicitada, permitiendo o denegando la navegación a las diferentes ramas del sistema.

Este flujo proporciona una visión general de cómo el sistema maneja la autenticación y la autorización para controlar la navegación del usuario. Para una comprensión más profunda de la lógica de permisos, sería necesario analizar los controladores que manejan las rutas protegidas y buscar cómo utilizan el campo `permisos` del objeto `req.usuario`.

### Implementation Steps

1. **Understanding the Overall System Architecture**
   The system operates on an MVC (Model-View-Controller) architecture, utilizing Node.js with Express.js for the backend and EJS for frontend views. Authentication is managed via sessions and JWT tokens, with user permissions (`permisos`) dictating authorization.

2. **Initiating the User Login Flow**
   The login process begins on the client side, where users interact with a login form. This form includes fields for `codigoempleado`, `password`, and a hidden `_csrf` token for security. Client-side JavaScript handles the form submission, preventing default behavior and sending credentials asynchronously to the server. Upon successful authentication, the client is redirected; otherwise, an error message is displayed.

3. **Server-Side Authentication and User Session Management**
   On the server side, authentication requests are handled by specific routes. The `Usuario` model defines the user data structure, including `codigoempleado`, hashed `password`, and a crucial `permisos` field that governs access. A middleware (`protegetRuta`) ensures that only authenticated users can access protected routes by verifying a JWT token in cookies. This middleware attaches the user object to the request, making it available for subsequent authorization checks, though it does not directly enforce permissions.

4. **Navigating Post-Login and Accessing System Branches**
   After successful login, the system redirects the user to various sections or 'branches' of navigation. Common branches include `/inicio`, `/requisicion`, `/asistencia`, and others, each representing a distinct functionality. The `permisos` field in the `Usuario` model is the key mechanism for controlling access to these branches. Authorization logic, which checks these permissions, is implemented within controllers or additional middlewares that execute after the authentication middleware, ensuring users can only access functionalities for which they have the necessary permissions.

5. **Summarizing the End-to-End System Flow**
   The user enters credentials on the frontend login form, which are then sent asynchronously to the backend. The server validates these credentials, generates a JWT token upon success, and sets a cookie. The client is then redirected. For protected routes, a middleware verifies the JWT token, attaching the user object (including permissions) to the request. Subsequent controllers or authorization middlewares use these permissions to grant or deny access to specific system functionalities, thus controlling navigation.

