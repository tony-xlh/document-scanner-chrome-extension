document.getElementById("scan").addEventListener("click", () => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {message: "scan"}, function(response) {
		  console.log(response);
      window.close();
	  });
	});
});