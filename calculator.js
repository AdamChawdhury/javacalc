let currentNum = "0";
let pastNum = "0";
let displayNum = "0";
let operator = "na";
let equalsFlag = false;  //Set to true if last operation was "="
let firstOperationFlag = false; //This is to fix some bugs occuring with first operations

//UI Elements

var object = document.getElementById('fullcontainer'); 

document.getElementById("display").innerHTML = currentNum;

addEventListener("keydown", (event) => { //keypress handling
    let target;
    if(event.key === "Backspace" && event.shiftKey){
        target = document.getElementById("ac");
    }
    else if(event.key === "Backspace"){
        if(currentNum.length === 1){
            currentNum = "0";
            updateScreen();
        }
        else{
            currentNum = currentNum.substring(0, currentNum.length - 1);
            updateScreen();
        }
    }
    else{
        switch(event.key){
            case "_":
                target = document.getElementById("negative");
                break;
            case "/":
                target = document.getElementById("divide");
                break;
            case "*":
                target = document.getElementById("times");
                break;                
            case "+":
                target = document.getElementById("plus");
                break;
            case "=":
                target = document.getElementById("equals");
                break;
            case "-":
                target = document.getElementById("minus");
                break;
            case "Enter":
                target = document.getElementById("equals");
                break;
            case ".":
                target = document.getElementById("decimal");
                break;
            case "0":
                target = document.getElementById("zero");
                break;
            case " ":
                target = document.getElementById("zero");
                break;
            default:
                if(isNumeric(event.key)){
                    target = document.getElementById(event.key);
                }
                break;
        }
    }
    if(target){
        target.click();
        target.classList.add('active');
        setTimeout(() => {
            target.classList.remove('active'); // Revert to original background color
        }, 300);1
    }

});

document.getElementById("zero").onclick = function(){
    if(currentNum !== "0" && currentNum.length < 17){
        currentNum += "0";
    }
    updateScreen();
};

const elements = document.querySelectorAll('.highlight');
elements.forEach(element => {
    
});

document.getElementById("1").onclick = function(){
    updateNum("1");
};

document.getElementById("2").onclick = function(){
    updateNum("2");
};

document.getElementById("3").onclick = function(){
    updateNum("3");
};

document.getElementById("4").onclick = function(){
    updateNum("4");
};

document.getElementById("5").onclick = function(){
    updateNum("5");
};

document.getElementById("6").onclick = function(){
    updateNum("6");
};

document.getElementById("7").onclick = function(){
    updateNum("7");
};

document.getElementById("8").onclick = function(){
    updateNum("8");
};

document.getElementById("9").onclick = function(){
    updateNum("9");
};

document.getElementById("decimal").onclick = function(){
    if(currentNum.length < 17 && currentNum.indexOf('.') <= -1){ //If no decimal already exists, append .
        currentNum += ".";
        updateScreen();
    }
};

document.getElementById("negative").onclick = function(){
    if(currentNum === "0"){ //Zero cannot be negative
        return;
    }
    if(currentNum.indexOf('-') <= -1){ //Number is positive, add negative
        currentNum = "-" + currentNum;
    }
    else{ //Number is negative, remove leading negative
        currentNum = currentNum.slice(1,currentNum.length);
    }
    updateScreen();
};

document.getElementById("ac").onclick = function(){
    if(currentNum != "0"){ //CE
        currentNum = "0";
        updateScreen();
    }
    else{
        currentNum = "0";
        pastNum = "0";
        displayNum = "0";
        operator = "na";
        equalsFlag = false;
        firstOperationFlag = false;
        updateScreen();    
    }
}

document.getElementById("percentage").onclick = function(){
    let number = Number(currentNum);
    number = number/100;
    Number((number).toFixed(16)); //TODO - FIX BUGS
    currentNum = number.toString();
    updateScreen();
}

//Helper functions

function updateNum(num){
    if(currentNum === "0"){ //If num is zero, replace with empty string
        currentNum = "";
    }
    if(currentNum.length < 17){ //Do not allow for lengths greater than 17 characters
        currentNum += num; //Append num to string and update the screen
        updateScreen();
    }
}

document.getElementById("plus").onclick = function(){
    if(!equalsFlag){Calculate();} //If continuing a computation (equals has not been hit), compute 
    firstOperationFlag = (operator === "na"); //Set firstOperationFlag accordingly
    equalsFlag = false;
    switch(operator){
        case "+": //Branch for chaining additions
            currentNum = "0";
            pastNum = "0";
            break;
        case "*":
        case "/":
            pastNum = "0"; //When moving from multiplication or division to addition, set default value for pastNum to zero (was previously one)
            operator = "+";
            currentNum = "0";
            break;
        default:
            pastNum = currentNum;
            operator = "+";
            currentNum = "0";
            break;
    }
    object.onkeypress = function(){updateScreen();}; 

}

document.getElementById("minus").onclick = function(){
    if(!equalsFlag){Calculate();} //Complete calculation if = has not been pressed
    firstOperationFlag = (operator === "na"); //Set firstOperationFlag accordingly
    equalsFlag = false;
    switch(operator){
        case "-": //Branch for chaining subtractions
            currentNum = "0";
            pastNum = "0";
            break;
        case "*":
        case "/":
            pastNum = "0"; //When moving from multiplication or division to addition, set default value for pastNum to zero (was previously one)
            operator = "-";
            currentNum = "0";
            break;
        default:
            pastNum = currentNum;
            operator = "-";
            currentNum = "0";
            break;
    }
    object.onkeypress = function(){updateScreen();};
}

