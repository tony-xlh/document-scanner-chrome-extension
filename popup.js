document.getElementById("scan").addEventListener("click", () => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {message: "scan"}, function(response) {
		  console.log(response);
      window.close();
	  });
	});
});

document.getElementById("dwtpage").addEventListener("click", () => {
  const newURL = "https://www.dynamsoft.com/web-twain/overview/";
  chrome.tabs.create({ url: newURL });
})