// Just practicing javascript/google apps script concepts before implementing them.



function arraySliceTest() {
  
  var array1 = ['ant', 'bison', 'camel', 'duck', 'elephant'];
  
  console.log(array1.slice(1,4));
  
  

}
 

// Get rows and cells in sheet and parse them

function suckInAFewLines() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
  // The first bracket is rows, the second is cells.
  // This iterates through rows and in each row prints each cell.
    Logger.log('Date: ' + data[i][0]);
    Logger.log('Time: ' + data[i][1]);
    Logger.log('Hex: ' + data[i][2]);
  }
}







//The better you understand how to work with arrays in JavaScript, the more sense this data structure will make. At the end of the day, this is what our rows variable looks like after calling the above methods:
//https://jeffreyeverhart.com/2019/03/01/retrieve-rows-from-google-spreadsheet-with-google-apps-script/
//
//rows = [
//    ['ID','Event','Date'],
//    [1, 'Meeting', '02/03/2019'],
//    [2, 'Presentation', '02/05/2019'],
//    ...additional rows here
//  ]

function getAllDataTest1(){
var rows = SpreadsheetApp.getActiveSheet().getDataRange().getValues();

//The first and second parameters we pass into getRange represent the 
//top-left of our range (e.g. second row, first column), while the third 
//parameter tells the function how many rows tall the Range will be
//( e.g. six rows tall), and the last parameter tells the function how wide the Range will be (e.g. two rows wide).
var specificRows = SpreadsheetApp.getActiveSheet().getRange(2, 1, 6, 2).getValues()



rows.forEach(function(individualRow) {
 var date = individualRow[0];
 Logger.log(date);
});
}




  
  
  
  
  
  //Example Row array data:
//rows = [
//    ['Date','Time Received (computer time)','Telemetry Hex String'], // Header line
//    [2020/09/11, '15:39:07.000', '01030801000133085200003D57'],
//    [2020/09/11, '15:39:12.096', '0102EF3F1842CC71F4C2602A090F181B6A5F'],
//    ...additional rows here
//  ]

function getAllDataTest2(){
var rows = SpreadsheetApp.getActiveSheet().getDataRange().getValues();

// parses ALL rows to the bottom of the list until the last row.
rows.forEach(function(individualRow) {
  var date = individualRow[0];
  var time = individualRow[1];
  var telemetryString = individualRow[2];
  
  
 Logger.log(date + " " + time +  " " + telemetryString);
  
});
}





function addrows() {
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.appendRow(['Cotton Sweatshirt XL', 'css004']);
}

// Demo making an array and dropping all the values into cells/row/columsn in a sheet.
// Much faster than iterating with for loop.
function appendRowsSetValues(){

var ss = SpreadsheetApp.getActiveSpreadsheet();
var sheet = ss.getSheets()[0];
var example = [[1,2,3],[4,5,6],[7,8,9]];

LockService.getScriptLock().waitLock(60000);
sheet
  .getRange(
    sheet.getLastRow() + 1,
    1,
    example.length,
    example[0].length
  )
  .setValues(example);
}



// Takes all the data in a sheet and pastes in back into the sheet after the last row
// IT WORKS!!!!!!!!!!!!!!
// **************************
//
function batchPasteiMetRawInSameSheet(){
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  //create output array
  var outputArray = [];
  
  // parses ALL rows to the bottom of the list until the last row.
  rows.forEach(
    function(individualRow) {
      var date = individualRow[0];
      var time = individualRow[1];
      var telemetryString = individualRow[2];
      
      // add a ropw to the output array
      outputArray.push([time, date, telemetryString]);
      
      Logger.log(date + " " + time +  " " + telemetryString);
    }      
  ); 
  

  //  Pastes the array data after the last row of data in the sheet
  // (in this demo it pastes it after the data it read in, no very useful as-is,
  //  Need to change to paste it into another sheet for actual use.

LockService.getScriptLock().waitLock(60000);
 sheet
  .getRange(
    sheet.getLastRow() + 1,
    1,
    outputArray.length,
    outputArray[0].length
  )
  .setValues(outputArray);
  
}







// testing returning arrays from functions as objects

function testReturnArray(){
  let names = getNames();

let firstName = names.firstName,
    lastName = names.lastName;
  
  console.log(firstName + " "+ lastName);
}

function getNames() {
    // get names from the database or API
    let firstName = 'John',
        lastName = 'Doe';

    // return values
    return {
        firstName,
        lastName
    };
}

 
// Object return practice
      function returnObjectPlease(){
      var localObject = objectPractice()
      console.log(localObject.latitude);
      
      
    }
      
// Array object practice
      // Works
      function objectPractice () {
      
var person = new Object();
      
      person.name = "James";
      person.latitude = -122.2345436;
      
      
      console.log(person.name + person.latitude);
      
      
      return person;
      
      
    }