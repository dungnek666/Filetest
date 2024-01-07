const fs = require("fs-extra");
const login = require("fca-disme");
const readline = require("readline");
const totp = require("totp-generator");
const os = require('os');
const logger = require("./utils/log");
let configPath = "";
let argv = process.argv.slice(2);
if (argv.length !== 0) configPath = argv[0];
else configPath = "./config.json";

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const option = {
  logLevel: "silent",
  forceLogin: true,
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
};

const config = require(`./${configPath}`);
let email = config.EMAIL;
let password = config.PASSWORD;
let otpkey = config.OTPKEY.replace(/\s+/g, '').toLowerCase();
console.log(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`);
logger("Đang tiến hành đăng nhập...", "┣➤ [ LOGIN - MIDONG ]");
logger("Tiến hành đăng nhập tại:", "┣➤ [ LOGIN - MIDONG ]");
logger(`Email: ${email}`, "┣➤ [ LOGIN - MIDONG ]");
logger(`Password: ${password}`, "┣➤ [ LOGIN - MIDONG ]");
logger(`Địa chỉ IP: ${ipAddresses}`, "┣➤ [ LOGIN - MIDONG ]");
login({ email, password }, option, (err, api) => {
  if (err) {
    switch (err.error) {
      case "login-approval":
        if (otpkey) err.continue(totp(otpkey));
        else {
  logger("Trạng thái: false", "┣➤ [ LOGIN - MIDONG ]");
  logger(`Vui lòng nhập mã xác minh 2 bước: `, "┣➤ [ LOGIN - MIDONG ]");
          rl.on("line", line => {
            err.continue(line);
            rl.close();
          });
        }
        break;
      default:
      console.error(err);
      process.exit(1);
    }
    return;
  }
  const json = JSON.stringify(api.getAppState());
fs.writeFileSync(`./appstate.json`, json);
  logger("Trạng thái: true", "┣➤ [ LOGIN - MIDONG ]");
  logger("Đã ghi xong appstate vào mục appstate.json", "┣➤ [ LOGIN - MIDONG ]"); 
console.log(`┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`);
  process.exit(0);
});           
