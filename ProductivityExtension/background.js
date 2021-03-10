chrome.tabs.onCreated.addListener((tab) => {
    console.log("Something HAppened!!!");
})


chrome.tabGroups.onCreated.addListener((group) => {
    console.log("Group Created!")
});

