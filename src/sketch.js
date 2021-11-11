const ROWS = 10;
const COLS = 13;
const SPACE = 40;
const RADIUS = 9;
const GRAVITY = 0.15;
const COLORS = {};

let cnv;
let startButton;
let resetButton;

let simulate = false;

let points = [];
let rods = [];

function onClicked({ x, y }) {
  if (simulate) {
    return
  }

  const click = createVector(x, y)
  const obj = points.find(p => p.isInside(click));

  if (obj) {
   obj.onClicked();
  }
}

function onPressed() {
  rods = rods.filter(r => !r.isInside(createVector(mouseX, mouseY)));
}

function init(xMargin, yMargin) {
  simulate = false;
  points = [];
  rods = [];

  // Init points
  for(let r = 0; r < ROWS; r++) {
    for(let c = 0; c < COLS; c++) {
      points.push(new Point(c * SPACE + xMargin, r * SPACE + yMargin + startButton.height, RADIUS))
    }
  }

  newRods = [];
  for(let idx = 0; idx < points.length; idx++) {
    // left
    if (idx % COLS !== 0) { newRods.push([points[idx - 1], points[idx]])}

    // above
    if (idx - COLS >= 0) { newRods.push([points[idx - COLS], points[idx]])}
  }
  rods = newRods.map(([p1, p2]) => new Rod(p1, p2, SPACE))
}

function setup() {
  cnv = createCanvas(600, 600);
  cnv.mouseClicked(onClicked);

  xMargin = (cnv.width - SPACE * (COLS - 1))/2;
  yMargin = (cnv.height - SPACE * (ROWS - 1))/2;

  // Setup colors
  COLORS.free = color('white');
  COLORS.static = color('red');

  // Init buttons
  startButton = createButton("start");
  startButton.size(60, 20)
  startButton.mousePressed(() => simulate = true);

  resetButton = createButton("reset");
  resetButton.size(60, 20)
  resetButton.mousePressed(init.bind(null, xMargin, yMargin));

  startButton.position(cnv.width/2 - startButton.width/2 - resetButton.width/2, 10);
  resetButton.position(cnv.width/2 - startButton.width/2 + resetButton.width/2, 10);

  init(xMargin, yMargin);
}

function draw() {
  background(220);

  stroke(0, 0, 0)
  fill('white')
  text(`rods ${rods.length}`, 5, 15)
  text(`points ${points.length}`, 5, 30)

  if (mouseIsPressed) {
    cursor(CROSS);
    onPressed();
  } else {
    cursor(ARROW);
  }

  if (!simulate) {
    points.forEach(c => c.update());
    rods.forEach(r => r.update());
    return
  }

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
