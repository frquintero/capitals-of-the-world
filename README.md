# 🌍 Capitales del Mundo - Juego Educativo

Una aplicación web interactiva para aprender y practicar las capitales de todos los países del mundo.

## 🎯 Características Principales

La aplicación cuenta con dos modos de juego y una variedad de funcionalidades para una experiencia completa:

### Juego de Capitales

- **Pantalla de Bienvenida Interactiva**: Te recibe con un resumen de tus estadísticas globales (partidas jugadas, aciertos totales, continentes explorados).
- **Aprendizaje por Continentes**: Elige entre 6 continentes para enfocar tu conocimiento.
- **Partidas de 5 Preguntas Aleatorias**: Cada sesión presenta 5 preguntas únicas para una experiencia dinámica.
- **Opciones Múltiples Inteligentes**: Cada pregunta ofrece 3 opciones de respuesta, incluyendo la capital correcta y alternativas relevantes.
- **Feedback Visual e Instantáneo**: Las respuestas se marcan al instante como correctas (verde) o incorrectas (rojo).
- **Indicador de Progreso**: Sigue tu avance en la partida con una barra de progreso visual.
- **Resultados Detallados**: Al finalizar, revisa tu puntuación, porcentaje de aciertos y un resumen completo de cada pregunta.
- **Persistencia de Datos**: Tus estadísticas se guardan en el navegador (`localStorage`) para seguir tu progreso a largo plazo.
- **Opción de Jugar de Nuevo**: Reinicia la partida en el mismo continente para mejorar tu puntuación.

### Juego de Tic-Tac-Toe

- **Doble Modo de Dificultad**:
  - **Modo Fácil**: La computadora realiza movimientos aleatorios, ideal para principiantes.
  - **Modo Minimax**: La computadora utiliza el algoritmo Minimax para jugar de forma óptima, ofreciendo un verdadero desafío.
- **Interfaz Clásica e Interactiva**: Disfruta del tradicional juego de 3x3 con controles sencillos.
- **Controles de Juego**: Reinicia la partida o vuelve al menú principal en cualquier momento.

## 🌎 Continentes Disponibles

- 🇪🇺 Europa (20 países)
- 🇺🇸 América del Norte (18 países)
- 🇧🇷 América del Sur (13 países)
- 🇨🇳 Asia (21 países)
- 🇰🇪 África (20 países)
- 🇦🇺 Oceanía (15 países)

## 🎮 Cómo Jugar

1. **Inicia la aplicación**: Abre `index.html` en tu navegador.
2. **Elige un modo de juego** desde la pantalla de bienvenida: "Comenzar a Jugar" (Capitales) o "Jugar Tic-Tac-Toe".
3. **Si eliges Capitales**: Selecciona un continente, responde las 5 preguntas y revisa tus resultados.
4. **Si eliges Tic-Tac-Toe**: Selecciona un modo de dificultad y desafía a la computadora.
5. **Navega fácilmente**: Usa los botones para jugar de nuevo, cambiar de continente o volver al menú principal.

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y moderna
- **CSS3**: Diseño responsivo con gradientes y animaciones
- **JavaScript ES6+**: Lógica del juego y manejo de datos
- **JSON**: Almacenamiento de datos de países y capitales
- **LocalStorage**: Persistencia de estadísticas del jugador

## 📊 Estadísticas del Juego

La aplicación guarda automáticamente:

- Número total de juegos jugados
- Preguntas respondidas correctamente
- Continentes explorados

## 🚀 Instalación

1. Clona este repositorio o descarga los archivos
2. Abre `index.html` en tu navegador web
3. ¡Comienza a aprender las capitales del mundo!

## 📁 Estructura del Proyecto

```text
capitals-of-the-world/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica del juego
├── README.md           # Documentación
└── data/
    └── countries.json  # Base de datos de países y capitales
```

## 🎨 Características del Diseño

- **Interfaz moderna** con gradientes y sombras
- **Animaciones suaves** para mejor experiencia de usuario
- **Colores intuitivos** para respuestas correctas/incorrectas
- **Diseño responsivo** que se adapta a cualquier dispositivo
- **Indicador de progreso** durante el juego

## 🔧 Mejoras Futuras

- [ ] Agregar modo difícil con más opciones
- [ ] Implementar temporizador por pregunta
- [ ] Añadir banderas de los países
- [ ] Sistema de logros y recompensas
- [ ] Modo multijugador
- [ ] Exportar estadísticas a PDF

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Contribuciones

¡Las contribuciones son bienvenidas! Si encuentras algún error o tienes ideas para mejorar la aplicación:

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/NuevaFeature`)
3. Haz commit de tus cambios (`git commit -m 'Agrega nueva feature'`)
4. Push a la rama (`git push origin feature/NuevaFeature`)
5. Abre un Pull Request

## 🙏 Agradecimientos

- Datos de países y capitales obtenidos de fuentes confiables
- Inspirado en la necesidad de herramientas educativas interactivas

---

**¡Diviértete aprendiendo las capitales del mundo!** 🌍✨
