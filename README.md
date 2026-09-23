<img width="7555" height="250" alt="Titulo-2-realidades" src="https://github.com/user-attachments/assets/522bee87-3d96-4b22-b973-6bbbf1b86967" />

<div align="center">
  <h3>TAREA 03</h3>
</div>

---

Hii! Mi nombre es Yurineth Vargas Salazar y ya que estás aquí bienvenidx a mi proyecto de diseño interactivo donde usando HTML/CSS/JS y 2 bibliotecas gigantescas de la visión computacional que deconstruyen e interpretan la "realidad" que dices conocer usando sólo la cámara de tu navegador, uhum just like that!

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

| Pantalla | Script Python original | Qué hace |
|---|---|---|
| **MediaPipe** | `DibujoManos.py` | Sigue la punta del dedo índice de una de tus manos con MediaPipe Hands y dibuja una estela de partículas que se desvanece depués de 10seg, puedes cerrar el puño para dejar de dibujar o levantar el "pincel". |
| **OpenCV** | `3colores.py` | Extrae, cada pocos fotogramas, los 3 colores dominantes de la imagen mediante K-Means y muestra su nombre y código hexadecimal. |
| **MediaPipe + OpenCV** | `InstrumentoVisual.py` | Combina ambas: dibuja con el dedo usando colores extraídos en vivo de la cámara (K-Means), usa tu puño para levantar el "pincel" y da click a los colores en la esquina superior izquierda para cambiar el sonido de cada trazo, o entre más alto o bajo este tu dibujo, diferente será el tono. |

### Decisiones de adaptación

- **MediaPipe Hands**: se usa la librería oficial `@mediapipe/hands` vía
  CDN (jsDelivr), la misma tecnología del script en Python, corriendo
  aquí directamente en el navegador.
- **K-Means (OpenCV)**: en vez de cargar `opencv.js` completo (~8 MB)
  solo para esta operación, se reimplementó el algoritmo K-Means en
  JavaScript puro (`kMeans()` en `script.js`). El resultado es
  equivalente al de `cv2.kmeans()`.
- **PyAudio → Web Audio API**: la síntesis de audio en tiempo real se
  reemplazó por osciladores de la Web Audio API (`OscillatorNode`),
  usando `square`, `sine` y `sawtooth` para aproximar los timbres
  "tecno", "pop" y "rock" del programa original.

## Créditos de color usados

- Fondo: `#FFFFFF`
- Verde lima: `#B4CC4E`
- Morado oscuro: `#4B0C3B`
- Magenta: `#853A76`
