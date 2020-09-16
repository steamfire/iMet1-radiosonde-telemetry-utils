var inputSheet = "PasteCSVHere";
var outputSheet = "ParsedOutput";

function SheetStarter(){
  prepSpreadSheet();  // Setup input and output sheets
// Set the input sheet to plain text
  setPlainText("A2:D", inputSheet);
}


  // Set up two new sheets to be input and output
  // (or just use the current sheets if they already exist)
function prepSpreadSheet(){
  
  // just ignore things and proceed if the two sheets are already created for now.
  try{
 SpreadsheetApp.getActiveSpreadsheet().insertSheet(inputSheet);
 SpreadsheetApp.getActiveSpreadsheet().insertSheet(outputSheet);
  }
  catch(err){
    Logger.log(err);
    }
}


//sets a range of cells in a sheet to PLAIN TEXT
function setPlainText(rangeDesired,sheetName){
      // If there's no sheetName provided,just use the active sheet
  if ( !sheetName ) {
    var sheet = SpreadsheetApp.getActiveSheet();
    } else {
      var sheet = SpreadsheetApp.getActive().getSheetByName(sheetName); 
    }
  //Sets the given range into plain text
  //Specify range input as "A2:B" or "A2:A7" or "B:B" etc.
  sheet.getRange(rangeDesired).setNumberFormat('@STRING@');
}



function suckInAFewLines() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    Logger.log('Date: ' + data[i][0]);
    Logger.log('Time: ' + data[i][1]);
    Logger.log('Hex: ' + data[i][2]);
  }
}