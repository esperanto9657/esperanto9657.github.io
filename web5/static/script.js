
var gameover = true;//game status
var matrix = new Array();//for mark the 20*20 nodes

//init matrix
for(var i = 0; i < 20; i++){
	var temp = new Array();
	for(var j = 0; j < 20; j++){
		temp[j] = 0;
	}
	matrix[i] = temp;
}
//console.log(matrix);
//console.log(matrix[1][0]);

var mmm;//to store setInterval's id
var score = 0;//as its name
var size_x = 20, size_y = 20;//size of the map
var refreshTime = 300;//to change the refresh frequency of the game
var foodNode;//to store the foodNode
var poisonNode;//to store the poisonNode
var fFlag = false;//if there is a foodNode
var pFlag = false;//if there is a poisonNode
var div = document.getElementById("sc");//the game's area
var curDirection = "up";//defult setting is "up"
var curDirec = "up";//a temp direction var
var snakeNode = new Array();//the index 0 is the head
var snakePos = new Array();//the index 0 is the head
var foodImg = "url(\"static/food.jpg\")";//store the foodImg's path
var poisonImg = "url(\"static/poison.jpg\")";//store the poisonImg's path

//console.log(foodImg);
//console.log(poisonImg);
function createNode(){//create 20*20 nodes
	for(var i =0; i < 20;i++){
		for(var j = 0; j < 20; j++){
			t = document.createElement("div");
			t.setAttribute("class", "snode");
			t.setAttribute("id", j.toString()+ "-"+ i.toString());
			div.appendChild(t);
			//console.log(t);
		}
	}
};

createNode();

function createFood(){//create food node
	//console.log(fFlag);
	if(fFlag == false){
		do
		{
			var x1 = Math.floor(Math.random()*20);
			var y1 = Math.floor(Math.random()*20);
		}while(matrix[x1][y1] != 0);
		matrix[x1][y1] = 2;
		var t = document.getElementById(x1.toString()+"-"+y1.toString());
		t.style.backgroundImage = foodImg;
		foodNode = t;
		fFlag = true;
	}
};

function createPoison(){//create poison node
	//console.log(pFlag);
	if(pFlag == false){
		do
		{
			var x2 = Math.floor(Math.random()*20);
			var y2 = Math.floor(Math.random()*20);
		}while(matrix[x2][y2] != 0);
		matrix[x2][y2] = -1;
		var t = document.getElementById(x2.toString()+"-"+y2.toString());
		t.style.backgroundImage = poisonImg;
		poisonNode = t;
		pFlag = true;
	}
};

function clear(){//clear all the data, prepare for restart
	for(var i = 0; i < snakeNode.length; i++){
		snakeNode[i].style.background = "#888888";
	}
	if(poisonNode){
		poisonNode.style.backgroundImage = "";
		poisonNode = null;
	}
	if(foodNode)
	{
		foodNode.style.backgroundImage = "";
		foodNode = null;
	}
	snakeNode = null;
	snakePos = null;
	matrix = null;
	curDirection = "up";
};

function judgement(curX, curY){//check the position
	if(curX < 0||curY < 0||curX >= size_x||curY >= size_y)
		return -2;//wall
	if(matrix[curX][curY] == 2)
		return 1;//get food
	if(matrix[curX][curY] == 1)
		return -1;//bite itself
	if(matrix[curX][curY] == -1)
		return -3;//get poison
	return 0;//normal
};

function getFood(target){//if the target area is food
	fFlag = false;
	foodNode.style.backgroundImage = "";
	matrix[target[0]][target[1]] = 1;//let the target position become 1
	var t = document.getElementById(target[0].toString()+"-"+target[1].toString());//create a new headNode
	//console.log(t);
	t.style.background = "#FFFF00";
	snakeNode.splice(0, 0, t);//insert the headNode
	snakePos.splice(0, 0, [target[0],target[1]]);//insert the headNode's position
};

function getPoison(target){//if the target area is poison
	pFlag = false;
	poisonNode.style.backgroundImage = "";

	if(snakeNode.length == 1){//snake's length will become 0
		gameover = true;
		return;
	}
	matrix[target[0]][target[1]] = 1;//let the target position become 1
	var t1 = document.getElementById(target[0].toString()+"-"+target[1].toString());//create a new headNode
	//console.log(t1);
	t1.style.background = "#FFFF00";
	snakeNode.splice(0, 0, t1);//insert the headNode
	snakePos.splice(0, 0, [target[0],target[1]]);//insert the headNode's position

	var tpos1 = snakePos[snakePos.length-1];
	matrix[tpos1[0]][tpos1[1]] = 0;//let the last snakeNode become 0 in matrix
	snakeNode[snakeNode.length-1].style.background = "#888888";//remove the last snakeNode
	snakeNode.splice(snakeNode.length-1, 1);//remove from the node array
	snakePos.splice(snakePos.length-1, 1);//remove from the position array

	//do it again
	tpos1 = snakePos[snakePos.length-1];
	matrix[tpos1[0]][tpos1[1]] = 0;//let the last snakeNode become 0 in matrix
	snakeNode[snakeNode.length-1].style.background = "#888888";//remove the last snakeNode
	snakeNode.splice(snakeNode.length-1, 1);//remove from the node array
	snakePos.splice(snakePos.length-1, 1);//remove from the position array

	
};

