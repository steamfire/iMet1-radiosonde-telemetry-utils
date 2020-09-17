// Delete the ParsedOutput and PasteCSVHere sheets to start.  Then run the sheetStarter function.
//  **PASTE** all the plain text from the skysonde flight.RAW file into PasteCSVHere. 
//  If coming from another google sheets page, PASTE SPECIAL> VALUES ONLY.
//  Then run the mainIMetProcessingFunction function.

//Prepare the spreadsheet with this function
//  This will create two SHEETS in the spreadsheet, PasteCSVHere and ParsedOutput.
//  It will NOT replace nor modify them if they already exist.
//    You will manually have to clear them to start over with a clean data set.

function sheetStarter(){
  prepSpreadSheet();  // Setup input and output sheets
  // Set the input sheet to plain text
  setPlainText("A1:Z", inputSheet);
  setPlainText("A1:Z", outputSheet);
  
}


// Ingest one sheet's data, Parse it, then insert it into another specific sheet. 
// Currently it takes 3 columns in - date, time and iMet hex telemetry string.
// This is the format output by SkySonde into the .RAW file in the flight directory.
// Currently just putting a decoded CSV dump into column three, will be mo' better later.
// CAUTION:  this will NOT overwrite data in the ParsedOutput sheet, it will just append rows to the bottom.
function mainIMetProcessingFunction(){
  var inSheet = SpreadsheetApp.getActive().getSheetByName("PasteCSVHere"); 
  var inRows = inSheet.getDataRange().getValues();
  
  var outSheet = SpreadsheetApp.getActive().getSheetByName("ParsedOutput");

  //create output array
  var outputArray = [];
  
  // parses ALL rows to the bottom of the list until the last row.
  inRows.forEach(
    function(individualRow) {
      var date = individualRow[0];
      var time = individualRow[1];
      var telemetryString = individualRow[2];
      

      // Return a parsed telemetry object, pass the decodediMetPacketObject.decodediMetPacketAsCSV to the next sheet
      var decodediMetPacketObject = iMet1Decode(telemetryString);
      
      // add a row to the output array  (change these names to be the array data that will be returned)
      outputArray.push([date, time, decodediMetPacketObject.decodediMetPacketAsCSV]);
      
      Logger.log(outputArray[0] + " " + outputArray[1] +  " " + outputArray[2]);
    }      
  ); 
  

  //  Pastes the array data after the last row of data in the target sheet
LockService.getScriptLock().waitLock(60000);
 outSheet
  .getRange(
    outSheet.getLastRow() + 1,
    1,
    outputArray.length,
    outputArray[0].length
  )
  .setValues(outputArray);
  
}
