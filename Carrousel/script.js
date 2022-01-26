// var domNode_imageWrapper = document.querySelector('.imageWrapper');
var domNode_buttonWrapper = document.querySelector('.navigationWrapper');
var domNode_displayImage = document.querySelector('.displayImage');
var imageArray =[];
var image = 0;
var imageId = 1;
var previousImageId = 1;
var imageArrayIndex = 0;

//add images in the array
createImageArray();

//show Buttons
showButtons();

// loop images 
// // first dot 
document.getElementById('1').classList.add('navigationDot--active');

setInterval(showImage,5000);

function showButtons(){
    //show buttons
    for (let i = 0; i < imageArray.length; i++){
        var button = document.createElement('div') ;
        button.classList.add('navigationDot');
        button.setAttribute('id', String((i+1)));
         button.setAttribute('onclick','onClickDot(event)');
        domNode_buttonWrapper.appendChild(button); 
    }
}

function createImageArray(){
    for(let i = 0; i < 3; i++){
        imageArray.push('images/image'+ (i+1) +'.jpg');
    }
    imageArray.push('images/image4.webp');
}

function showImage(imageNumber){

    imageArrayIndex++;

    if(imageNumber){
        imageId = imageNumber;  //current 
        imageArrayIndex = imageNumber;

    }
    document.querySelector('.navigationDot--active').classList.remove('navigationDot--active');
        
        if (imageId < imageArray.length){
            document.getElementById(imageId+1 ).classList.add('navigationDot--active');
        } else {
            imageId=0;
            imageArrayIndex=0;
            document.getElementById(imageId+1 ).classList.add('navigationDot--active');
        }
    
        domNode_displayImage.setAttribute('src',  imageArray[imageArrayIndex]);
        imageId++;
}


//on click 
function onClickDot(event){
    setInterval(showImage(event.target.getAttribute('id')-1), 5000);    
}