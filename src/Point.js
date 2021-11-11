const POINT_Y_BOUNDARY = 1000;

class Point {
  constructor(x, y, r, isStatic = false) {
    this.v = createVector(x, y)
    this.isStatic = isStatic;
    this.r = r;
    this.vPrev = createVector(x, y)
    this.color = COLORS.free;
  }

  update() {
    this.color = this.isStatic ? COLORS.static : COLORS.free;

    stroke(0, 0, 0)
    strokeWeight(0.5);
    fill(this.color);
    circle(this.v.x, this.v.y, 2 * this.r);
  }

  isInside(click) {
    return p5.Vector.dist(this.v, click) <= this.r;
  }

  toggleStatic() {
    this.isStatic = !this.isStatic
  }

  move() {
    if (this.isStatic) {
      return
    }

    const vBeforeMove = this.v.copy();

    this.v.x += this.v.x - this.vPrev.x;
    this.v.y += this.v.y - this.vPrev.y;
    this.v.y += GRAVITY;

    this.vPrev = vBeforeMove;
  }

  onClicked() {
    this.toggleStatic();
  }

  isOutOfBounds() {
    return this.v.y > POINT_Y_BOUNDARY;
  }
}
