document.addEventListener("DOMContentLoaded", () => {
    main();
})

function main(){
    chrome.storage.sync.set({key: ["youtube.com", "facebook.com", "twitter.com"]}, function() {
        console.log('Value is set to ');
    });

    let resultText = "";
    chrome.storage.sync.get(['key'], function(result) {
        console.log('Value currently is ' + result.key);
            resultText = result.key;
    });

    const newFolderButton = document.getElementById("new-group-button");
    newFolderButton.addEventListener('click', () => {
        if(!document.querySelector("#group-entry-field")){
            createEntryField();
    }});
    

    let tabsToOpen = ["youtube.com", "facebook.com", "twitter.com"];
    const actionButton = document.getElementById("call-to-action");
    const text = document.getElementById("test-text");

    actionButton.addEventListener('click', () => {
        createTabs(tabsToOpen);
    })
}


function createTabs(tabsToOpen){
    chrome.tabs.create({ url: "http://" + tabsToOpen[0] + "/", active: false }, (firstTab) => {
        chrome.tabs.group({ tabIds: firstTab.id }, (groupId) => {
            for (let i = 1; i < tabsToOpen.length; i++){
                let newURL = "http://" + tabsToOpen[i] + "/";
                chrome.tabs.create({ url: newURL, active: false }, (newTab) => {
                    console.log(groupId);
                    chrome.tabs.group({ tabIds: newTab.id, groupId: groupId }, (groupId) => {
                        chrome.tabGroups.update(groupId, { title: "Entertainment" });
                    });
                });
            };
        });
    });
}


function createEntryField(){
    let entryField = document.createElement("div");
    entryField.id = "group-entry-field";
    entryField.innerHTML = `
        <input type="text" id="input" class="group-text-input">
        <button class="save"> Save </button> 
        <button class="cancel"> Cancel </button>
    `;
    document.getElementById("group-container").appendChild(entryField);

    document.querySelector('.save').addEventListener('click', addGroup)
    document.querySelector('.cancel').addEventListener('click', cancelGroup)
    document.querySelector('.group-text-input').addEventListener('keyup', addGroup)
}


function addGroup(e){
    if(e.key === 'Enter' || !e.key){
            let output = document.querySelector("#output");
            output.textContent = document.querySelector(".group-text-input").value;
            console.log("We made it here!");
    }

}

function cancelGroup(){
    document.querySelector("#group-container").removeChild(document.querySelector("#group-entry-field"));
}

