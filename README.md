<img width="7555" height="250" alt="Titulo-2-realidades" src="https://github.com/user-attachments/assets/522bee87-3d96-4b22-b973-6bbbf1b86967" />

<div align="center">
  <h3>TAREA 03</h3>
</div>

---

Hii! Mi nombre es Yuri y ya que estás aquí bienvenidx a mi proyecto de diseño interactivo donde usando HTML/CSS/JS y 2 bibliotecas pioneras de la visión computacional he diseñado una página web capaz de deconstruir e interpretar la "realidad" que dices conocer usando sólo la cámara de tu navegador, uhum just like that!

- Repo referencia: [dos-realidades](https://github.com/fefeliperoar/dos-realidades.git) THXX PROFE FELIPE! <3

## ¿Cómo probarlo?

- Repositorio GitHub: `https://github.com/yusrdg/Dos_Realidades`
- Publicado con GitHub Pages: `https://yusrdg.github.io/Dos_Realidades/`


## Estructura de archivos

| Archivo / Carpeta | Descripción |
| :--- | :--- |
| `index.html` | Elementos de página web, orden y llamados. |
| `style.css` | Estilos, animaciones de fondo y layout responsivo. |
| `script.js` | Lógica de cámara, overlays y las 3 demos. |
| `assets/` | Iconos SVG exportados de Figma. |
| `python-originales/` | Scripts Python originales de las demos. |
| `README.md` | Here u are! es la documentación del proyecto. |


## 3 pantallas

Estos tres bloques son una adaptación a JavaScript, pensada para correr en el navegador, de tres programas que originalmente escribí en Python con OpenCV, MediaPipe y PyAudio. El código fuente en Python de cada uno se incluye como referencia en `python-originales/`.

| Pantalla | Script Python original | ¿Qué hace? |
|---|---|---|
| **MediaPipe** | `DibujoManos.py` | Sigue la punta del dedo índice de una de tus manos con MediaPipe Hands y dibuja una estela de partículas que se desvanece depués de 10seg, puedes cerrar el puño para dejar de dibujar o levantar el "pincel". |
| **OpenCV** | `3colores.py` | Extrae, cada pocos fotogramas, los 3 colores dominantes de la imagen mediante K-Means y muestra su nombre y código hexadecimal. |
| **MediaPipe + OpenCV** | `InstrumentoVisual.py` | Combina ambas: dibuja con el dedo usando colores extraídos en vivo de la cámara (K-Means), usa tu puño para levantar el "pincel" y da click a los colores en la esquina superior izquierda para cambiar el sonido de cada trazo, o entre más alto o bajo este tu dibujo, diferente será el tono. |

## Paleta de color usada

- Fondo: `#FFFFFF`
- Verde lima: `#B4CC4E`
- Morado oscuro: `#4B0C3B`
- Magenta: `#853A76`

## Diagrama de flujo

<img width="3204" height="2276" alt="dppi - Encargo 3" src="https://github.com/user-attachments/assets/0c986437-9c26-4b3c-9dc1-9421fa1f18c2" />

---

<div align="center">
  <h3>«El arte te da la posibilidad de mentir, de imaginar, de cambiar los esquemas».</h3>
  — Cerati
</div>
