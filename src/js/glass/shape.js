export default class Shape {
    constructor(args={}) {
        this.points = []; // Lista de puntos del trazo
        this.strokeColor = 'white';
        this.fillColor = 'red';
        this.body = null;
    }

    addPoint(x, y) {
        this.points.push(createVector(x, y));
    }

    setBody(body) {
        this.body = body; // Asigna un cuerpo de Matter.js al Shape
    }

    draw(t) {
        fill(this.fillColor);
        stroke(this.strokeColor);
        beginShape();
        this.points.forEach(p => vertex(p.x, p.y));
        endShape(CLOSE);
    }
}
