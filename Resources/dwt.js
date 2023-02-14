let modal;
let DWObject;

window.onload = function () {
  const resourcesURL = document.getElementById("dwt").getAttribute("resourcesURL");
  Dynamsoft.DWT.ResourcesPath = resourcesURL;
  addButton(resourcesURL);
}

function addButton(resourcesURL){
  const button = document.createElement("div");
  button.className = "dwt-fab";
  const a = document.createElement("a")
  a.href = "javascript:void(0)";
  const icon = document.createElement("img")
  icon.src = resourcesURL+"/scanner-scan.svg";
  a.appendChild(icon);
  button.appendChild(a);
  document.body.appendChild(button);
  button.addEventListener("click", () => {
    showModal();
  });
}

function showModal(){
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "dwt-modal";
    document.body.appendChild(modal);
    const header = document.createElement("div");
    const closeBtn = document.createElement("div");
    closeBtn.className = "dwt-close-btn";
    closeBtn.innerText = "x";
    header.appendChild(closeBtn);
    header.className = "dwt-header";
    closeBtn.addEventListener("click", () => {
      hideModal();
    });
    const body = document.createElement("div");
    body.className = "dwt-body";
    const viewer = document.createElement("div");
    viewer.id = "dwtcontrolContainer";
    const controls = document.createElement("div");
    controls.className = "dwt-controls";
    const scanBtn = document.createElement("button");
    scanBtn.innerText = "Scan";
    scanBtn.addEventListener("click", () => {
      scan();
    });
    
    const copyBtn = document.createElement("button");
    copyBtn.innerText = "Copy selected";
    copyBtn.addEventListener("click", () => {
      copy();
    });

    const saveBtn = document.createElement("button");
    saveBtn.innerText = "Save";
    saveBtn.addEventListener("click", () => {
      save();
    });

    const status = document.createElement("div");
    status.className="dwt-status";

    controls.appendChild(scanBtn);
    controls.appendChild(copyBtn);
    controls.appendChild(saveBtn);
    controls.appendChild(status);

    body.appendChild(viewer);
    body.appendChild(controls);
    modal.appendChild(header);
    modal.appendChild(body);
    if (!DWObject) {
      initDWT();
    }
  }
  document.querySelector(".dwt-fab").style.display = "none";
  modal.style.display = "";
}

function hideModal(){
  modal.style.display = "none";
  document.querySelector(".dwt-fab").style.display = "";
}

function scan(){
  if (DWObject) {
    if (Dynamsoft.Lib.env.bMobile) {
      DWObject.Addon.Camera.scanDocument();
    }else {
      DWObject.SelectSource(function () {
        DWObject.OpenSource();
        DWObject.AcquireImage();
      },
        function () {
          console.log("SelectSource failed!");
        }
      );
    }
  }
}

function copy(){
  if (DWObject) {
    if (Dynamsoft.Lib.env.bMobile) {
      DWObject.ConvertToBlob(
        [DWObject.CurrentImageIndexInBuffer],
        Dynamsoft.DWT.EnumDWT_ImageType.IT_PNG,
        function(result) {
          CopyBlobToClipboard(result);
        },
        function(errorCode,errorString) {
          console.log("convert failed");
          console.log(errorString);
          alert("Failed");
        });
    }else{
      DWObject.CopyToClipboard(DWObject.CurrentImageIndexInBuffer);
      alert("Copied");
    }
  }
}

function CopyBlobToClipboard(blob) {
  var data = [new ClipboardItem({ "image/png": blob})];
  navigator.clipboard.write(data).then(function() {
    alert("Copied");
  }, function() {
    alert("Failed");
  });
}

function save(){
  if (DWObject) {
    DWObject.SaveAllAsPDF("Scanned");
  }
}

function initDWT(){
  console.log("initDWT");
  const status = document.querySelector(".dwt-status");
  Dynamsoft.DWT.Containers = [{ ContainerId: 'dwtcontrolContainer',Width: 270, Height: 350 }];
  Dynamsoft.DWT.RegisterEvent('OnWebTwainReady', function () {
    console.log("ready");
    status.innerText = "";
    DWObject = Dynamsoft.DWT.GetWebTwain('dwtcontrolContainer');
    DWObject.Viewer.width = "100%";
    DWObject.Viewer.height = "100%";
    DWObject.SetViewMode(2,2);
  });
  status.innerText = "Loading...";
  Dynamsoft.DWT.Load();
}