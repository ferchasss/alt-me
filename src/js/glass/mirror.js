import Matter from "matter-js";
import decomp from "poly-decomp"; // Importar poly-decomp

export default class Mirror extends Matter.World { // Asumiendo que Mirror extiende o usa DigitalWorld
    constructor() {
        super(); // Llama al constructor de Matter.World si extiende
        Matter.Common.setDecomp(decomp);
        // Crear el motor y el mundo de Matter.js
        this.engine = Matter.Engine.create();
        this.world = this.engine.world; // Este es el mundo que se pasa a Glass
        this.bodies = []; // Lista de cuerpos rígidos
        // Configurar el renderizador (opcional)
        this.render = Matter.Render.create({
            element: document.body, // Esto puede necesitar ajustarse dependiendo de dónde quieres que se renderice
            engine: this.engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: true, // Mostrar wireframes para depuración
            },
        });
        // Configurar el MouseConstraint
        this.mouse = Matter.Mouse.create(this.render.canvas);
        this.mouseConstraint = Matter.MouseConstraint.create(this.engine, {
            mouse: this.mouse,
            constraint: {
                stiffness: 0.2, // Rigidez del arrastre
                render: {
                    visible: true, // Ocultar la línea del constraint
                },
            },
        });
        this.render.mouse = this.mouse; // Asignar el mouse al renderizador
        // Agregar el MouseConstraint al mundo
        Matter.World.add(this.world, this.mouseConstraint);
        // Iniciar el motor y el renderizador
        Matter.Runner.run(this.engine);
        Matter.Render.run(this.render);
        this.adjustWalls();
        this.setupEvents();
        this.styleCanvas();
    }
    
    styleCanvas() {        
        const canvas = this.render.canvas;
        canvas.style.opacity = 0; // Canvas de Matter.js invisible
        canvas.style.background = "transparent";
        canvas.style.zIndex = "30"; // Asegurar que esté arriba del canvas de p5.js para eventos de mouse
        // Posicionamiento absoluto para superponer
        canvas.style.position = "absolute";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.pointerEvents = "none"; // Permitir clicks a través del canvas de Matter.js
    }
    
    deleteBodies() {
        this.bodies.forEach((body) => {
            Matter.World.remove(this.world, body);
        });
        this.bodies = []; // Limpiar la lista de cuerpos
    }
    
    setupEvents() {
        // Escuchar el evento de cambio de gravedad
        this.gravityInput = document.querySelector("#gravity-input");
        this.gravityLabel = document.querySelector("label#gravity-label");
        if(this.gravityLabel && this.gravityInput) {
             this.gravityLabel.addEventListener("click", () => this.gravityInput.classList.remove("hidden"));
             this.gravityInput.addEventListener("input", (event) => this.updateGravity(event.target.value));
             this.gravityInput.addEventListener("pointerup", () => {
                 this.gravityInput.classList.add("hidden")
             });
        }

        window.addEventListener("finishShape", (event) => {
            const shape = event.detail.shape;
            console.log("shape", shape);
            if (shape) {
                const body = this.createBody(shape.points);
                shape.setBody(body); // Asignar el cuerpo al shape
            }
        });

        // Evento para detectar cuando un cuerpo es arrastrado
        Matter.Events.on(this.mouseConstraint, "startdrag", (event) => {
            console.log("Cuerpo arrastrado:", event.body);
        });

        // Evento para detectar cuando se suelta un cuerpo
        Matter.Events.on(this.mouseConstraint, "enddrag", (event) => {
            console.log("Cuerpo soltado:", event.body);
        });

        // Permitir eventos de mouse a través del canvas de Matter.js
        this.render.canvas.style.pointerEvents = 'none';
        // Habilitar eventos de mouse para Matter.js en el canvas de p5.js
        const p5Canvas = document.querySelector('canvas');
        if(p5Canvas) {
            p5Canvas.style.pointerEvents = 'auto';
        }

        // Re-sincronizar el mouse constraint con el canvas de p5.js
        this.mouse.element = p5Canvas || this.render.canvas; // Usar el canvas de p5.js si existe, si no, el de Matter.js
        this.mouse.mouseupEvents = [];
        this.mouse.mousedownEvents = [];
        this.mouse.mousemoveEvents = [];
        Matter.Events.on(this.mouse, 'mousedown', this.mouse.mousedown); // Vuelve a enlazar los eventos
        Matter.Events.on(this.mouse, 'mouseup', this.mouse.mouseup);
        Matter.Events.on(this.mouse, 'mousemove', this.mouse.mousemove);
    }

    /**
     * Cambia la gravedad del mundo de Matter.js.
     * @param {number} value - Nuevo valor de gravedad.
     */
    updateGravity(value) {
        const gravityValue = parseFloat(value);
        this.engine.world.gravity.y = gravityValue;
        console.log("Gravedad actualizada a:", gravityValue);
    }

    resize(_width, _height) {
        // Remover renderizador anterior si existe
        if (this.render && this.render.canvas) {
             Matter.Render.stop(this.render);
             this.render.canvas.remove();
             this.render = null; // Limpiar referencia
         }

         // Volver a crear el renderizador con las nuevas dimensiones
         this.render = Matter.Render.create({
             element: document.body, // Esto puede necesitar ajustarse
             engine: this.engine,
             options: {
                 width: _width,
                 height: _height,
                 wireframes: true,
             },
         });
         Matter.Render.run(this.render);

        this.adjustWalls();

        // Re-configurar el mouse constraint con el nuevo canvas del renderizador
         this.mouse.element = this.render.canvas;
         this.render.mouse = this.mouse;

        // Asegurarse de que el canvas de Matter.js esté invisible y superpuesto
        this.styleCanvas();

        // Asegurarse de que el canvas de p5.js permita eventos de mouse
        const p5Canvas = document.querySelector('canvas');
        if(p5Canvas) {
             p5Canvas.style.pointerEvents = 'auto';
        }
    }

    /* Crea o actualiza un cuerpo rígido estático que actúa como el suelo. */
    adjustWalls() {
        // Eliminar las paredes existentes si ya están definidas
        if (this.walls) {
            this.walls.forEach((wall) => Matter.World.remove(this.world, wall));
        }
        // Obtener el alto del footer
        const footer = document.querySelector('#footer-controls'); // Asegúrate de tener un footer con este ID si quieres excluirlo
        const footerHeight = footer ? footer.offsetHeight : 0;

        // Crear nuevas paredes
        const thickness = 10; // Grosor de las paredes
        const width = window.innerWidth;
        const height = window.innerHeight - footerHeight; // Altura ajustada para excluir el footer

        const topWall = Matter.Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { isStatic: true });
        const bottomWall = Matter.Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true });
        const leftWall = Matter.Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { isStatic: true });
        const rightWall = Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { isStatic: true });

        // Agregar las paredes al mundo
        this.walls = [topWall, bottomWall, leftWall, rightWall];
        Matter.World.add(this.world, this.walls);
    }

    /**
     * Añade un nuevo cuerpo al mundo físico a partir de vértices.
     * @param {Array} vertices - Lista de vértices [{x, y}, {x, y}, ...].
     */
    createBody(vertices) {
        console.log("Añadiendo forma al mundo físico:", vertices);
        // Calcular el centroide de los vértices
        const centroid = this.calculateCentroid(vertices);
        // Calcular el área del cuerpo
        const area = this.calculatePolygonArea(vertices);
        // Ajustar propiedades físicas según el área
        const density = 10 * area; // Densidad proporcional al área
        const restitution = Math.max(0.1, 1 - area / 10000); // Menor restitución para áreas grandes
        const friction = Math.min(1, 0.1 + area / 5000); // Mayor fricción para áreas grandes

        // Crear el cuerpo en la posición del centroide
        // Usar Matter.Bodies.fromVertices es sensible al orden de los vértices y si es cóncavo/convexo
        // Si los shapes son complejos/cóncavos, Matter.js necesita poly-decomp
        // Asegurarse de que los vértices estén en orden horario o antihorario y que no haya auto-intersecciones
        let body;
        try {
             body = Matter.Bodies.fromVertices(
                 centroid.x, // Posición inicial en X
                 centroid.y, // Posición inicial en Y
                 [vertices], // Matter.Bodies.fromVertices espera un array de arrays de vértices
                 {
                     isStatic: false,
                     density: density, // Densidad proporcional al área
                     restitution: restitution, // Elasticidad ajustada
                     friction: friction, // Fricción ajustada
                 },
             );

             if (!body) {
                  console.error("Error: Failed to create body from vertices. The vertices might form a concave shape or be in the wrong order.");
                  // Intentar crear un cuerpo convexo simple como fallback si fromVertices falla
                  // body = Matter.Bodies.polygon(centroid.x, centroid.y, vertices.length, 10); // Ejemplo simple, ajusta el radio si es necesario
                  return null; // No se pudo crear el cuerpo
             }

        } catch (e) {
             console.error("Error creating body from vertices: ", e);
             console.error("Vertices:", vertices);
             return null; // Retorna null si hay una excepción
        }


        if (body) {
            console.log("Propiedades físicas asignadas:", {
                density,
                restitution,
                friction,
            });
            // Agregar el cuerpo al mundo
            Matter.World.add(this.world, body);
            this.bodies.push(body); // Guardar el cuerpo para sincronizarlo con p5.js
        }
        return body;
    }

    /**
     * Calcula el área de un polígono dado sus vértices.
     * @param {Array} vertices - Lista de vértices [{x, y}, {x, y}, ...].
     * @returns {number} - Área del polígono.
     */
    calculatePolygonArea(vertices) {
        let area = 0;
        const n = vertices.length;

        for (let i = 0; i < n; i++) {
            const current = vertices[i];
            const next = vertices[(i + 1) % n]; // El siguiente vértice (circular)
            area += current.x * next.y - next.x * current.y;
        }

        return Math.abs(area / 2); // Retornar el área absoluta
    }

    /**
     * Calcula el centroide de un conjunto de vértices.
     * @param {Array} vertices - Lista de vértices [{x, y}, {x, y}, ...].
     * @returns {Object} - Centroide {x, y}.
     */
    calculateCentroid(vertices) {
        const sum = vertices.reduce(
            (pos, vertex) => {
                pos.x += vertex.x;
                pos.y += vertex.y;
                return pos;
            }, { x: 0, y: 0 }
        );
        return {
            x: sum.x / vertices.length,
            y: sum.y / vertices.length,
        };
    }

    /**
     * Actualiza el motor físico en cada frame.
     */
    update() {
        Matter.Engine.update(this.engine);
        // Sincronizar cuerpos de Matter.js con formas de p5.js
        this.bodies.forEach(body => {
            if (body.p5Shape) { // Asumiendo que guardaste una referencia al p5Shape en el body
                body.p5Shape.position.x = body.position.x;
                body.p5Shape.position.y = body.position.y;
                body.p5Shape.rotation = body.angle; // Actualizar rotación
            }
        });
    }
} 