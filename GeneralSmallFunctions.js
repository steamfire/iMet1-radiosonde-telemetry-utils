// Small data massaging functions for the main scripts.



// reverseArrayOrder function
// Takes an array and reverses the order of the items.
// Input: Array
// Output:  reversed Array

function reverseArrayOrder(inputArray){
  // Reverse array order   
  var outputArray = new Array();
  for(let i = 0; i < inputArray.length; i++){ 
  
  outputArray.push(inputArray[inputArray.length-1-i]);
  }
  return outputArray;
}



// Takes an array of bytes and makes it into a Float32
// Input: Uint8 array
// Output: Float32 number

function byteArrayToFloat(data){
  
  // Create a buffer
  var buf = new ArrayBuffer(4);
  // Create a data view of it
  var view = new DataView(buf);
  
  // set bytes
  data.forEach(function (b, i) {
      view.setUint8(i, b);
  });
  
  // Read the bits as a float; note that by doing this, we're implicitly
  // converting it from a 32-bit float into JavaScript's native 64-bit double
  var num = view.getFloat32(0);
  // Done
  return num;
}


// Reverse Bytes of LSB order bytes to MSB order bytes. 
// Input: Array of LSB ordered bytes
// Output: Array of MSB ordered bytes
// https://stackoverflow.com/questions/5320439/how-do-i-swap-endian-ness-byte-order-of-a-variable-in-javascript
function reverse32bitVarFromLSBtoMSB(inputVar){

    var val = inputVar;
    return ((val & 0xFF) << 24)
           | ((val & 0xFF00) << 8)
           | ((val >> 8) & 0xFF00)
           | ((val >> 24) & 0xFF);
}


//Split String Hex into bytes
// Input: STRING of hex characters
// Output: Byte Array
// https://stackoverflow.com/questions/14603205/how-to-convert-hex-string-into-a-bytes-array-and-a-bytes-array-in-the-hex-strin

function hexStringToByteArray(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2) {
      var hexTwoChars = hex.substr(c, 2);
      var integerOfHexTwoChars = parseInt(hexTwoChars, 16);
      bytes.push(integerOfHexTwoChars);
    }
    return bytes;
}

// Convert a byte array to a hex string
//https://stackoverflow.com/questions/14603205/how-to-convert-hex-string-into-a-bytes-array-and-a-bytes-array-in-the-hex-strin
function bytesToHexString(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >>> 4).toString(16));
        hex.push((current & 0xF).toString(16));
    }
    return hex.join("");
}



