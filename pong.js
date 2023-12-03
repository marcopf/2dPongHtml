let canvas = document.querySelector("#myCanv");
let ai = false;
canvas.width = 800
canvas.height = 450

class Game{
	constructor(){
		this.p1Score = 0;
		this.p2Score = 0;
	}
	updateObj(left, right, ball, newLeftY, newRightY){
		let aiMove = ball.y + canvas.offsetTop - (right.lengthP / 2);
		left.update(newLeftY);
		if (ai)
			right.update(aiMove);
		else
			right.update(newRightY)
		ball.update(left, right, this);
	}
	drawFrame(left, right, ball){
		ctx.fillStyle = "#000000"
		ctx.fillRect(0, 0, canvas.width, canvas.height)
		ctx.fillStyle = "#ffffff"
		ctx.fillRect(left.x, left.y, left.widthP, left.lengthP)
		ctx.fillStyle = "#ffffff"
		ctx.fillRect(right.x, right.y, right.widthP, right.lengthP)
		ctx.fillStyle = "#ffffff"
		ctx.fillRect(ball.x, ball.y , ball.ballSize, ball.ballSize);
	}
	updateScore(ball){
		if (!ai)
			document.querySelector("#display").innerHTML = `<span>P1: ${this.p1Score} | P2: ${this.p2Score}</span>`;
		ball.resetPos();
	}
}

class Padle{
	constructor(startX, startY, width, length){
		this.x = startX;
		this.y = startY;
		this.widthP = width;
		this.lengthP = length;
		this.rect = canvas.getBoundingClientRect();
	}
	update(y){
		this.y = y - this.rect.top;
	}
}

class Ball{
	constructor(canvas){
		this.centerX = (canvas.width / 2);
		this.centerY = (canvas.height / 2);
		this.ballSize = 10;
		this.ballOffSet = (this.ballSize / 2);
		this.x = this.centerX - this.ballOffSet;
		this.y = this.centerY - this.ballOffSet;
		this.deltaX = 0;
		this.deltaY = 0;
		this.started = false;
		this.rect = canvas.getBoundingClientRect();
	}
	resetPos(){
		this.started = false;
		ball.deltaX = 0;
		ball.deltaY = 0;
		ball.x = ball.centerX - ball.ballOffSet;
		ball.y = ball.centerY - ball.ballOffSet;
	}
	start(){
		this.started = true;
		date = new Date().getTime() / 1000;
		this.deltaX = Math.ceil(Math.random() * 10) % 2 == 0 ? 1 : -1;
		this.deltaY = Math.ceil(Math.random() * 10) % 2 == 0 ? 1 : -1;
	}
	touchPadel(leftPadle, rightPadle){

		if (this.x + this.ballOffSet <= (leftPadle.x + leftPadle.widthP))
		{
			if (this.y>= leftPadle.y && this.y <= (leftPadle.y + leftPadle.lengthP))
			{
				this.deltaX *= -1;
				return "none";
			}
			return "outLeft";
		}
		if (this.x + this.ballOffSet >= rightPadle.x)
		{
			if (this.y >= rightPadle.y && this.y <= (rightPadle.y + rightPadle.lengthP))
			{
				this.deltaX *= -1;
				return "none";
			}
			return "outRight";
		}
		return "none";
	}
	update(leftPadel, rightPadel, game){
		let res;
		
		if (this.started && ai)
			getTimeHtml();
		if (this.x <= 0 || this.x >= canvas.width - this.ballOffSet)
			this.deltaX *= -1;
		if (this.y <= 0 || this.y >= canvas.height - this.ballOffSet)
			this.deltaY *= -1;
		res = this.touchPadel(leftPadel, rightPadel);
		if (res == "outLeft")
		{
			game.p2Score++;
			game.updateScore(this);
		}
		if (res == "outRight")
		{
			game.p1Score++;
			game.updateScore(this);
		}
		this.deltaX *= 1.0005;
		this.deltaY *= 1.0005;
		this.x += this.deltaX;
		this.y += this.deltaY;
	}
}

let 	ctx = canvas.getContext("2d");
let 	padleWidth = 10, padlelength = canvas.height / 6;
let 	leftY = canvas.offsetTop + canvas.clientHeight / 2 - (padlelength / 2);
let 	rightY = canvas.offsetTop  + canvas.clientHeight / 2 - (padlelength / 2);
let 	ball = new Ball(canvas);
let 	left = new Padle(20, leftY, padleWidth, padlelength)
let 	right = new Padle(canvas.width - (padleWidth + 20), leftY, padleWidth, padlelength);
let 	game = new Game();
let 	previousTime = 0;
let 	date = new Date().getTime() / 1000;
const 	targetFrameRate = 144; // Target frame rate (in FPS)
const 	frameInterval = 1000 / targetFrameRate; // Interval in milliseconds between frames

function getTimeHtml(){
	document.querySelector("#display").innerHTML = `<span>Elapsed Time: ${Math.round(((new Date().getTime() / 1000) - date))}</span>`;
}


window.addEventListener("keydown", (e)=>{
	let toAdd = padlelength;
	
	if (e.key == " ")
		ball.start();
	if (e.key == "o" && (rightY - toAdd) >= canvas.offsetTop - padlelength)
		rightY -= toAdd;
	if (e.key == "l" && (rightY + toAdd) <= canvas.clientHeight + canvas.offsetTop - right.lengthP + padlelength)
	rightY += toAdd;
	if (e.key == "w" && (leftY - toAdd) >= canvas.offsetTop - padlelength)
	leftY -= toAdd;
	if (e.key == "s" && (leftY + toAdd) <= canvas.clientHeight + canvas.offsetTop - right.lengthP + padlelength)
		leftY += toAdd;
})

function animate(currentTime)
{
	const deltaTime = currentTime - previousTime;
	game.updateObj(left, right, ball, leftY, rightY);
	if (deltaTime > frameInterval) {
		previousTime = currentTime - (deltaTime % frameInterval);
		game.drawFrame(left, right, ball)
	}
	requestAnimationFrame(animate);
}

function aiOn()
{
	ai = true;
	document.querySelector("#display").innerHTML = `<span>Elapsed Time: 0</span>`;
}

function aiOff()
{
	ai = false;
	game.p1Score = 0
	game.p2Score = 0
	document.querySelector("#display").innerHTML = `<span>P1: ${game.p1Score} | P2: ${game.p2Score}</span>`;
}

animate()