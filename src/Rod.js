const ROD_CUT_TOLERANCE = 10;
const ROD_Y_BOUNDARY = 1000;

class Rod {
  constructor(p1, p2, length) {
    this.p1 = p1;
    this.p2 = p2;
    this.length = length;
  }

  update() {
    stroke(150,150,150);
    strokeWeight(2.5);
    line(this.p1.v.x, this.p1.v.y, this.p2.v.x, this.p2.v.y);
  }

  move() {
    const center = this.getCenterPoint();
    const direction = this.getDirection();

    if (!this.p1.isStatic) {
      this.p1.v.x = center.x + direction.x * this.length/2;
      this.p1.v.y = center.y + direction.y * this.length/2;
    }
    if (!this.p2.isStatic) {
      this.p2.v.x = center.x - direction.x * this.length/2;
      this.p2.v.y = center.y - direction.y * this.length/2;
    }
  }

  getCenterPoint() {
    return p5.Vector.add(this.p1.v, this.p2.v).div(2);
  }

  getDirection() {
    return p5.Vector.sub(this.p1.v, this.p2.v).normalize()
  }

  isInside(click) {
    return p5.Vector.dist(this.getCenterPoint(), click) <= ROD_CUT_TOLERANCE;
  }

  isOutOfBounds() {
    return this.p1.v.y > ROD_Y_BOUNDARY;
  }
}
