// JAVASCRIPT
//
// Intermet Radiosonde iMet1 versions Protocol CRC Checker
// Dan Bowen 2020 steamfire@gmail.com
// MIT License
// Based on code from https://www.tahapaksu.com/crc/js/crcmaster.js by N.Taha Paksu.  
//    Home of the wonderful online CRC checker: https://www.tahapaksu.com/crc/
//    That code was provided without a license specified, as of 20200915
//
// USAGE:
//   Input: iMet1_CRC_Check() with an ASCII string of the entire raw packet (hexadecimal ascii), 
//     including the CRC at the end.  If you don't know if the CRC is at the end, 
//     then it will still be there, as you'd have had to remove it purposely. No worries.
//   Returns: a 0 if the packet CRC checks correctly.
//     May return other numbers for failing the CRC check, so just do a check for a 0 return for success.



function iMet1_CRC_Check(inputPacket) {
  
  // iMet1 Packet Format includes the last two bytes (4 hex digits) as a CRC, in MSB 
  //  (most significant byte) order.  THIS IS IN STARK CONTRAST TO THE REST OF THE PACKET
  //  VARIABLES, which are LSB.  The iMet protocol doesn't talk about whether the CRC is LSB
  //  or MSB, but trust me, lol, it's in MSB.  I've checked. 

  packetWithoutCRC = inputPacket.substring(0, inputPacket.length - 4);
  CRCasMSB = inputPacket.slice(-4);

  var clean = CleanString(packetWithoutCRC);
   
  var computedCRC = CRC1D0F(clean);
  
  
  // Convert to string ascii hex characters, and make them uppercase
  hexStringComputedCRC = computedCRC.toString(16).toUpperCase();
  
  // check to see if the provided CRC matches the computed CRC
  return hexStringComputedCRC.localeCompare(CRCasMSB);
  
}


function CleanString(input) {
  CleanedString = hexStringToString(input.toUpperCase().replace(/[\t ]/g, ''));
  return CleanedString;
}

function CRC1D0F(str) {
  
        var crc = 0x1D0F;
        for (var c = 0; c < str.length; c++) {
            crc ^= str.charCodeAt(c) << 8;
            for (var i = 0; i < 8; i++) {
                if (crc & 0x8000)
                    crc = (crc << 1) ^ 0x1021;
                else
                    crc = crc << 1;
            }
        }
        //var out =  (crc & 0xFFFF)
        //console.log(hexString = out.toString(16));
        return crc &= 0xFFFF;
    }


function hexStringToString (inputstr) {
        var hex = inputstr.toString(); //force conversion
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }

   