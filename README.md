
# See me | Alt+Me Feedback

## Feedback

### [+13] Metadata, Markup y Accesibilidad  
**Aspectos Positivos:**  
- Se incluye favicon. 
- Buen markup semántico y estructura HTML.  
- Buen manejo de variables, arreglos y eventos; estos elementos añaden un nivel interesante de complejidad.  
- Es positivo arriesgarse con algunas funcionalidades, aunque en este caso hubo partes que pudieron simplificarse y funcionar mejor con el markup, especialmente en el uso de botones y enlaces. (Prefiere uso de links para referencias a otras páginas, no botones con js, algunos browsers pueden desactivarlo y es un consumo de recursos innecesarios, ya existe un tag correcto para cada funcionalidad)
- Faltó la integración de metadata, lo cual complementa accesibilidad y previsualización en redes sociales

---

### [+12] Funcionalidad / Interactividad  
**Observaciones:**  
- Hay oportunidades de mejora siguiendo buenas prácticas. Por ejemplo, usar `<a>` en lugar de `<button>` para redireccionar a otras páginas.  
- El uso de JavaScript para redirigir desde un botón (#mirror) podría haberse resuelto con un enlace directo. Prioriza eventos nativos de etiquetas HTML para garantizar funcionalidad incluso cuando JavaScript esté deshabilitado.  
- En la sección *"ordena"*, sería útil incluir una breve instrucción al inicio para orientar al usuario sobre el propósito de la página.  
- Es positivo el uso del cursor `'drag'` al hacer *hover*, pero hay errores en la implementación del cursor `'no-drop'`, que se muestra incluso cuando se debería estar arrastrando. El cursor adecuado sería `'grabbing'`.  
- Hay bugs que afectan la interacción con los elementos drag & drop, especialmente en mobile donde no existen cursores ni estados de *hover*. La experiencia se vuelve confusa sin ayudas visuales ni instrucciones claras.  

---

### [+13] Diseño y estilo  
**Aspectos Positivos:**  
- El diseño es consistente y visualmente atractivo.  
- La paleta en blanco, negro y limón es distintiva y da coherencia visual.  
- Buen contraste en botones con fondo limón y tipografía negra o viceversa.  
- La tipografía elegida tiene buena legibilidad.  

**Áreas de mejora:**  
- Botones con fondo limón y texto blanco dificultan la lectura.  
- Los textos sobre imágenes (aunque sean en B/N) pierden legibilidad.  
- Añadir un estado de *hover* que haga zoom o modifique la opacidad en imágenes mejoraría la lectura y experiencia visual.  

---

### [+13] Responsive  
**Observaciones:**  
- En general, el diseño es adaptable, pero en mobile hay margen de mejora.  
- La lectura se vuelve difícil por la cantidad de líneas con muy pocas palabras (3–5 por línea), sin suficiente separación entre párrafos.  
- Agregar espaciado vertical o un `<br>` en la intro ayudaría a una lectura más fluida.  

---

### [+13] Contenido  
**Aspectos Positivos:**  
- El contenido tiene un enfoque personal claro; se nota la intención de comunicar una historia de dualidad.  

**Áreas de mejora:**  
- Hay secciones donde el mensaje pierde claridad por problemas de contraste y lectura.
- En *"ordena"*, el contraste está bien en las tres palabras arrastrables, pero no en el resto, donde se usa texto negro sobre fondo oscuro.  
- El contenido se ve opacado por una mala distribución y ejecución de ajustes tipográficos un mejor tratamiento tipográfico (tamaños, jerarquía, interacción) habría fortalecido la narrativa.  

---

### [+14] Creatividad  
**Observaciones:**  
- El enfoque técnico fue ambicioso, lo cual es admirable. Escuché comentarios como “Qué complejo”, lo cual refleja tu esfuerzo.  
- Sin embargo, es importante recordar que una solución efectiva no siempre es la más compleja. Un buen programador resuelve problemas de forma eficaz, clara y simple.  

---

### [+9] Calidad del código  
**Aspectos Positivos:**  
- Markup semántico con buena indentación.  
- Buen uso de JavaScript y definición de layouts/componentes.  
- Convenciones de nombres adecuadas, aunque simples, bien aplicadas.  
- Implementación del atributo `alt` en imágenes, lo cual es una buena práctica.  

**Área de mejora:**  
- Evita usar descripciones genéricas en `alt`. En lugar de `alt="Antro"`, podrías usar algo como `alt="Con mis amigos de fiesta, Antro, CDMX"`. Esto no solo mejora la accesibilidad, también ayuda al SEO.  
- Se detectaron bugs en la sección *"ordena"*, lo que impacta negativamente la experiencia de usuario.  