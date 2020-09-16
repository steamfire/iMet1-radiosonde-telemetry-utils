function testiMet1Decode() {
  //var testHexTelemetryString = "0102FDBA17420E73F4C2D25309100312D6C0"; //GPS example
  var testHexTelemetryString = "010308010000D60852000060AC"  //XDATA Ozonesonde example
  //var testHexTelemetryString = "0104872C5B890195055D2537EA0B0B0D9505CBB2" //PTUX packet example
  var decodediMetPacketAsCSV = iMet1Decode(testHexTelemetryString);
  Logger.log(decodediMetPacketAsCSV);

}


function iMet1Decode(hexTelemetryString){

  //  Logger.log("hexTelemetryString: "+hexTelemetryString);
    
  // Convert the text ascii Hex character string into byte array
  var byteTelemetryArray = hexStringToByteArray(hexTelemetryString);
  //Logger.log("byteTelemetryArray: "+byteTelemetryArray);
  
  //Determine what kind of packet
  var packetID = iMet1PacketTypeIdentifier(byteTelemetryArray);
  //Logger.log(packetID);
  
  //Choose how to parse the packet based on ID number:
  switch(packetID) {
    
    case 2: // GPS Packet
      var decodediMetPacketAsCSV = parseGPSPacketIntoiMet1Vars(byteTelemetryArray);
      break;
      
    case 3: // XDATA Packet (Ozonesonde is a subset of this)
      var decodediMetPacketAsCSV = parseXDATAPacketIntoiMet1Vars(byteTelemetryArray);
      break;
      
    case 4: // PTUX Packet
      var decodediMetPacketAsCSV = parsePTUXPacketIntoiMet1Vars(byteTelemetryArray);
      break;
      
    default:
    // code block
      Logger.log("AN UNKNOWN PACKET TYPE WAS DETECTED: "+packetID);      
  }
  
  return decodediMetPacketAsCSV; 
  
}



// Determine the kind of packet that this byte array is
function iMet1PacketTypeIdentifier(byteArrayInput) {
  //array position 1 is the packet type identifier
  var packetType = byteArrayInput[1];  
  
  return packetType;
}





// Take GPS byte array and parse into proper variables
function parseGPSPacketIntoiMet1Vars(byteTelemetryArray) {
  Logger.log("GPS Packet Detected");
  //Latitude (LSB) (4bytes) Pos=2
    // Create a reversed order array (to be MSB)
    var latMSBArray = new Uint8Array([
      byteTelemetryArray[5],
      byteTelemetryArray[4],
      byteTelemetryArray[3],
      byteTelemetryArray[2]]);  
    // Convert to float, with 5 decimal places
    var latitude = byteArrayToFloat(latMSBArray).toFixed(5);
  
  //Longitude (LSB) (4bytes) Pos=6
      var lonMSBArray = new Uint8Array([
      byteTelemetryArray[9],
      byteTelemetryArray[8],
      byteTelemetryArray[7],
      byteTelemetryArray[6]]);  
    // Convert to float
    var longitude = byteArrayToFloat(lonMSBArray).toFixed(5);
  
  //Altitude (LSB) (2bytes) Pos=10
    var altMSBArray = new Uint8Array([
      byteTelemetryArray[11],
      byteTelemetryArray[10]]);
    //Convert to variable
    var viewAlt = new DataView(altMSBArray.buffer);
    //Scale to iMet
    unscaledAltitude = viewAlt.getInt16();
  var  altitude = unscaledAltitude - 5000;
  
  //Sats (1byte) Pos=12
  var satellites = byteTelemetryArray[12];
  
  //Hours (1byte) Pos=13
  GPShours = ("00" + byteTelemetryArray[13]).slice(-2);
  
  //Minutes (1byte) Pos=14
  GPSminutes = ("00" + byteTelemetryArray[14]).slice(-2);
  
  //Seconds (1byte) Pos=15
  GPSseconds = ("00" + byteTelemetryArray[15]).slice(-2);
  
  //time
  var gpsTimeString = GPShours + ":" + GPSminutes + ":" + GPSseconds;
  //CRC (MSB) (2bytes) Pos=16
  
  var GPSiMetDecodedCSV = latitude  + "," +  longitude  + "," + altitude + "," +  satellites  + "," + gpsTimeString;
  Logger.log("GPS Packet: " + GPSiMetDecodedCSV);
  return GPSiMetDecodedCSV;
}




