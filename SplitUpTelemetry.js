// Function 

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
      var decodediMetPacketObject = parseGPSPacketIntoiMet1Vars(byteTelemetryArray);
      break;
      
    case 3: // XDATA Packet (Ozonesonde is a subset of this)
      var decodediMetPacketObject = parseXDATAPacketIntoiMet1Vars(byteTelemetryArray);
      break;
      
    case 4: // PTUX Packet
      var decodediMetPacketObject = parsePTUXPacketIntoiMet1Vars(byteTelemetryArray);
      break;
      
    default:
    // code block
      Logger.log("AN UNKNOWN PACKET TYPE WAS DETECTED: "+packetID);      
  }
  
   
  return decodediMetPacketObject;
  
}



// Determine the kind of packet that this byte array is
function iMet1PacketTypeIdentifier(byteArrayInput) {
  //array position 1 is the packet type identifier
  var packetType = byteArrayInput[1];  
  
  return packetType;
}





// Take GPS byte array and parse into proper variables
function parseGPSPacketIntoiMet1Vars(byteTelemetryArray) {
  Logger.log("GPS Packet Detected: " + byteTelemetryArray);
  
  var GPSdecodedObject = new Object();
  
   //array position 1 is the packet type identifier
   GPSdecodedObject.packetType = byteTelemetryArray[1];  
  
  
  //Latitude (LSB) (4bytes) Pos=2
    // Create a reversed order array (to be MSB)
    var latMSBArray = new Uint8Array([
      byteTelemetryArray[5],
      byteTelemetryArray[4],
      byteTelemetryArray[3],
      byteTelemetryArray[2]]);  

    // Convert to float, with 5 decimal places
    GPSdecodedObject.latitude = byteArrayToFloat(latMSBArray).toFixed(5);
  
  //Longitude (LSB) (4bytes) Pos=6
      var lonMSBArray = new Uint8Array([
      byteTelemetryArray[9],
      byteTelemetryArray[8],
      byteTelemetryArray[7],
      byteTelemetryArray[6]]);  
    // Convert to float
    GPSdecodedObject.longitude = byteArrayToFloat(lonMSBArray).toFixed(5);
  
  //Altitude (LSB) (2bytes) Pos=10
    var altMSBArray = new Uint8Array([
      byteTelemetryArray[11],
      byteTelemetryArray[10]]);
    //Convert to variable
    var viewAlt = new DataView(altMSBArray.buffer);
    //Scale to iMet
    var unscaledAltitude = viewAlt.getInt16();
  GPSdecodedObject.altitude = unscaledAltitude - 5000;
  
  //Sats (1byte) Pos=12
  GPSdecodedObject.satellites = byteTelemetryArray[12];
  
  //Hours (1byte) Pos=13
  var GPShours = ("00" + byteTelemetryArray[13]).slice(-2);
  
  //Minutes (1byte) Pos=14
  var GPSminutes = ("00" + byteTelemetryArray[14]).slice(-2);
  
  //Seconds (1byte) Pos=15
  var GPSseconds = ("00" + byteTelemetryArray[15]).slice(-2);
  
  //time
  GPSdecodedObject.gpsTimeString = GPShours + ":" + GPSminutes + ":" + GPSseconds;
  //CRC (MSB) (2bytes) Pos=16
  
  GPSdecodedObject.decodediMetPacketAsCSV = GPSdecodedObject.latitude  + "," +  GPSdecodedObject.longitude  + "," + GPSdecodedObject.altitude + "," +  GPSdecodedObject.satellites  + "," + GPSdecodedObject.gpsTimeString;
  Logger.log("GPS Packet: " + GPSdecodedObject.decodediMetPacketAsCSV);
  return GPSdecodedObject;
}




