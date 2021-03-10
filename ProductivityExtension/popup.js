document.addEventListener("DOMContentLoaded", async () => {



    const actionButton = document.getElementById("call-to-action");
    const text = document.getElementById("test-text");
    actionButton.addEventListener('click', async () => {

        let tabsToOpen = ["youtube.com", "facebook.com", "twitter.com"];
        
        chrome.tabs.create({ url: "http://" + tabsToOpen[0] + "/", active: false }, (firstTab) => {
            chrome.tabs.group({ tabIds: firstTab.id }, (groupId) => {
                for (let i = 1; i < tabsToOpen.length; i++){
                    let newURL = "http://" + tabsToOpen[i] + "/";
                    chrome.tabs.create({ url: newURL, active: false }, (newTab) => {
                        console.log(groupId);
                        chrome.tabs.group({ tabIds: newTab.id, groupId: groupId })
                        
                    });
                }
            });
            
        });

        console.log(createdTabIds.pop());
        console.log([1 , 2, 3]);

        
        

        text.textContent = "Opened Tabs!";
    })
})



async function createTabs(tabsToOpen){
    let createdTabIds = []
    for (let i in tabsToOpen){
        let newURL = "http://" + tabsToOpen[i] + "/";
        chrome.tabs.create({ url: newURL, active: false }, (newTab) => {
            createdTabIds.push(Number(newTab.id));
            if (i == tabsToOpen.length - 1){
                return createdTabIds;
            }
        });
    }

}