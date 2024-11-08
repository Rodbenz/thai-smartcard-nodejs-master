const { Devices } = require("smartcard");
const { PersonalApplet, NhsoApplet } = require("./applet");
const { createFileJS } = require("./createFile");

const DEFAULT_QUERY = ["cid", "name", "dob", "gender"];

const ALL_QUERY = [
  "cid",
  // "laser",
  "name",
  "nameEn",
  "dob",
  "gender",
  "issuer",
  "issueDate",
  "expireDate",
  "address",
  "photo",
  "nhso",
];

let query = [...ALL_QUERY];

function getSex(prefix) {
  if (prefix === 'นาย' || prefix === 'เด็กชาย') {
    return 'ชาย';
  } else if (prefix === 'นาง' || prefix === 'นางสาว') {
    return 'หญิง';
  } else {
    return 'ไม่ทราบ';
  }
}

module.exports.init = (io) => {
  const devices = new Devices();

  devices.on("device-activated", (event) => {
    const currentDevices = event.devices;
    const device = event.device;
    console.log(`Device '${device}' activated, devices: ${currentDevices}`);
    for (const prop in currentDevices) {
      console.log(`Devices: ${currentDevices[prop]}`);
    }

    device.on("card-inserted", async (event) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const card = event.card;
      const message = `Card '${card.getAtr()}' inserted into '${event.device}'`;
      io.emit("smc-inserted", {
        status: 202,
        description: "Card Inserted",
        data: {
          message,
        },
      });
      console.log(message);

      // card.on('command-issued', event => {
      //   console.log(`Command '${event.command}' issued to '${event.card}' `);
      // });

      // card.on('response-received', event => {
      //   console.log(`Response '${event.response}' received from '${event.card}' in response to '${event.command}'`);
      // });

      let req = [0x00, 0xc0, 0x00, 0x00];
      if (
        card.getAtr().slice(0, 4) === Buffer.from([0x3b, 0x67]).toString("hex")
      ) {
        req = [0x00, 0xc0, 0x00, 0x01];
      }

      try {
        const q = query ? [...query] : [...ALL_QUERY];
        let data = {};
        const personalApplet = new PersonalApplet(card, req);
        const personal = await personalApplet.getInfo(
          q.filter((key) => key !== "nhso")
        );
        data = {
          ...personal,
        };
        
        if (q.includes("nhso")) {
          const nhsoApplet = new NhsoApplet(card, req);
          const nhso = await nhsoApplet.getInfo();
          data = {
            ...data,
            nhso,
          };
        }
        // console.log("Received data", data);
        if(data){
          const setData = {...data, ...{sex: getSex(data.name.prefix)}}
          // console.log(setData);
          createFileJS({...setData, status:"success", message:"ข้อมูลเรียบร้อย"})
        }
        io.emit("smc-data", {
          status: 200,
          description: "Success",
          data,
        });
      } catch (ex) {
        const message = `Exception: ${ex.message}`;
        console.error(ex);
        io.emit("smc-error", {
          status: 500,
          description: "Error",
          data: {
            message,
          },
        });
        createFileJS({...{}, ...{status:"error"}})
        // process.exit(); // auto restart handle by pm2
      }
    });
    device.on("card-removed", (event) => {
      const message = `Card removed from '${event.name}'`;
      console.log(message);
      createFileJS({status:"error", message:"กรุณาเสียบบัตรประชาชน"})
      io.emit("smc-removed", {
        status: 205,
        description: "Card Removed",
        data: {
          message,
        },
      });
    });

    device.on("error", (event) => {
      const message = `Incorrect card input'`;
      console.log(message);
      createFileJS({status:"error",message: 'การป้อนข้อมูลบัตรไม่ถูกต้อง'})
      io.emit("smc-incorrect", {
        status: 400,
        description: "Incorrect card input",
        data: {
          message,
        },
      });
    });
  });

  devices.on("device-deactivated", (event) => {
    const message = `Device '${event.device}' deactivated, devices: [${event.devices}]`;
    createFileJS({status:"error", message:'ไม่พบอุปกรณ์สมาร์ทการ์ด กรุณาเชื่อมต่ออุปกรณ์'});
    // console.error(message);

    io.emit("smc-error", {
      status: 404,
      description: "Not Found Smartcard Device",
      data: {
        message,
      },
    });
  });

  devices.on("error", (error) => {
    const message = `${error.error}`;
    console.error(message);
    // createFileJS({status_error:"error_device", message_error:message});

    io.emit("smc-error", {
      status: 404,
      description: "Not Found Smartcard Device",
      data: {
        message,
      },
    });
  });
};

module.exports.setQuery = (q = ALL_QUERY) => {
  query = [...q];
  console.log(query);
};

module.exports.setAllQuery = () => {
  query = [...ALL_QUERY];
  console.log(query);
};