document.getElementById("times").onclick = function(){
    if(!equalsFlag){Calculate();}
    firstOperationFlag = (operator != "*"); //Set firstOperationFlag accordingly
    equalsFlag = false;
    if(operator === "*"){ //Branch for chaining multiplications
        currentNum = "0";
        pastNum = "1";
    }
    else{
        pastNum = currentNum;
        currentNum = "0";
        operator = "*";
    }
    object.onkeypress = function(){updateScreen();};
}

document.getElementById("divide").onclick = function(){
    if(!equalsFlag){Calculate();}
    firstOperationFlag = (operator != "/"); //Set firstOperationFlag accordingly
    equalsFlag = false;
    if(operator === "/"){ //Branch for chaining divisions
        currentNum = "0";
        pastNum = "1";
    }
    else{
        operator = "/";
        pastNum = currentNum;
        currentNum = "0";
    }
    object.onkeypress = function(){updateScreen();};
}

document.getElementById("equals").onclick = function(){
    Calculate();
    equalsFlag = true;
}

function updateScreen(){ //Update display with currentNum
    document.getElementById("ac").innerHTML = (currentNum == "0") ? "AC" : "CE";
    document.getElementById("display").innerHTML = currentNum;
}

function updateScreen2(){ //Updates display using displayNum
    document.getElementById("display").innerHTML = displayNum;
}

//Arithmetic operations

function Calculate(){
    switch(operator){
        case "na":
            break;
        case "+":
            displayNum = sumNum(currentNum,pastNum,displayNum); //Calculate number to display
            if(currentNum != 0){ //If no carry exists, set the carry
                pastNum = currentNum;
            }
            currentNum = "0"; //Reset currentNum & update screen
            updateScreen2(); //Update display with DisplayNum. Uses updateScreen2
            break;
        case "-":
            displayNum = subNum(currentNum, pastNum, displayNum);
            if(currentNum != 0){
                pastNum = currentNum;
            }
            currentNum = "0";
            updateScreen2();
            break;
        case "*":
            if(firstOperationFlag){ //Logic for transitioning from addition/subtraction to multiplication - uses proper values/carries
                if(displayNum === "0"){ //If no number is displayed, compute pastNum*currentNum
                    displayNum = times(currentNum, pastNum);
                }
                else{ //Otherwise, compute displayNum*currentNum 
                    displayNum = times(currentNum, displayNum);
                }
            }
            else{ //Otherwise, compute as normal with carry
                displayNum = times(currentNum, pastNum, displayNum);
            }
            if(currentNum != 1){ //Set carry
                pastNum = currentNum;
            }
            currentNum = "1";
            updateScreen2();
            break;
        case "/":
            if(firstOperationFlag){ //Logic for transitioning from addition/subtraction to multiplication - uses proper values/carries
                //If no number is currently displayed, compute pastNum/currentNum
                //Other branch is used when dividing directly after an addition/subtraction operation
                displayNum = (displayNum === "0") ? divide(currentNum, pastNum) : divide(currentNum, displayNum);
            }
            else{
                //If pastNum is 1 (default value) & currentNum is not 1, compute displayNum/currentNum
                //Else, compute displayNum/pastNum
                displayNum = (currentNum != "1" && pastNum === "1") ? divide(currentNum, displayNum) : divide(pastNum, displayNum);
            }
            if(currentNum != 1){ //If carry is not set, set carry
                pastNum = currentNum;
            }
            currentNum = "1";
            updateScreen2();  
            break;
    }
}

function sumNum(numOne,numTwo, numThree = "0"){
    let sumTotal;
    if(firstOperationFlag && currentNum === "0"){ //Edge case - subtracting zero - potentially figure out an easier way to handle this?
        firstOperationFlag = false;
        currentNum = 0;
        displayNum = pastNum;
        pastNum = 0;
        sumTotal = Number(numOne) + Number(numTwo) + Number(numThree);
        return String(sumTotal);
    }
    sumTotal = Number(numOne) + Number(numTwo) + Number(numThree);
    firstOperationFlag = false;
    return String(sumTotal);
}

function subNum(numOne,numTwo,numThree = "0"){ //currentNum, pastNum, displayNum
    let sumTotal;
    if(firstOperationFlag && currentNum === "0"){ //Edge case - subtracting zero - potentially figure out an easier way to handle this?
        firstOperationFlag = false;
        currentNum = 0;
        displayNum = pastNum;
        pastNum = 0;
        sumTotal = Number(displayNum) - Number(currentNum) - Number(pastNum);
        return String(sumTotal);
    }
    firstOperationFlag = false;
    if(numThree != "0"){ //When a carry exists - e.g when operations are compounded
        sumTotal = Number(numThree) - Number(numOne) - Number(numTwo);
    }
    else if(currentNum === "0"){ //When a carry exists but currentNum is zero
        sumTotal = Number(numThree) - Number(numTwo);
    }
    else{ //No carry - simple subtraction operation
        sumTotal = Number(numTwo) - Number(numOne);
    }
    return String(sumTotal);
}

function times(numOne,numTwo, numThree = "1"){
    if(firstOperationFlag){
        firstOperationFlag = false;
    }
    let timesTotal = Number(numOne) * Number(numTwo) * Number(numThree);
    return String(timesTotal);
}

function divide(numOne,numTwo){ //numOne is the denominator, numTwo is the numerator
    if(numOne === "0"){
        return "0";
    }
    if(firstOperationFlag){
        firstOperationFlag = false;
    }
    let timesTotal = Number(numTwo) / Number(numOne);
    return String(timesTotal);
}

function isNumeric(str){
    return !isNaN(str) && !isNaN(parseFloat(str));
}