function normalMove(target){//if the target area is normal
	matrix[target[0]][target[1]] = 1;//let the target position become 1
	//console.log(target);
	var t2 = document.getElementById(target[0].toString()+"-"+target[1].toString());//create a new headNode
	//console.log(t2);
	t2.style.background = "#FFFF00";
	snakeNode.splice(0, 0, t2);//insert the headNode
	snakePos.splice(0, 0, [target[0],target[1]]);//insert the headNode's position
	var tpos2 = snakePos[snakePos.length-1];
	matrix[tpos2[0]][tpos2[1]] = 0;//let the last snakeNode become 0 in matrix
	snakeNode[snakeNode.length-1].style.background = "#888888";//remove the last snakeNode
	snakeNode.splice(snakeNode.length-1, 1);//remove from the node array
	snakePos.splice(snakePos.length-1, 1);//remove from the position array

};

function move(){//move function
	//console.log(curDirection);
	//console.log(snakePos[0]);
	//console.log(snakePos[snakePos.length-1]);
	createFood();
	createPoison();
	var len = snakePos.length;
	var begin = [snakePos[0][0],snakePos[0][1]];
	//console.log(begin);
	var end = [snakePos[len-1][0],snakePos[len-1][1]];
	var state;
	var temp;
	curDirection = curDirec;
	//console.log(curDirection);
	switch(curDirection){
	case "down"://Y+1
		state = judgement(begin[0], begin[1]+1);
		temp = [begin[0], begin[1]+1];
		break;
	case "up"://Y-1
		state = judgement(begin[0], begin[1]-1);
		temp = [begin[0], begin[1]-1];
		break;
	case "right"://X+1
		state = judgement(begin[0]+1, begin[1]);
		temp = [begin[0]+1, begin[1]];
		break;
	case "left"://X-1
		state = judgement(begin[0]-1, begin[1]);
		temp = [begin[0]-1, begin[1]];
		break;
	}
	switch(state){
	case 0://normal moving
		normalMove(temp);
		break;
	case 1://get food
		score += 2;
		getFood(temp);
		break;
	case -1://bite itself
		gameover = true;
		break;
	case -2://wall
		gameover = true;
		break;
	case -3://get poison
		score--;
		getPoison(temp);
		break;
	defult:
		break;
	}
	document.getElementById("score").innerHTML = score;//display the score
	if(gameover == true){//game over, print the score and clear the data
		alert("gameover\n最终分数："+ score);
		clear();
		clearInterval(mmm);//stop the timer
	}
};

function init(){
	pFlag = false;
	fFlag = false;
	score = 0;
	gameover = false;//set the gameover flag
	if(matrix == null){//incase of the snakeNode is undefined
		matrix = new Array();
		for(var i = 0; i < 20; i++){
			var temp = new Array();
			for(var j = 0; j < 20; j++){
				temp[j] = 0;
			}
			matrix[i] = temp;
		}//init matrix
	}
	if(snakeNode == null)//incase of the snakeNode is undefined
		snakeNode = new Array();
	if(snakePos == null)//incase of the snakeNode is undefined
		snakePos = new Array();
	//console.log("start create");

	//set the start position
	var t = document.getElementById("9-9");
	t.style.background = "#FFFF00";
	//console.log(t);
	snakePos.splice(0, 0, [9,9]);
	snakeNode.splice(0, 0, t);
	matrix[9][9] = 1;

	return setInterval(move, refreshTime);//return the setTnterval's id
};

document.onkeydown = function (event){//keyboard event
	//console.log(event.keyCode);
	if(event&&(event.keyCode == 87||event.keyCode == 38)&&curDirection != "up"&&curDirection != "down"){//w and up
		curDirec = "up";
	}
	if(event&&(event.keyCode == 83||event.keyCode == 40)&&curDirection != "up"&&curDirection != "down"){//s and down
		curDirec = "down";
	}
	if(event&&(event.keyCode == 65||event.keyCode == 37)&&curDirection != "left"&&curDirection != "right"){//a and left
		curDirec = "left";
	}
	if(event&&(event.keyCode == 68||event.keyCode == 39)&&curDirection != "left"&&curDirection != "right"){//d and right
		curDirec = "right";
	}
	if(event&&event.keyCode == 35){//press End to quit the game 
		if(gameover == false){
			gameover = true;
			alert("gameover\n最终分数："+ score);//print the score
			clear();//clear the data, prepare for restart
			clearInterval(mmm);//stop the timer
		}
	}
	if(event&&event.keyCode == 32){//space, start the game!
		if(gameover == true)
			mmm = init();//init() returns the setInterval's id, so mmm is the setInterval's id, when we stop the timer
	}
};

