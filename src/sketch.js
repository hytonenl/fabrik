let cnv;
let startButton;
let resetButton;

const rows = 10;
const cols = 7;
const space = 50;
const radius = 10
const rodCutTolerance = 15;
let gravity = 0.1;

let simulate = false;

let points = [];
let rods = [];
let colors = {};

class Point {
  constructor(x, y, isStatic = false) {
    this.v = createVector(x, y)
    this.vPrev = createVector(x, y)
    this.r = radius;
    this.isStatic = isStatic;
    this.color = colors.free;
  }

  update() {
    this.color = this.isStatic ? colors.static : colors.free;

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
    // Calculate new position
    if (this.isStatic) {
      return
    }
    const vBeforeMove = this.v.copy();

    this.v.x += this.v.x - this.vPrev.x;
    this.v.y += this.v.y - this.vPrev.y;
    this.v.y += gravity;

    this.vPrev = vBeforeMove;
  }

  onClicked() {
    this.toggleStatic();
  }

  isOutOfBounds() {
    return this.v.y > 1000;
  }
}

class Rod {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  update() {
    //stroke(255, 255, 255);
    stroke(0,0,0);
    strokeWeight(2.5);
    line(this.p1.v.x, this.p1.v.y, this.p2.v.x, this.p2.v.y);

    //const center = this.getCenterPoint();
    //circle(center.x, center.y, 5)
  }

  move() {
    const center = this.getCenterPoint();
    const direction = this.getDirection();

    if (!this.p1.isStatic) {
      this.p1.v.x = center.x + direction.x * space/2;
      this.p1.v.y = center.y + direction.y * space/2;
    }
    if (!this.p2.isStatic) {
      this.p2.v.x = center.x - direction.x * space/2;
      this.p2.v.y = center.y - direction.y * space/2;
    }
  }

  getCenterPoint() {
    return p5.Vector.add(this.p1.v, this.p2.v).div(2);
  }

  getDirection() {
    return p5.Vector.sub(this.p1.v, this.p2.v).normalize()
  }

  isInside(click) {
    return p5.Vector.dist(this.getCenterPoint(), click) <= rodCutTolerance;
  }

  isOutOfBounds() {
    return this.p1.v.y > 1000 || this.p2.v.y > 1000;
  }
}

function onClicked({ x, y }) {
  const click = createVector(x, y)

  let obj;
  if (!simulate) {
    obj = points.find(p => p.isInside(click));
  } else {
    obj = undefined;
  }

  if (obj) {
   obj.onClicked();
  }
}

function onPressed() {
  rods = rods.filter(r => !r.isInside(createVector(mouseX, mouseY)));
}

function init() {
  simulate = false;
  points = [];
  rods = [];

  // Init points
  for(let r = 0; r < rows; r++) {
    for(let c = 0; c < cols; c++) {
      points.push(new Point(c * space + xMargin, r * space + yMargin + startButton.height))
    }
  }

  newRods = [];
  for(let idx = 0; idx < points.length; idx++) {
    // left
    if (idx % cols !== 0) { newRods.push([points[idx - 1], points[idx]])}

    // above
    if (idx - cols >= 0) { newRods.push([points[idx - cols], points[idx]])}
  }
  rods = newRods.map(([p1, p2]) => new Rod(p1, p2))
}

function setup() {
  cnv = createCanvas(400, 600);
  cnv.mouseClicked(onClicked);
  cnv.mousePressed(onPressed);

  xMargin = (cnv.width - space * (cols - 1))/2;
  yMargin = (cnv.height - space * (rows - 1))/2;

  colors = {
    free: color(255, 255, 255),
    static: color(255, 0, 0)
  }

  // Init buttons
  startButton = createButton("start");
  startButton.size(60, 20)
  startButton.mousePressed(() => simulate = true);

  resetButton = createButton("reset");
  resetButton.size(60, 20)
  resetButton.mousePressed(init);

  startButton.position(cnv.width/2 - startButton.width/2 - resetButton.width/2, 10);
  resetButton.position(cnv.width/2 - startButton.width/2 + resetButton.width/2, 10);

  init();
}

function draw() {
  angleMode(RADIANS);
  background(220);
  if (mouseIsPressed) {
    cursor(CROSS);
    onPressed();
  } else {
    cursor(ARROW);
  }

  if (!simulate) {
    points.forEach(c => c.update());
    rods.forEach(r => r.update());
  } else {
    points.forEach(c => {
      c.move();
      c.update();
    });
    rods.forEach(r => {
      r.move();
      r.update();
    });
    rods = rods.filter(r => !r.isOutOfBounds());
    points = points.filter(p => !p.isOutOfBounds());
  }

  stroke(0, 0, 0)
  text(`rods ${rods.length}`, 0, 15)
  text(`points ${points.length}`, 0, 30)
}
