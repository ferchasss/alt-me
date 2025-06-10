import Shape from "./shape.js";

export default class Glass {
    constructor(_world) {
        this.world = _world; // Instancia de Matter.js
        this.shapes = []; // Lista de trazos (Shape)
        this.active_shape = null; // Trazo activo
        this.fillColor = "#000000"; // Color de relleno por defecto
    }

    /**
     * Valida si un Shape es válido (tiene al menos 3 vértices).
     * @param {Shape} shape - El Shape a validar.
     * @returns {boolean} - `true` si el Shape es válido, `false` en caso contrario.
     */
    isShapeValid(shape) {
        return shape.points.length >= 3;
    }

    /**
     * Dispara el evento personalizado 'finishShape'.
     * @param {Shape} shape - El Shape que se ha finalizado.
     */
    dispatchFinishShapeEvent(shape) {
        const event = new CustomEvent("finishShape", {
            detail: { shape },
        });
        window.dispatchEvent(event);
    }

    /**
     * Actualiza las posiciones de los shapes con base en los cuerpos de Matter.js.
     * @param {Array} bodies - Lista de cuerpos de Matter.js.
     */
    updateShapesFromBodies(bodies) {
        this.shapes.forEach((shape, index) => {
            const body = bodies[index];
            if (body) {
                // Actualizar los puntos del Shape con las posiciones de los vértices del cuerpo
                shape.points = body.vertices.map((vertex) => ({
                    x: vertex.x,
                    y: vertex.y,
                }));
            }
        });
    }

    /**
     * Dibuja todos los trazos en el canvas.
     * @param {Array} bodies - Lista de cuerpos de Matter.js.
     */
    draw(bodies) {
        const time = window.millis() / 10000; // Obtener el tiempo actual
        this.updateShapesFromBodies(bodies); // Sincronizar shapes con Matter.js
        this.shapes.forEach((shape, i) => shape.draw(time + i)); // Dibujar los shapes
    }

    /* Borra todos los trazos. */
    deleteShapes() {
        this.shapes = [];
    }
    /* Actualiza el color de relleno */
    updateColor(event) {
        this.fillColor = event.target.value;
        console.log("Nuevo color de relleno:", this.fillColor);
        this.colorLabel.style.backgroundColor = this.fillColor;
    }

    initShapesFromSVG() {
        const svg = document.getElementById('glass-puzzle');
        if (!svg) {
            console.error('SVG element #glass-puzzle not found');
            return;
        }
        // 1. Obtener viewBox o width/height
        const viewBox = svg.getAttribute('viewBox');
        let svgWidth, svgHeight, svgX = 0, svgY = 0;
        if (viewBox) {
            [svgX, svgY, svgWidth, svgHeight] = viewBox.split(' ').map(Number);
        } else {
            svgWidth = svg.width.baseVal.value;
            svgHeight = svg.height.baseVal.value;
        }
        // 2. Calcular el factor de escala
        const scaleX = windowWidth / svgWidth;
        const scaleY = windowHeight / svgHeight;
        // 3. Procesar cada figura y escalar sus puntos
        const elements = svg.querySelectorAll('path, polygon, polyline');
        elements.forEach((el) => {
            let points = [];
            if (el.tagName.toLowerCase() == 'path') {
                const d = el.getAttribute('d');
                if (d) points = this.pathToPoints(d);
            } else if (el.tagName.toLowerCase() == 'polygon' || el.tagName.toLowerCase() == 'polyline') {
                const pointsAttr = el.getAttribute('points');
                if (pointsAttr) {
                    const nums = pointsAttr.trim().split(/[\s,]+/).map(Number);
                    points = [];
                    for (let i = 0; i < nums.length; i += 2) {
                        if (!isNaN(nums[i]) && !isNaN(nums[i+1])) {
                            points.push({ x: nums[i], y: nums[i+1] });
                        }
                    }
                }
            }
            if (points.length >= 3) {
                // Escalar los puntos
                const scaledPoints = points.map(p => ({
                    x: (p.x - svgX) * scaleX,
                    y: (p.y - svgY) * scaleY
                }));
                const shape = new Shape();
                shape.points = scaledPoints;
                this.shapes.push(shape);
                console.log("points", scaledPoints)
                this.dispatchFinishShapeEvent(shape); // El listener externo creará el body
            }
        });
    }

    pathToPoints(d) {
        // Convierte el atributo d de un path SVG en un array de {x, y}
        const commands = d.split(/(?=[MLHVCSQTAZmlhvcsqtaz])/);
        const points = [];
        let currentX = 0;
        let currentY = 0;

        commands.forEach(cmd => {
            if (!cmd) return;
            const type = cmd[0];
            const coords = cmd.slice(1).trim().split(/[\s,]+/).map(Number);

            if (type === 'M' || type === 'L') {
                if (coords.length >= 2) {
                    currentX = coords[0];
                    currentY = coords[1];
                    points.push({ x: currentX, y: currentY });
                }
            } else if (type === 'H') {
                if (coords.length >= 1) {
                    currentX = coords[0];
                    points.push({ x: currentX, y: currentY });
                }
            } else if (type === 'V') {
                if (coords.length >= 1) {
                    currentY = coords[0];
                    points.push({ x: currentX, y: currentY });
                }
            } else if (type === 'Z' || type === 'z') {
                // Cierra el path conectando al primer punto
                if (points.length > 0) {
                    points.push(points[0]);
                }
            }
        });

        return points;
    }
}