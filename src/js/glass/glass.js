import Glass from "./glass.js";
import Mirror from "./mirror.js";

const mirror = new Mirror();
const glass = new Glass(mirror.world); // Esto probablemente debería ser `mirror.world` si DigitalWorld está en Mirror

window.setup = (event) => {
    createCanvas(windowWidth, windowHeight);
    glass.initShapesFromSVG();
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