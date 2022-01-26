//declaration of variables 
var domNode_startButton = document.querySelector('.startGameButton');
var domNode_resumeButton = document.querySelector('.resumeGameButton');
var domNode_restartGameButton = document.querySelector('.restartGameButton');
var domNode_tryAgainButton = document.querySelector('.tryAgainButton');
var domNode_playGameAreaElements = document.querySelectorAll('.game');
var domNode_listOfCardsImg = document.querySelectorAll('.cardWrapper .card');
var domNode_resetArrowButton = document.querySelector('.resetArrow');
var domNode_scoreValue = document.getElementById('scoreValue');
var domNode_animationBar = document.querySelector('.timeBarInner');
var cardsList = ['Saturn',
'Jupiter',
'Mars',
'Earth',
'Mercury',
'Neptune',
'Pluto',
'Uranus',
'Venus',
'Saturn',
'Jupiter',
'Mars',
'Earth',
'Mercury',
'Neptune',
'Pluto',
'Uranus',
'Venus'];
var previousClickedCard = '';
var openedCards = 0;
var currentscore = 0;

//if there are stored data then show both buttons - start game and resume game 
function startOrResumeGame(){

    if(localStorage.length){
        domNode_resumeButton.classList.remove('hidden');
        domNode_startButton.setAttribute('style','top: 40%');
    }
}

function addEventOnCards(){

    for(let i = 0; i < domNode_listOfCardsImg.length; i++){
        domNode_listOfCardsImg[i].addEventListener('click', onClickCard);
    }
}

//hide start button, show game elements, set the cards from the array
function onStartGame(){

    if(localStorage.length){
        domNode_resumeButton.classList.remove('hidden');
        domNode_startButton.setAttribute('style','top: 40%');

    }

    domNode_startButton.classList.add('hidden');
    domNode_resumeButton.classList.add('hidden');
    
    cleanStorage();
    randomizeCards();
    showHiddenGameElements();
    setCardsOnPlayField(); 
}

function cleanStorage(){
    localStorage.clear();
}

//randomize the cards
function randomizeCards(){

    for (let i = 0; i < cardsList.length; i++){
        let tempRandomCard;
        let arrayLenght = cardsList.length;
        let randomNumber = Math.floor(Math.random()*100/18);
    
        tempRandomCard = cardsList[arrayLenght-1];
        cardsList[arrayLenght-1] = cardsList[randomNumber];
        cardsList[randomNumber] = tempRandomCard; 
    }

    localStorage.setItem('cardsArray', JSON.stringify(cardsList));
}


function showHiddenGameElements(){

    for (let i = 0; i < domNode_playGameAreaElements.length; i++){
        domNode_playGameAreaElements[i].classList.remove('hidden');
    }
}

function setCardsOnPlayField(){

    for (var i = 0; i < domNode_listOfCardsImg.length; i++){
        domNode_listOfCardsImg[i].setAttribute('src', 'images/cards/'+cardsList[i]+'.png');
        domNode_listOfCardsImg[i].setAttribute('data-planet', cardsList[i].toLowerCase());
    }
}

function onResumeGame(){

    domNode_startButton.classList.add('hidden');
    domNode_resumeButton.classList.add('hidden');

    showHiddenGameElements();

    cardsList = JSON.parse(localStorage.getItem('cardsArray'));

    setCardsOnPlayField();

    let storageKeys = Object.keys(localStorage);

   for(let i=0; i < storageKeys.length; i++) {
       if(storageKeys[i] !== 'cardsArray'){
           $('#' + storageKeys[i]).addClass('hidden');
       }
   }

   domNode_scoreValue.innerText = localStorage.getItem('score');
}

function onClickCard(event){

    if (openedCards === 0){
        firstClick(event);

    } else if (openedCards==1) {
        secondClick(event);

    } else if (openedCards === 2){
        thirdClick();
    }

    previousClickedCard = event.target.getAttribute('id');
    domNode_scoreValue.innerText = Math.trunc(currentscore);
    localStorage.setItem('score',Math.trunc(currentscore));

}

function firstClick(event){

    event.target.classList.remove('card');
    openedCards = 1;
}

function secondClick(event){

    if(previousClickedCard === event.target.getAttribute('id')){
        event.target.classList.add('card');
        openedCards = 0;

    } else {
        event.target.classList.remove('card');
        openedCards = 2;

        hideTheSameCards(event);
    }
}

function thirdClick(){

    for(let i = 0; i < domNode_listOfCardsImg.length; i++){
        domNode_listOfCardsImg[i].classList.add('card');
    }
    openedCards = 0;
}

function hideTheSameCards(event){

    if(event.target.dataset.planet === document.getElementById(previousClickedCard).dataset.planet){
        let firstCard = previousClickedCard ;

        setTimeout(function(){
            document.getElementById(firstCard).classList.add('hidden')
            event.target.classList.add('hidden');
        }, 500);

        localStorage.setItem(firstCard,'hidden');
        localStorage.setItem(event.target.getAttribute('id'),'hidden');

        openedCards = 0;
        currentscore = currentscore + (800 /9);

        if(currentscore >= 800){
            youWin();
        }
    }
}

function youWin(){

    $('.winnerContainer').removeClass('hidden');
    $(domNode_playGameAreaElements).addClass('hidden');

    showFinalScore('.winnerContainer');
    cleanStorage();
}

function showFinalScore(incommingClas){

    document.querySelector(incommingClas + ' .scoreAmount').innerText = Math.trunc(currentscore);
}

function onResetGame(){

    //restart score counter
    domNode_scoreValue.innerText = 0;
    
    //restart time bar
    $(domNode_animationBar).removeClass('barAnimation').width();
    $(domNode_animationBar).addClass('barAnimation');
    
    //restore cards 
    $(domNode_listOfCardsImg).addClass('card').removeClass('hidden');
    cleanStorage();  
    openedCards = 0;
}

function onGameOver(){

    $('.endContainer').removeClass('hidden');
    $(domNode_playGameAreaElements).addClass('hidden');
    
    showFinalScore('.endContainer');
    cleanStorage();
}

function onTryAgain(){

    $('.endContainer').addClass('hidden');
    $('.winnerContainer').addClass('hidden');
    $('.cardWrapper .hidden').removeClass('hidden');
    $(domNode_listOfCardsImg).addClass('card');
    
    previousClickedCard = '';
    openedCards = 0;
    currentscore = 0;
    
    cleanStorage();
    onStartGame();
}

//actions
startOrResumeGame();
addEventOnCards();

domNode_startButton.addEventListener('click', onStartGame);
domNode_resumeButton.addEventListener('click', onResumeGame);
domNode_resetArrowButton.addEventListener('click', onResetGame);
domNode_animationBar.addEventListener('animationend', onGameOver);
domNode_tryAgainButton.addEventListener('click', onTryAgain);
domNode_restartGameButton.addEventListener('click', onTryAgain);