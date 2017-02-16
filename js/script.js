// Important variables for game

numOfColumns = 30;
numOfRows = 30;
boardCells = $('.canvas table tbody tr');

snakeBody = [
	{x:0,y:0},
	{x:1,y:0},
	{x:2,y:0}
];

foodPoint = {x:0,y:0};

direction = "right";
nextMovePointX = 1;
nextMovePointY = 0;

keyEvent = true;




// Important functions
function generateBoard(n,m){
	for(var i=0; i<m; i++){
		var str = "<tr data-y='"+ i +"'> ";
		for (var j=0; j<n; j++){
			str+=" <td data-x = '" + j + "' data-y='" + i + "'></td> ";
		}
		str+=" </tr>";
		$('.canvas table tbody').append(str);
	}
}
function endOfGame(info){
	$(".info-wrapper").append("<p class='alert alert-danger'>"+info+"</p>")
	resetGame();
	clearTimeout(succeed_timeout);
}

function safeFood(){
	snakeBody.forEach(function(el,ind){
		if (el.x == foodPoint.x && el.y == foodPoint.y)
			return false;
	});
	return true;
}

function setFood(){
	$('.canvas table').find('.snake-food').parent().html("");
	var randX = getRandomInt(0,numOfColumns-1);
	var randY = getRandomInt(0,numOfRows-1);
	foodPoint.x = randX;
	foodPoint.y = randY;

	while(!safeFood()){
		console.log("notSafeFood!");
		setFood();
	}
	$( ".canvas table tbody tr" ).each(function(i,val) {
	  	if (i==foodPoint.y){
	  		$(val).find('td').each(function(newI,newVal){
	  			if (newI == foodPoint.x){
	  				$(newVal).html("<p class='snake-food'></p>");
	  			}
	  		});
	  	}
	});
}

function removeFood(){
	$('.canvas table').find('.snake-food').parent().html("");
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function moveSnake(){
	Snake_Tail_Y = snakeBody[0].y;
	Snake_Tail_X = snakeBody[0].x;
	Snake_Head_X = snakeBody[snakeBody.length - 1].x;
	Snake_Head_Y = snakeBody[snakeBody.length - 1].y;
	Snake_Head_X+=nextMovePointX;
	Snake_Head_Y+=nextMovePointY;
	
	snakeCollision(Snake_Head_X, Snake_Head_Y)
		
	snakeBody.push({x:Snake_Head_X,y:Snake_Head_Y});

	if (Snake_Head_Y!=foodPoint.y || Snake_Head_X!=foodPoint.x){
		var obj = $('.canvas tbody').find('[data-y='+Snake_Tail_Y+']');
		$(obj).find('[data-x='+Snake_Tail_X+']').removeClass('snake-point');
		snakeBody.shift();
	}else{
		score++;
		if (score%10 == 0){
			endTime = new Date().getTime();
			var time = Math.round((endTime - startTime)/1000);
			startTime = new Date().getTime();
			$(".times-wrapper").show();
			$(".times-wrapper .times").append("<span class='label label-primary'>"+time+" sec</span> ");
		}
		$("#score").html(score);
		removeFood();
		setFood();
	}

	
	if (Snake_Head_X<0 || Snake_Head_Y<0 || Snake_Head_X>numOfColumns-1 || Snake_Head_Y>numOfRows-1){
		status = "You died because you crashed to the wall!";
		endOfGame(status);
	}
	var obj_new = $('.canvas tbody').find('[data-y='+Snake_Head_Y+']');
	$(obj_new).find('[data-x='+Snake_Head_X+']').addClass('snake-point');
	keyEvent = true;
}

function initGame(){
	snakeBody.forEach(function(el,ind){
		var obj = $('.canvas tbody').find('[data-y='+el.y+']');
		$(obj).find('[data-x='+el.x+']').addClass('snake-point');
	});
	
	$(".info-wrapper").html("");
	setFood();
	$("#score").html(score);
	$(".times-wrapper .times").html("");
	$(".times-wrapper").hide();
	startTime = new Date().getTime();

}

function resetGame(){
	$('.canvas table').find('.snake-food').parent().html("");
	var obj = $('.canvas tbody').find('.snake-point').removeClass('snake-point');
	snakeBody = [
		{x:0,y:0},
		{x:1,y:0},
		{x:2,y:0}
	];
	direction = "right";
	nextMovePointX = 1;
	nextMovePointY = 0;
	score = 0;
	if (typeof succeed_timeout !== 'undefined'){
		clearTimeout(succeed_timeout);
	}
}

function snakeCollision(x,y){
	snakeBody.forEach(function(el,ind){
		if (el.x == x && el.y == y){
			str = "You died because you eat yourself! Lol ";
			endOfGame(str);
		}
	});
}





$(document).ready(function(){
	generateBoard(numOfColumns,numOfRows);
	$(document).keydown(function(e){
		var key = e.which;
		if(key == "37" && direction != "right" && keyEvent) {direction = "left"; nextMovePointX = -1; nextMovePointY = 0; keyEvent = false;}
		else if(key == "38" && direction != "down" && keyEvent) {direction = "up"; nextMovePointX = 0; nextMovePointY = -1; keyEvent = false;}
		else if(key == "39" && direction != "left" && keyEvent) {direction = "right"; nextMovePointX = 1; nextMovePointY = 0; keyEvent = false;}
		else if(key == "40" && direction != "up" && keyEvent) {direction = "down"; nextMovePointX = 0; nextMovePointY = 1; keyEvent = false;}
	});	

	$('.start-button').click(function(e){
		resetGame();
		initGame();
		succeed_timeout = setInterval(moveSnake, 200);

	});
	$('.end-button').click(function(e){
		resetGame();
	});
});