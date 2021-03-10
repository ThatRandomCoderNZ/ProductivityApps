document.addEventListener("DOMContentLoaded", () => {
    const actionButton = document.getElementById("call-to-action");
    const text = document.getElementById("test-text");
    actionButton.addEventListener('click', () => {

        let tabsToOpen = ["youtube.com", "facebook.com", "twitter.com"];

        for (let i in tabsToOpen){
            let newURL = "http://" + tabsToOpen[i] + "/";
            chrome.tabs.create({ url: newURL });
        }


        text.textContent = "Opened Tabs!";
    })
})