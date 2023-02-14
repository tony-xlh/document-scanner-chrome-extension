init();

async function init(){
  const resourcesURL = new URL(chrome.runtime.getURL("/Resources/"));
  console.log(resourcesURL);
  await loadLibrary(resourcesURL+"/dynamsoft.webtwain.initiate.js","text/javascript");
  await loadLibrary(resourcesURL+"/dynamsoft.webtwain.config.js","text/javascript");
  await loadLibrary(resourcesURL+"/addon/dynamsoft.webtwain.addon.camera.js","text/javascript");
  await loadLibrary(resourcesURL+"/addon/dynamsoft.webtwain.addon.pdf.js","text/javascript");
  await loadLibrary(resourcesURL+"/dwt.js","text/javascript","dwt","resourcesURL",resourcesURL);
}

function loadLibrary(src,type,id,dataName,dataValue){
  return new Promise(function (resolve, reject) {
    let scriptEle = document.createElement("script");
    scriptEle.setAttribute("type", type);
    scriptEle.setAttribute("src", src);
    console.log(id);
    console.log(dataName);
    console.log(dataValue);
    if (id) {
      scriptEle.id = id;
    }
    if (dataValue && dataName) {
      scriptEle.setAttribute(dataName, dataValue);
    }
    document.body.appendChild(scriptEle);
    scriptEle.addEventListener("load", () => {
      console.log(src+" loaded")
      resolve(true);
    });
    scriptEle.addEventListener("error", (ev) => {
      console.log("Error on loading "+src, ev);
      reject(ev);
    });
  });
}