// Take PTUX byte array and parse into proper variables
// *****FIELDS ARE LSB****
function parsePTUXPacketIntoiMet1Vars(byteTelemetryArray) {
  // Packet Sequence Number 2bytes Pos=2
    // Change to MSB and combine to one variable
      var ptuxPSeqNumMSBArray = new Uint8Array([
      byteTelemetryArray[3],
      byteTelemetryArray[2]]);
    //Convert to variable
    var viewptuxSeqNum = new DataView(ptuxPSeqNumMSBArray.buffer);
    //Scale to iMet
    var ptuxPacketSeqNumber = viewptuxSeqNum.getInt16();
    
  
  // Pressure 3bytes Pos=4 (P/100) [mb]
      var PTUXpressureMSBArray = new Uint8Array([
      0,
      byteTelemetryArray[6],
      byteTelemetryArray[5],
      byteTelemetryArray[4]]);
    //Convert to variable
    var viewPTUXpressure = new DataView(PTUXpressureMSBArray.buffer);
    //Scale to iMet
    var PTUXpressureUnscaled = viewPTUXpressure.getInt32();
     //Scale to iMet
    var PTUXpressure = PTUXpressureUnscaled / 100 ;
  
  
  // Temperature 2bytes Pos=7 (T/100) [°C]
        var PTUXexternalTemperatureMSBArray = new Uint8Array([
      byteTelemetryArray[8],
      byteTelemetryArray[7]]);
    //Convert to variable
    var viewPTUXexternalTemperature = new DataView(PTUXexternalTemperatureMSBArray.buffer);
    //Scale to iMet
    var PTUXexternalTemperatureUnscaled = viewPTUXexternalTemperature.getInt16();
     //Scale to iMet
    var PTUXexternalTemperature = PTUXexternalTemperatureUnscaled / 100 ;
  
  // Humidity 2bytes Pos=9 (U/100) [%RH]
        var PTUXhumidityMSBArray = new Uint8Array([
      byteTelemetryArray[10],
      byteTelemetryArray[9]]);
    //Convert to variable
    var viewPTUXhumidity = new DataView(PTUXhumidityMSBArray.buffer);
    //Scale to iMet
    var PTUXhumidityUnscaled = viewPTUXhumidity.getInt16();
     //Scale to iMet
    var PTUXhumidity = PTUXhumidityUnscaled / 100 ;
  
  
  
  // Battery Voltage 1byte Pos=11 (VBAT/10) [V]
    var PTUXbatteryVoltage = byteTelemetryArray[11] / 10 ;
  
  
  // Radiosonde Internal Temperature 2byte Pos=12 (TI/100) [°C]
          var PTUXradiosondeInternalTemperatureMSBArray = new Uint8Array([
      byteTelemetryArray[13],
      byteTelemetryArray[12]]);
    //Convert to variable
    var viewPTUXradiosondeInternalTemperature = new DataView(PTUXradiosondeInternalTemperatureMSBArray.buffer);
    //Scale to iMet
    var PTUXradiosondeInternalTemperatureUnscaled = viewPTUXradiosondeInternalTemperature.getInt16();
     //Scale to iMet
    var PTUXradiosondeInternalTemperature = PTUXradiosondeInternalTemperatureUnscaled / 100 ;
  
  
  
  // Pressure Sensor Temperature 2byte Pos=14 (PT/100) [°C]
        var PTUXpressureSensorTemperatureMSBArray = new Uint8Array([
      byteTelemetryArray[15],
      byteTelemetryArray[14]]);
    //Convert to variable
    var viewPTUXpressureSensorTemperature = new DataView(PTUXpressureSensorTemperatureMSBArray.buffer);
    //Scale to iMet
    var PTUXpressureSensorTemperatureUnscaled = viewPTUXpressureSensorTemperature.getInt16();
     //Scale to iMet
    var PTUXpressureSensorTemperature = PTUXpressureSensorTemperatureUnscaled / 100 ;
  
  
  
  // Humidity Sensor Temperature 2byte Pos=16 (UT/100) [°C]
        var PTUXhumiditySensorTemperatureMSBArray = new Uint8Array([
      byteTelemetryArray[17],
      byteTelemetryArray[16]]);
    //Convert to variable
    var viewPTUXhumiditySensorTemperature = new DataView(PTUXhumiditySensorTemperatureMSBArray.buffer);
    //Scale to iMet
    var PTUXhumiditySensorTemperatureUnscaled = viewPTUXhumiditySensorTemperature.getInt16();
     //Scale to iMet
    var PTUXhumiditySensorTemperature = PTUXhumiditySensorTemperatureUnscaled / 100 ;


    
   var PTUXiMetDecodedCSV = ptuxPacketSeqNumber+ "," + PTUXpressure+ "," +  PTUXexternalTemperature+ "," +  PTUXhumidity+ "," +  PTUXbatteryVoltage + "," +  PTUXradiosondeInternalTemperature + "," +  PTUXpressureSensorTemperature + "," +  PTUXhumiditySensorTemperature;
      Logger.log("PTUX Packet: " + PTUXiMetDecodedCSV); 
   return PTUXiMetDecodedCSV;
  
}



