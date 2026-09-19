# Dos realidades son infinitas realidades

Sitio interactivo en HTML/CSS/JS que deconstruye e interpreta la "realidad
visual" a través de dos arquitecturas de visión computacional —
**MediaPipe** y **OpenCV**— usando la cámara del navegador.

Proyecto de **Yurineth Vargas** — Ejercicio_02 · DPPI_2026 · Diseño UDP.

## Ver la demo

Repositorio GitHub: `https://github.com/yusrdg/Dos_Realidades`
Publicado con GitHub Pages: `(https://yusrdg.github.io/Dos_Realidades/)`

## Estructura

```
dos-realidades/
├── index.html            Marcado de las dos pantallas + overlays
├── style.css              Estilos, animaciones de fondo y layout responsivo
├── script.js               Lógica de cámara, overlays y las 3 demos
├── assets/                 Iconos SVG exportados de Figma
├── python-originales/      Scripts Python originales (referencia)
└── README.md
```

## Las 3 mini-pantallas

Estos tres bloques son una adaptación a JavaScript, pensada para correr
en el navegador, de tres programas que originalmente escribí en Python
con OpenCV, MediaPipe y PyAudio. El código fuente en Python de cada uno
se incluye como referencia en `python-originales/`.

| Pantalla | Script Python original | Qué hace |
|---|---|---|
| **MediaPipe** | `DibujoManos.py` | Sigue la punta del dedo índice con MediaPipe Hands y dibuja una estela de partículas que se desvanece con el tiempo. |
| **OpenCV** | `3colores.py` | Extrae, cada pocos fotogramas, los 3 colores dominantes de la imagen mediante K-Means y muestra su nombre y código hexadecimal. |
| **MediaPipe + OpenCV** | `InstrumentoVisual.py` | Combina ambas: dibuja con el dedo usando colores extraídos en vivo de la cámara (K-Means) y convierte cada trazo en sonido al reproducirlo, según la altura y el lápiz usado. |

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

## Cómo funciona la página

1. **Pantalla 1**: introducción con fondo de manchas de color animadas
   y una tarjeta de vidrio esmerilado; el botón "Continuar" hace scroll
   suave a la pantalla principal.
2. **Pantalla 2**: al activar el interruptor "Enciende tu cámara", el
   navegador pide permiso de cámara (`getUserMedia`) y arrancan las
   tres demos en simultáneo, compartiendo el mismo stream de video.
   Cada tarjeta tiene un botón "¿Cómo funciona?" que abre un overlay
   explicativo.
3. Al final hay una sección desplegable ("¿Qué es lo que ha sucedido?")
   con una reflexión sobre el ejercicio.

## Requisitos para correr en local

Por seguridad, los navegadores solo permiten acceso a la cámara
(`getUserMedia`) en `https://` o en `localhost`. Para probar en tu
máquina, sirve la carpeta con un servidor local, por ejemplo:

```bash
npx serve .
# o
python -m http.server 8000
```

Y abre `http://localhost:<puerto>`. GitHub Pages ya sirve el sitio por
`https://`, así que la demo publicada funcionará sin pasos extra.

## Publicar en GitHub Pages

1. Crea un repositorio y sube el contenido de esta carpeta a la raíz
   (o a una rama `gh-pages` / carpeta `docs`, según prefieras).
2. En **Settings → Pages**, elige la rama y carpeta desde donde servir.
3. Espera unos minutos y tu sitio quedará disponible en
   `https://<tu-usuario>.github.io/<tu-repo>/`.

## Créditos de color

- Fondo: `#FFFFFF`
- Verde lima: `#B4CC4E`
- Morado oscuro: `#4B0C3B`
- Magenta: `#853A76`
