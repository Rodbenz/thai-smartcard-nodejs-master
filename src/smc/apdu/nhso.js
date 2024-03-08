module.exports = {
  // Check card
  SELECT: [0x00, 0xa4, 0x04, 0x00, 0x08],
  NHSO_CARD: [0xa0, 0x00, 0x00, 0x00, 0x54, 0x48, 0x00, 0x83],

  // main rights
  CMD_MAININSCL: [0x80, 0xb0, 0x00, 0x04, 0x02, 0x00, 0x3c],

  // sub rights
  CMD_SUBINSCL: [0x80, 0xb0, 0x00, 0x40, 0x02, 0x00, 0x64],

  // main hospital name
  CMD_MAIN_HOSPITAL_NAME: [0x80, 0xb0, 0x00, 0xa4, 0x02, 0x00, 0x50],

  // sub hospital name
  CMD_SUB_HOSPITAL_NAME: [0x80, 0xb0, 0x00, 0xf4, 0x02, 0x00, 0x50],

  // paid type
  CMD_PAID_TYPE: [0x80, 0xb0, 0x01, 0x44, 0x02, 0x00, 0x01],

  // Issue Date
  CMD_ISSUE: [0x80, 0xb0, 0x01, 0x45, 0x02, 0x00, 0x08],

  // Expire Date
  CMD_EXPIRE: [0x80, 0xb0, 0x01, 0x4d, 0x02, 0x00, 0x08],

  // Update Date
  CMD_UPDATE: [0x80, 0xb0, 0x01, 0x55, 0x02, 0x00, 0x08],

  // Change Hospital Amount
  CMD_CHANGE_HOSPITAL_AMOUNT: [0x80, 0xb0, 0x01, 0x5d, 0x02, 0x00, 0x01],
};