// Take PTUX byte array and parse into proper variables
// *****FIELDS ARE LSB****
function parsePTUXPacketIntoiMet1Vars(byteTelemetryArray) {
    var PTUXdecodedObject = new Object();
  
   //array position 1 is the packet type identifier
   PTUXdecodedObject.packetType = byteTelemetryArray[1];  
  
  
  
  // Packet Sequence Number 2bytes Pos=2
    // Change to MSB and combine to one variable
      var ptuxPSeqNumMSBArray = new Uint8Array([
      byteTelemetryArray[3],
      byteTelemetryArray[2]]);
    //Convert to variable
    var viewptuxSeqNum = new DataView(ptuxPSeqNumMSBArray.buffer);
    //Scale to iMet
    PTUXdecodedObject.ptuxPacketSeqNumber = viewptuxSeqNum.getInt16();
    
  
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
    PTUXdecodedObject.PTUXpressure = PTUXpressureUnscaled / 100 ;
  
  
  // Temperature 2bytes Pos=7 (T/100) [°C]
        var PTUXexternalTemperatureMSBArray = new Uint8Array([
      byteTelemetryArray[8],
      byteTelemetryArray[7]]);
    //Convert to variable
    var viewPTUXexternalTemperature = new DataView(PTUXexternalTemperatureMSBArray.buffer);
    //Scale to iMet
    var PTUXexternalTemperatureUnscaled = viewPTUXexternalTemperature.getInt16();
     //Scale to iMet
    PTUXdecodedObject.PTUXexternalTemperature = PTUXexternalTemperatureUnscaled / 100 ;
  
  // Humidity 2bytes Pos=9 (U/100) [%RH]
        var PTUXhumidityMSBArray = new Uint8Array([
      byteTelemetryArray[10],
      byteTelemetryArray[9]]);
    //Convert to variable
    var viewPTUXhumidity = new DataView(PTUXhumidityMSBArray.buffer);
    //Scale to iMet
    var PTUXhumidityUnscaled = viewPTUXhumidity.getInt16();
     //Scale to iMet
    PTUXdecodedObject.PTUXhumidity = PTUXhumidityUnscaled / 100 ;
  
  
  
  // Battery Voltage 1byte Pos=11 (VBAT/10) [V]
    PTUXdecodedObject.PTUXbatteryVoltage = byteTelemetryArray[11] / 10 ;
  
  
  // Radiosonde Internal Temperature 2byte Pos=12 (TI/100) [°C]
          var PTUXradiosondeInternalTemperatureMSBArray = new Uint8Array([
      byteTelemetryArray[13],
      byteTelemetryArray[12]]);
    //Convert to variable
    var viewPTUXradiosondeInternalTemperature = new DataView(PTUXradiosondeInternalTemperatureMSBArray.buffer);
    //Scale to iMet
    var PTUXradiosondeInternalTemperatureUnscaled = viewPTUXradiosondeInternalTemperature.getInt16();
     //Scale to iMet
    PTUXdecodedObject.PTUXradiosondeInternalTemperature = PTUXradiosondeInternalTemperatureUnscaled / 100 ;
  
  
  
  // Pressure Sensor Temperature 2byte Pos=14 (PT/100) [°C]
        var PTUXpressureSensorTemperatureMSBArray = new Uint8Array([
      byteTelemetryArray[15],
      byteTelemetryArray[14]]);
    //Convert to variable
    var viewPTUXpressureSensorTemperature = new DataView(PTUXpressureSensorTemperatureMSBArray.buffer);
    //Scale to iMet
    var PTUXpressureSensorTemperatureUnscaled = viewPTUXpressureSensorTemperature.getInt16();
     //Scale to iMet
    PTUXdecodedObject.PTUXpressureSensorTemperature = PTUXpressureSensorTemperatureUnscaled / 100 ;
  
  
  
  // Humidity Sensor Temperature 2byte Pos=16 (UT/100) [°C]
        var PTUXhumiditySensorTemperatureMSBArray = new Uint8Array([
      byteTelemetryArray[17],
      byteTelemetryArray[16]]);
    //Convert to variable
    var viewPTUXhumiditySensorTemperature = new DataView(PTUXhumiditySensorTemperatureMSBArray.buffer);
    //Scale to iMet
    var PTUXhumiditySensorTemperatureUnscaled = viewPTUXhumiditySensorTemperature.getInt16();
     //Scale to iMet
    PTUXdecodedObject.PTUXhumiditySensorTemperature = PTUXhumiditySensorTemperatureUnscaled / 100 ;


    
   PTUXdecodedObject.decodediMetPacketAsCSV = PTUXdecodedObject.ptuxPacketSeqNumber+ "," + PTUXdecodedObject.PTUXpressure+ "," 
   +  PTUXdecodedObject.PTUXexternalTemperature+ "," +  PTUXdecodedObject.PTUXhumidity+ "," +  PTUXdecodedObject.PTUXbatteryVoltage + "," +  
     PTUXdecodedObject.PTUXradiosondeInternalTemperature + "," +  PTUXdecodedObject.PTUXpressureSensorTemperature + "," +  PTUXdecodedObject.PTUXhumiditySensorTemperature;
  
  Logger.log("PTUX Object CSV Packet: " + PTUXdecodedObject.decodediMetPacketAsCSV); 
   return PTUXdecodedObject;
  
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
        var decodedXDATAPacketObject = parseOZONESONDEPacketIntoiMet1Vars(byteTelemetryArray);
        break;
        
      default:
    }
  return decodedXDATAPacketObject; 
}





