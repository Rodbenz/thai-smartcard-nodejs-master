const fs = require('fs');

function initializeSMC(seq, res, next) {
//   smc.readerSmartCard(io);
const filePath = 'data.json';

// Read the JSON file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
  
    try {
      // Parse JSON data
      const jsonData = JSON.parse(data);
      console.log('JSON data:', jsonData);
      res.send(jsonData);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
    }
  });
}
module.exports = {
  initializeSMC,
};
