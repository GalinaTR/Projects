var domNode_btnEditPage = document.querySelector('.EditPageButton');
var domNode_btnAddSavePerson = document.getElementById('AddOnePerson');  
var domNode_inputFormElements = document.querySelectorAll('.EditPeopleInput');
var objFormData = {};
var cardsArray =[];
var currentCardNumber = 0;
var lastClickedCard = '';
var cardNumber = 1;

if(sessionStorage.length){

    restoreSession();
}

//create card for each stored object in the Session storage
function restoreSession(){

    var keys = Object.keys(sessionStorage);

    for(let i = 0; i <keys.length;i++){
            currentCardNumber = keys[i].substring(3);
            cardNumber = keys[i];
            hidePlaceholder()
            createNewCard();

            console.log(sessionStorage.getItem(keys[i]));
            objFormData = JSON.parse(sessionStorage.getItem(keys[i]));

            setCardData(keys[i]);
    }
    if(keys.length>0){
        currentCardNumber = keys.length;
    }
 }

//open edit page menu
function openEditPage(){

    document.querySelector('.EditPeopleWrapper').classList.toggle('EditPeopleWrapper--expanded');
    domNode_btnEditPage.classList.toggle('EditPageButton--active');
}

/* for both buttons: hide the placeholder and clean the form
click on +Add person button :  create new card , extractFormData with new created card number and setCardData
click on Save button: extractFormData with clicked card number, setCardData and set last clicked card to ''  */
function onClickAddSaveButton(){

    hidePlaceholder()

    if(domNode_btnAddSavePerson.textContent == 'Save'){
        let inputCardNumber = objFormData['card'];

        domNode_btnAddSavePerson.innerText='+ Add person';
        document.querySelector('.'+inputCardNumber).classList.remove('PersonCard--active');

        extractFormData(inputCardNumber);
        setCardData(inputCardNumber);

        lastClickedCard = '';
    } else {
        currentCardNumber++;
        cardNumber = 'card'+currentCardNumber;

        createNewCard();
        extractFormData(cardNumber);
        setCardData(cardNumber);
    }

    cleanForm();
}

//hide placeholder
function hidePlaceholder(){

    document.querySelector('.PeopleCardWrapper > span').style.display='none';
}

// create new card using template tag
function createNewCard(){

    let domNode_CardContainer = document.querySelector('.PeopleCardWrapper');
    let selectTemplate = document.getElementsByTagName('template')[0];
    let selectTemplateContainer = selectTemplate.content.querySelector("div");
    let selectTemplateButton = selectTemplate.content.querySelector("button");
    let selectTemplateCardDiv = selectTemplate.content.querySelector(".PersonCard");

    selectTemplateContainer.classList='c'+cardNumber.substring(4);
    selectTemplateButton.setAttribute('id','c'+cardNumber.substring(4));
    selectTemplateCardDiv.classList=cardNumber;
    selectTemplateCardDiv.classList.add('PersonCard');
    selectTemplateCardDiv.setAttribute('onclick','onClickCard(event)');

    let templateClone = selectTemplateContainer.cloneNode(true);
    domNode_CardContainer.appendChild(templateClone);

}

//extract data from the input form , create object for that card and save the object in the storage
function extractFormData(inputCardNumber){

    objFormData['card']=inputCardNumber;
    
    for (let i = 0; i < domNode_inputFormElements.length; i++){
        objFormData[domNode_inputFormElements[i].dataset.key] = domNode_inputFormElements[i].value;
    }

    JsonCardObject = JSON.stringify(objFormData);
    sessionStorage.setItem(inputCardNumber ,JsonCardObject);
}

//set extracted data in the div tag for the current selected card
function setCardData(inputCardNumber){

    domNode_dataCardTags = document.querySelectorAll('.'+inputCardNumber+' > div');

    for (let i = 0; i < domNode_dataCardTags.length; i++){
        let elemDataKey = domNode_dataCardTags[i].dataset.key;
        domNode_dataCardTags[i].innerText = objFormData[elemDataKey];
    }
}

