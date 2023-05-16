const { app, Tray, Menu, clipboard } = require("electron");
const { ClipboardObserver } = require("./utils");
const Store = require("electron-store");
const store = new Store();
const path = require("path");

const createTray = function () {
  const size = 20;
  const width = 20;
  const tray = new Tray(path.resolve(__dirname, "./resources/copyRecord.png"));
  const clipboardData = store.get("clipboardData", []);
  const clipboardObserver = new ClipboardObserver({
    duration: 500,
    clipboardData: clipboardData,
    size,
  });

  clipboardObserver.start();

  tray.on("right-click", () => {
    const rightMenu = Menu.buildFromTemplate([
      {
        label: "退出",
        click: () => {
          store.set("clipboardData", clipboardData);
          app.quit();
        },
      },
    ]);
    tray.setContextMenu(rightMenu);
  });

  tray.on("click", () => {
    const menu = [];
    for (let i = 0; i < size; i++) {
      if (clipboardData[i]) {
        let label = clipboardData[i];
        if (clipboardData[i].length > width) {
          label = clipboardData[i].slice(0, width) + "...";
        }

        menu.push({
          label: label,
          click: () => {
            clipboard.writeText(clipboardData[i]);
          },
        });
      }
    }
    const rightMenu = Menu.buildFromTemplate(menu);
    tray.popUpContextMenu(rightMenu);
  });
};

module.exports = createTray;
