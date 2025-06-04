import Glass from "./js/glass/glass.js";
import Mirror from "./js/glass/mirror.js";

const mirror = new Mirror();
const glass = new Glass(mirror.world);

window.setup = (event) => {
    createCanvas(windowWidth, windowHeight);
    glass.initShapesFromSVG();

    // Añadir evento de clic al lienzo
    const canvas = document.getElementById('drawing-canvas');
    canvas.addEventListener('click', (event) => {
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        // Aquí puedes definir los puntos del polígono basado en el clic
        // Por ejemplo, un polígono simple alrededor del punto de clic
        const x = event.clientX;
        const y = event.clientY;
        const points = `${x},${y} ${x+50},${y} ${x+25},${y-50}`;
        polygon.setAttribute('points', points);
        polygon.setAttribute('fill', 'rgba(0, 0, 255, 0.5)');
        canvas.appendChild(polygon);

        // Aplicar efecto de desvanecimiento
        polygon.style.transition = 'opacity 2s';
        polygon.style.opacity = '0';
        setTimeout(() => {
            polygon.remove(); // Eliminar el polígono después de desvanecerse
        }, 2000);
    });
}

// Redimensionar el canvas y el renderizador de Matter.js
window.windowResized = (event) => {
    resizeCanvas(windowWidth, windowHeight);
    mirror.resize(windowWidth, windowHeight); // Crear el suelo nuevamente
};

// Dibujar en cada frame
window.draw = (event) => {
    background(255); // Limpiar el canvas
    mirror.update(); // Actualizar el motor de Matter.js
    glass.draw(mirror.bodies); // Dibujar los trazos
};

function createBody(density, restitution, friction) {
    if (body) {
        console.log("Propiedades físicas asignadas:", {
            density,
            restitution,
            friction,
        });
        // Agregar el cuerpo al mundo
        Matter.World.add(this.world, body);
        this.bodies.push(body); // Guardar el cuerpo para sincronizarlo con p5.js

        // Aplicar efecto de desvanecimiento al polígono
        const polygon = document.querySelector('#drawing-canvas polygon');
        if (polygon) {
            polygon.style.transition = 'opacity 2s';
            polygon.style.opacity = '0';
            setTimeout(() => {
                polygon.remove(); // Eliminar el polígono después de desvanecerse
            }, 2000);
        }
    }
    return body;
}