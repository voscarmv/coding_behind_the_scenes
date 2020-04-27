// window.onload = function() {
  var c = document.getElementById("canv");
  var ctx = c.getContext("2d");
  c.width = 700;

  class Square {
    constructor(x, y, wh, ctxt){
      this.xpos = x;
      this.ypos = y;
      this.size = wh;
      this.ctx = ctxt;
      this.selected = false;
      this.pointerx = 0;
      this.pointery = 0;
      this.left_line = null;
      this.right_line = null;
    }
    draw(){
      this.ctx.beginPath();
      this.ctx.rect(this.xpos, this.ypos, this.size, this.size);
      this.ctx.stroke();
    }
    get_center_x(samples=128){
      // vertically
      // let ch = ctx.canvas.height;
      let cw = ctx.canvas.width;
      let sqcenterx = this.xpos + this.size/2;
      // let sqcentery = this.ypos + this.size/2;

      // let datay = ch/2 - sqcentery;
      let datax = Math.round(sqcenterx / (cw/samples));
      return datax;
    }
    get_center_y(samples=128){
      // horizontally
      let ch = ctx.canvas.height;
      // let cw = ctx.canvas.width;
      // let sqcenterx = this.xpos + this.size/2;
      let sqcentery = this.ypos + this.size/2;

      let datay = (ch/2 - sqcentery)/(samples/2);
      // let datax = Math.round(sqcenterx / (cw/samples));
      return datay;
    }
    pointer_in(ptrx, ptry){
      if(ptrx >= this.xpos && ptrx <= this.xpos + this.size && ptry >= this.ypos && ptry <= this.ypos + this.size){
        return true;
      } else {
        return false;
      }
    }
    assign_left_line(line){
      line.ctx = this.ctx
      this.left_line = line;
      this.update_left_line();
    }
    update_left_line(){          
      this.left_line.xend = this.xpos + (this.size / 2);
      this.left_line.yend = this.ypos + (this.size / 2);
    }
    assign_right_line(line){
      line.ctx = this.ctx
      this.right_line = line;
      this.update_right_line();
    }
    update_right_line(){
      this.right_line.xpos = this.xpos + (this.size / 2);
      this.right_line.ypos = this.ypos + (this.size / 2);
    }
    select_square(ptrx, ptry){
      this.selected = true;
      this.pointerx = ptrx - this.xpos;
      this.pointery = ptry - this.ypos;
    }
    drag_square(ptrx, ptry){
      this.xpos = ptrx - this.pointerx;
      this.ypos = ptry - this.pointery;
      if(this.left_line != null){
        this.update_left_line();
      }
      if(this.right_line != null){
        this.update_right_line();
      }
    }
  };

  class Line {
    constructor(x, y, ye, xe, ctxt){
      this.xpos = x;
      this.ypos = y;
      this.xend = xe;
      this.yend = ye;
      this.ctx = ctxt;
    }
    draw(){
      this.ctx.beginPath();
      this.ctx.moveTo(this.xpos, this.ypos);
      this.ctx.lineTo(this.xend, this.yend);
      this.ctx.stroke();
    }
  }

  // let sq1 = new Square(0, c.height/2, 30, ctx);
  // let sq2 = new Square(c.width/10, c.height/2, 30, ctx);
  // let sq3 = new Square(2*c.width/10, c.height/2, 30, ctx);
  // let sq4 = new Square(3*c.width/10, c.height/2, 30, ctx);
  // let sq5 = new Square(4*c.width/10, c.height/2, 30, ctx);
  // let sq6 = new Square(5*c.width/10, c.height/2, 30, ctx);
  // let sq7 = new Square(6*c.width/10, c.height/2, 30, ctx);
  // let sq8 = new Square(7*c.width/10, c.height/2, 30, ctx);
  // let sq9 = new Square(8*c.width/10, c.height/2, 30, ctx);
  // let sq10 = new Square(9*c.width/10, c.height/2, 30, ctx);
  // let sq11 = new Square(c.width, c.height/2, 30, ctx);
  // let ln1 = new Line();
  // let ln2 = new Line();
  // let ln3 = new Line();
  // let ln4 = new Line();
  // let ln5 = new Line();
  // let ln6 = new Line();
  // let ln7 = new Line();
  // let ln8 = new Line();
  // let ln9 = new Line();
  // let ln10 = new Line();

  // sq1.assign_right_line(ln1);

  // sq2.assign_left_line(ln1);
  // sq2.assign_right_line(ln2);
  // sq3.assign_left_line(ln2);
  // sq3.assign_right_line(ln3);
  // sq4.assign_left_line(ln3);
  // sq4.assign_right_line(ln4);
  // sq5.assign_left_line(ln4);
  // sq5.assign_right_line(ln5);
  // sq6.assign_left_line(ln5);
  // sq6.assign_right_line(ln6);
  // sq7.assign_left_line(ln6);
  // sq7.assign_right_line(ln7);
  // sq8.assign_left_line(ln7);
  // sq8.assign_right_line(ln8);
  // sq9.assign_left_line(ln8);
  // sq9.assign_right_line(ln9);
  // sq10.assign_left_line(ln9);
  // sq10.assign_right_line(ln10);

  // sq11.assign_left_line(ln10);
  // let squares = [sq1, sq2, sq3, sq4, sq5, sq6, sq7, sq8, sq9, sq10, sq11];
  // let lines = [ln1, ln2, ln3, ln4, ln5, ln6, ln7, ln8, ln9, ln10];

  let numsamples = 128;
  let squares = [];
  let lines = [];
  let points = 10
  for(let i = 0; i < points; i++){
    squares.push(new Square((i*c.width/(points-1))-10,(c.height/2)-10 + 50*Math.sin(2*Math.PI*(i/(points-1))),20,ctx));
  }

  for(let i = 0; i < points; i++){
    lines.push(new Line());
  }

  squares[0].assign_right_line(lines[0]);
  for(let i = 1; i < points; i++){
    squares[i].assign_left_line(lines[i-1]);
    squares[i].assign_right_line(lines[i]);
  }
  squares[squares.length-1].assign_left_line(lines[lines.length-1]);


  squares.forEach(
    function(sq){
      sq.draw();
    }
  );

  lines.forEach(
    function(ln){
      ln.draw();
    }
  );

  let rect = ctx.canvas.getBoundingClientRect();

  c.addEventListener('mousedown', e => {
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    squares.forEach(
      function(square){
        if(square.pointer_in(x, y)){
          square.select_square(x, y);
        }
      }
    );
  });

  c.addEventListener('mousemove', e => {
    var output = "";
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // if(sq1.pointer_in(x,y)){
    //   output = "[" + x + ", " + y + "]";
    // } else {
    //   output = x + ", " + y ;
    // }

    ctx.clearRect(0, 0, c.width, c.height);

    squares.forEach(
      function(square){
        if(square.selected){
          square.drag_square(x, y);
        }
      }
    );

    squares.forEach(
      function(sq){
        sq.draw();
        // console.log(sq.get_center_x()+", "+sq.get_center_y());
      }
    );

    
    lines.forEach(
      function(ln){
        ln.draw();
      }
    );

  });

  window.addEventListener('mouseup', e => {
    // sq1.selected = false;
    // sq2.selected = false;
    // sq3.selected = false;

    let samplearr = new Array(numsamples);
    samplearr.fill("x");
    
    squares.forEach(
      function(sq){
        sq.selected = false;
        samplearr[sq.get_center_x()] = sq.get_center_y();
      }
    );
    let lastindex = 0;
    for(let i = 0; i < samplearr.length; i++){
      // console.log("lastnum = "+samplearr[lastindex]);
      if(samplearr[i] != "x"){
        let difference = samplearr[i] - samplearr[lastindex];
        let chunk = difference / (i - lastindex);
        // console.log("difference = "+difference);
        // console.log("chhunk = "+chunk);
        for(let j = i-1; samplearr[j] == "x"; j --){
          samplearr[j] = samplearr[j+1] - chunk;
        }
        lastindex = i;
      }
    }
    // document.getElementById("coords").innerHTML = samplearr;

    // for(let i = 0; i < samplearr.length; i ++){
    //   samplearr[i] = Math.sin(2*Math.PI*(i/(samplearr.length-1)));
    // }

    draw_plot(samplearr);
  });
// }
