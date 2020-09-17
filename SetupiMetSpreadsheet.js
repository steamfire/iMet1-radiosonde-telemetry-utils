var inputSheet = "PasteCSVHere";
var outputSheet = "ParsedOutput";

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



