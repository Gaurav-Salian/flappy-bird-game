//board

let board;
let boardwidth =360;
let boardheight= 640;
let context;

//bird
let birdwidth=34;
let birdheight=24;
let birdx = boardwidth/8;
let birdy = boardheight/2;

let bird={
	x :birdx,
	y: birdy,
	width: birdwidth,
	height: birdheight
}

//pipes

let pipearray=[];
let pipewidth= 64;
let pipeheight = 512;
let pipex= boardwidth;
let pipey = 0;

let toppipe;
let bottompipe;

//physics
velocityx= -2;
velocityy= 0;
gravity =0.4;

let gameover =false;
let score =0;


window.onload = function(){
	board = document.getElementById("board");
	board.height = boardheight;
	board.width = boardwidth;
	context = board.getContext("2d");  // drwaing on board

	//draw flappy 
	//context.fillstyle ="yellow";
	// context.fillRect(bird.x, bird.y, birdwidth, birdheight);

	// load images
	birdimg = new Image();
	birdimg.src ="./flappybird.png";
	birdimg.onload= function(){
		context.drawImage(birdimg, bird.x, bird.y, birdwidth, birdheight);
	}

	toppipeimg =new Image();
	toppipeimg.src="./toppipe.png"

	bottompipeimg =new Image();
	bottompipeimg.src="./bottompipe.png"

	requestAnimationFrame(update);
	setInterval(placepipes,2500); // every 1.5 sec

	document.addEventListener("keydown", movebird);

}


function update(){
	requestAnimationFrame(update);

	if (gameover){
		return;
	}
	context.clearRect(0, 0, board.width, board.height);

	//bird
	velocityy +=gravity;
	// bird.y +=velocityy;
	bird.y =Math.max(bird.y+ velocityy,0);//
	context.drawImage(birdimg, bird.x, bird.y, birdwidth, birdheight);

	if (bird.y >board.height){
		gameover= true;
	}

	//pipes
	for(let i=0; i<pipearray.length;i++){
		let pipe =pipearray[i];
		pipe.x += velocityx;
		context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
	
		if (!pipe.passed && bird.x > pipe.x + pipe.width){
			score+=0.5;
			pipe.passed= true;
		}

		if (detectcollution(bird,pipe)){
			gameover = true;
		}
	}

	while (pipearray.length > 0 && pipearray[0].x < -pipewidth){
		pipearray.shift();
	}

	context.fillStyle = "black";
	context.font="45px sans-serif";
	context.fillText(score, 5, 45);
	context.font="20px sans-serif";
	context.fillText("X,Space,ArrowUP for jump", 5, 65);


	if (gameover){
		context.font="45px sans-serif";
		context.fillText("GAME OVER", 40, 300);
		context.font="20px sans-serif";
		context.fillText("press Enter button to reset", 55, 350);
	}

}


function placepipes() {
	if (gameover){
		return
	}

	let openingspace = board.height/4;
	let randompipey=pipey - pipeheight/4 -Math.random()*(pipeheight/2);

	let toppipe ={
		img:toppipeimg,
		x:pipex,
		y:randompipey,
		width:pipewidth,
		height: pipeheight,
		passed: false
	}

	pipearray.push(toppipe);

	let bottompipe ={
		img: bottompipeimg,
		x: pipex,
		y: randompipey + pipeheight + openingspace,
		width: pipewidth,
		height: pipeheight,
		passed: false
	}

		pipearray.push(bottompipe);

}

function movebird(e){
	if (e.code =="Space" || e.code =="ArrowUp" || e.code =="KeyX"){
		//jump
		velocityy= -6;
	}

	if (e.code =="Enter"){
			//reset
		if (gameover){
			bird.y= birdy;
			pipearray=[];
			score=0;
			gameover=false;
		}
	}
}


function detectcollution(a,b){
	return a.x<b.x +b.width && a.x + a.width > b.x &&
			a.y < b.y+ b.height && a.y + a.height > b.y;
}