// XDATA Packet
// Dynamical length = Ugh.  Just route the ozonesonde 
//   kind to that function for now.
// ********** FIELDS HERE ARE MSB FIRST!!!! *********
function parseXDATAPacketIntoiMet1Vars(byteTelemetryArray) {
   //Message Length  1byte Pos=2  (THIS MEANS ALL BYTES AFTER THIS BYTE, 
   //   EXCEPT THE CRC AT THE END)
   var XDATAmessageLength = byteTelemetryArray[2];
   
  // Instrument ID 1byte Pos=3  (always 1 for Ozonesonde)
  var XDATAinstrumentID = byteTelemetryArray[3];
  
  // Daisy Chain Index  Pos=4
  var XDATAdaisyChainIndex = byteTelemetryArray[4];
  
  // Instrument message **bytes, could be any length.  Pos=2


  // CRC  2bytes Pos=**Last 2 bytes of the message** 
  //   This does start after the number of bytes specified 
  //   as Message Length. 
  
  
  // Route the whole XDATA Packet to the appropriate 
  //   instrument decoder function
    switch(XDATAinstrumentID) {
    
      case 0x01: // Ozonesonde Packet
        var decodediMetPacketAsCSV = parseOZONESONDEPacketIntoiMet1Vars(byteTelemetryArray);
        break;
        
      default:
    }
  return decodediMetPacketAsCSV; 
}





// Take OZONESONDE byte array and parse into proper variables
//    This is a specific instrument format of the XDATA protocol.
// ********** FIELDS HERE ARE MSB FIRST!!!! *********
function parseOZONESONDEPacketIntoiMet1Vars(byteTelemetryArray) {


   //Message Length  1byte Pos=2  (THIS MEANS ALL BYTES AFTER THIS BYTE, 
   //   EXCEPT THE CRC AT THE END)
   var OZmessageLength = byteTelemetryArray[2];
   
  // Instrument ID 1byte Pos=3  (always 1 for Ozonesonde)
  var OZinstrumentID = byteTelemetryArray[3];
  
  // Daisy Chain Index  Pos=4
  var OZdaisyChainIndex = byteTelemetryArray[4];
  
  
  // Cell Current (IC) Scale: (IC/1000)=[µA]  2bytes Pos=5 
     var OZcellCurrentMSBArray = new Uint8Array([
      byteTelemetryArray[5],
      byteTelemetryArray[6]]);
    //Convert to variable
    var viewOZcellCurrent = new DataView(OZcellCurrentMSBArray.buffer);
    //Scale to iMet
    var unscaledOZcellCurrent = viewOZcellCurrent.getInt16();
    var OZcellCurrent = unscaledOZcellCurrent / 1000;
  
  
  // Pump Temperature (TP) Scale: (TP/100)=[°C] 2bytes Pos=7
       var OZpumpTemperatureMSBArray = new Uint8Array([
      byteTelemetryArray[7],
      byteTelemetryArray[8]]);
    //Convert to variable
    var viewOZpumpTemperature = new DataView(OZpumpTemperatureMSBArray.buffer);
    //Scale to iMet
    var unscaledOZpumpTemperature = viewOZpumpTemperature.getInt16();
    var OZpumpTemperature = unscaledOZpumpTemperature / 100;
  
  
  // Pump Current (IP)  Scale: (IP) [mA] 1byte Pos=9
    var OZpumpCurrent = byteTelemetryArray[9];
  
  
  
  // Battery Voltage (VBAT) Scale: (VBAT/10) [V] 1byte Pos=10
   var OZbatteryVoltage = byteTelemetryArray[10] / 10;

  var OZiMetDecodedCSV = OZmessageLength + "," + OZinstrumentID  + "," + OZdaisyChainIndex  + "," +  OZcellCurrent  + "," + OZpumpTemperature  + "," + OZpumpCurrent  + "," + OZbatteryVoltage;
  Logger.log("OZONESONDE Packet: " + OZiMetDecodedCSV );
  
  return OZiMetDecodedCSV;

}








