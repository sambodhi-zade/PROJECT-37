//Create variables here
var dog,dogImg,happyDogImg,database,foodS,foodStock,foodObj;
var fedTime, lastFed, feed, addFood,bathDog,bathingDogImg;
var background;
var gameState = 0;
var input, button,database;
var milk,input,name;
var frameCountNow = 0;
var hungryDog;
var bedroomImg,gardenImg,runImg,washroomImg,dogVaccination,sleepImg,injection,deadDog,lazyDog,runningDog,livingRoom;
var gardenBack, Washroom, Hungry,Bedroom,lazyDog,livingRoom,Garden; 
var changeState,readState;
function preload(){
	//load images here
  dogImg = loadImage("Dog.png");
  happyDogImg = loadImage("happydog.png");
  bedroomImg = loadImage("Bed Room.png");
  gardenImg = loadImage("Garden.png");
  washroomImg = loadImage("Wash Room.png");
  sleepImg = loadImage("Lazy.png");
  runImg = loadImage("running.png");
  hungryDog = loadImage("images/dogImg1.png");   
  livingRoom=loadImage("Living Room.png");
}


function setup() {
  database= firebase.database()
  createCanvas(900,400);
  
  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  dog = createSprite(800,200,150,150);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  feed=createButton("Feed the dog");
  feed.position(650,115);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(760,115);
  addFood.mousePressed(addFoods)

  gardenBack = createButton("Garden");
  gardenBack.position(575,115);
  gardenBack.mousePressed(garden)

  Washroom = createButton("Washroom");
  Washroom.position(480,115);
  Washroom.mousePressed(washroom);

  Bedroom = createButton("BedRoom");
  Bedroom.position(380,115);
  Bedroom.mousePressed(bedroom);

  input = createInput("Pet Name");
  input.position(950,110);
  
  button = createButton("Done");
  button.position(1070,135);
  button.mousePressed(createName);



}

function draw() {  
  background(46,139,87);
  currentTime = hour();
  if(currentTime === (lastFed + 1)){
    update("playing");
    updateGameState();
    foodObj.garden();
  }
  
  else if(currentTime === (lastFed + 2)){
   update("sleeping");
    updateGameState();
    foodObj.bedroom();
  }
  else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
    update("bathing");
    updateGameState();
    foodObj.washroom();
  }else{
   update("hungry")
    updateGameState();
    foodObj.display();

  }
  
  foodObj.display();
  getGameState();

  if(gameState === "hungry"){
    feed.show();
    addFood.show();
    dog.addImage("hungry", hungryDog);
    foodS.visible = true;
  }
  else{
    feed.hide();
    addFood.hide();
    dog.remove();
    foodS.visible = false;
  }

  
  fedTime = database.ref('FeedTime')
  fedTime.on("value", function (data){
  lastFed = data.val();
})

    drawSprites();


    fill("red");
    textSize(20);
    text("Last Fed: "+lastFed+":00",130,40);

    fill("red");
    textSize(20);
    text("Time Since last fed: "+(currentTime - lastFed),500,40);
    
}

  function readStock(data){
    foodS = data.val();
    foodObj.updateFoodStock(foodS);
  }

  function feedDog(){
    foodObj.deductFood();
    foodObj.updateFoodStock();
    dog.addImage("happy", happyDogImg);
    gameState="happy";

    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
      Food: foodObj.getFoodStock(),
      FeedTime : hour()
    })
    updateGameState();
  }

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    foodObj : foodS
  })
}

function bedroom(){
  background(bedroomImg,550,500);
}
function garden(){
  background(gardenImg,550,500);
}
function washroom(){
  background(washroomImg,550,500);
}



async function hour(){
  var site = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var siteJSON = await site.json();
  var datetime = siteJSON.datetime;
  var hourTime = datetime.slice(11,13);
  return hourTime;
}

function createName(){
  input.hide();
  button.hide();

  input.name = input.value();
  var greeting = createElement('h3');
  greeting.html("Pet's Name: "+ input.name);
  greetin.position(500,250);
}

function getGameState(){
  gameStateRef = database.ref('gameState');
  gameStateRef.on("value",function(data){
    gameState  = data.val();
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}



function updateGameState(){
  database.ref('/').update({
    gameState:gameState
  })
}
