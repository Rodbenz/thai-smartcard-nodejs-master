const fs = require("fs");

 function createFileJS(data) {
    // console.log(data,'datadatadatadatadata');
  // File content you want to write

  // Convert data to JSON format
  const jsonData = JSON.stringify(data, null, 2); // null and 2 for pretty formatting
  
  // File path
  const filePath = 'data.json';
  
  // Write JSON data to file
  fs.writeFile(filePath, jsonData, (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('JSON file created successfully!');
    }
  });
}

module.exports ={
    createFileJS
}