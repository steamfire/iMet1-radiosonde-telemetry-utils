function testArrayForLoop(){
  // Normal processing forward
  var inputArray = [1, 5, 10, 14.0];
  var outputArray = Array();
  for(let i = 0; i < inputArray.length; i++){ 
    outputArray.push(inputArray[i]);
  }
  Logger.log(outputArray);
}




function reverseArrayOrderTest(){
  // Reverse processing backward
  var inputArray = [1, 5, 10, 14.0];
  var outputArray = Array();
  for(let i = 0; i < inputArray.length; i++){ 
  
  outputArray.push(inputArray[inputArray.length-1-i]);
  }
  Logger.log(outputArray);

}



function testCrossFileCall() {
//Works!
  test3();
}



function test2() {
  var inputHexString = "C2F4730E";
  
  var byteArray = hexStringToBytes(inputHexString);
  Logger.log(byteArray);
  
  
  var resultFloat = byteArrayToFloat(byteArray);
  Logger.log(resultFloat);
}



function test3(){

  // WORKS!! hooray
  Logger.log("test3");
  
  
  //  var inputHexString = "C2F4730E";  /reversed iMet
  var inputHexString =   "0E73F4C2";  //iMet  Should be -122.22472
  
  var startingArray = hexStringToByteArray(inputHexString);
  
  
 // var startingArray = [0, 0, 0, 14.0];
     Logger.log("inputArray: "+startingArray); 
   
  var floatFromArray = byteArrayToFloat(startingArray
  );
    Logger.log("float from array: "+floatFromArray);
  
  var endingArray = reverseArrayOrder(startingArray);
    Logger.log("reversed array: "+endingArray);
    
 var floatFromReversedArray = byteArrayToFloat(endingArray);
  Logger.log("float from reversed array: "+floatFromReversedArray);  
}





function test5() {
  Logger.log("test4");
  var inputHexString = "C2F4730E";
  
  var byteArray = hexStringToByteArray(inputHexString);


}