// clean form data 
function cleanForm(){

    for (let i = 0; i < domNode_inputFormElements.length; i++){
        domNode_inputFormElements[i].value='';
   }
}

/*function for the event attached to the template tag
 if there is no any clicked card then : fillInForm, do the actions for click the card and change the styles of the clicked card - add class 'PersonCard--active'

 if the clicked card is the same as the last clicked card then:
 - unclickCard()
 - remove the styles of the clicked card - remove class 'PersonCard--active'
 - set last clicked card to ''

 if the clicked card is different than the previous clicked then:
 - fill in the form with data of the current clicked card 
 - unclickCard previous clicked card
 - add the styles of the currently clicked card - add class 'PersonCard--active'
 */
function onClickCard(event){

    let clickedCardNumber = event.target.classList[0];
    console.log('last clicked '+ lastClickedCard+ '/ currently clicked '+ clickedCardNumber);

    if(lastClickedCard == ''){
   
        fillInForm(clickedCardNumber);
        clickCard(clickedCardNumber);

      } else if (clickedCardNumber == lastClickedCard) {

        unclickCard(clickedCardNumber);
        lastClickedCard = '';

    }  else {

        fillInForm(clickedCardNumber);

        let currentStorageKeys = Object.keys(sessionStorage);
        for (let i = 0; i < currentStorageKeys.length; i++){
            if(currentStorageKeys[i] == lastClickedCard ){
                unclickCard(lastClickedCard);
            }
        }

        clickCard(clickedCardNumber);
    }
    
    if(!domNode_btnEditPage.querySelector('.EditPageButton--active')){
        document.querySelector('.EditPeopleWrapper').classList.add('EditPeopleWrapper--expanded');
        domNode_btnEditPage.classList.add('EditPageButton--active');
    }
}

//for each element in the template container set the value in the form
function fillInForm(clickedCardNumber){

    domNode_dataCardTags = document.querySelectorAll('.'+clickedCardNumber+' > div');

    objFormData['card'] = clickedCardNumber;

    for (let i = 0; i < domNode_dataCardTags.length; i++){
        let elemDataKey = domNode_dataCardTags[i].dataset.key;
        objFormData[elemDataKey]= domNode_dataCardTags[i].innerText;
    }
}

/*do the actions for click the card
 - if the current clicked card is equal to the card in the object THEN set the values from the object in the form
 - change the label of the button from +Add person to Save
 - set lastClickedCard to be the same as current clicked card
*/
function clickCard(clickedCardNumber){

    if(clickedCardNumber == objFormData['card']){
        for (let i = 0; i < domNode_inputFormElements.length; i++){
            let elemDataKey = domNode_inputFormElements[i].dataset.key;
            domNode_inputFormElements[i].value = objFormData[elemDataKey];
        }
        
        document.getElementById('AddOnePerson').innerText='Save';
    }

    lastClickedCard = clickedCardNumber;
    document.querySelector('.'+clickedCardNumber).classList.add('PersonCard--active');
}

/*do the actions for unclick the card
 - clear Form
 - change the label of the button from Save to +Add person
*/
function unclickCard(clickedCardNumber){

    document.querySelector('.'+clickedCardNumber).classList.remove('PersonCard--active');

    cleanForm();

    document.getElementById('AddOnePerson').innerText='+ Add person';
}

//remove card when press Remove button
function onClickRemove(event){

    let removeElementId = event.target.getAttribute('id');
    let cardContainer = document.querySelector('.'+removeElementId);

    cardContainer.remove();

    sessionStorage.removeItem('card'+ removeElementId.substring(1));

    domNode_btnAddSavePerson.innerText='+ Add person';
    cleanForm();
}

//event listeners 
domNode_btnEditPage.addEventListener('click', openEditPage);
domNode_btnAddSavePerson.addEventListener('click', onClickAddSaveButton);