// Take OZONESONDE byte array and parse into proper variables
//    This is a specific instrument format of the XDATA protocol.
// ********** FIELDS HERE ARE MSB FIRST!!!! *********
function parseOZONESONDEPacketIntoiMet1Vars(byteTelemetryArray) {
  var OZdecodedObject = new Object();
  
   //array position 1 is the packet type identifier
   OZdecodedObject.packetType = byteTelemetryArray[1];  
  

   //Message Length  1byte Pos=2  (THIS MEANS ALL BYTES AFTER THIS BYTE, 
   //   EXCEPT THE CRC AT THE END)
   OZdecodedObject.OZmessageLength = byteTelemetryArray[2];
   
  // Instrument ID 1byte Pos=3  (always 1 for Ozonesonde)
  OZdecodedObject.OZinstrumentID = byteTelemetryArray[3];
  
  // Daisy Chain Index  Pos=4
  OZdecodedObject.OZdaisyChainIndex = byteTelemetryArray[4];
  
  
  // Cell Current (IC) Scale: (IC/1000)=[µA]  2bytes Pos=5 
     var OZcellCurrentMSBArray = new Uint8Array([
      byteTelemetryArray[5],
      byteTelemetryArray[6]]);
    //Convert to variable
    var viewOZcellCurrent = new DataView(OZcellCurrentMSBArray.buffer);
    //Scale to iMet
    var unscaledOZcellCurrent = viewOZcellCurrent.getInt16();
    OZdecodedObject.OZcellCurrent = unscaledOZcellCurrent / 1000;
  
  
  // Pump Temperature (TP) Scale: (TP/100)=[°C] 2bytes Pos=7
       var OZpumpTemperatureMSBArray = new Uint8Array([
      byteTelemetryArray[7],
      byteTelemetryArray[8]]);
    //Convert to variable
    var viewOZpumpTemperature = new DataView(OZpumpTemperatureMSBArray.buffer);
    //Scale to iMet
    var unscaledOZpumpTemperature = viewOZpumpTemperature.getInt16();
    OZdecodedObject.OZpumpTemperature = unscaledOZpumpTemperature / 100;
  
  
  // Pump Current (IP)  Scale: (IP) [mA] 1byte Pos=9
    OZdecodedObject.OZpumpCurrent = byteTelemetryArray[9];
  
  
  
  // Battery Voltage (VBAT) Scale: (VBAT/10) [V] 1byte Pos=10
   OZdecodedObject.OZbatteryVoltage = byteTelemetryArray[10] / 10;

  OZdecodedObject.decodediMetPacketAsCSV = OZdecodedObject.OZmessageLength + "," + OZdecodedObject.OZinstrumentID  + "," + OZdecodedObject.OZdaisyChainIndex  + 
    "," +  OZdecodedObject.OZcellCurrent  + "," + OZdecodedObject.OZpumpTemperature  + "," + OZdecodedObject.OZpumpCurrent  + "," + OZdecodedObject.OZbatteryVoltage;
  
  Logger.log("OZONESONDE Packet: " + OZdecodedObject.decodediMetPacketAsCSV );
  
  return OZdecodedObject;

}