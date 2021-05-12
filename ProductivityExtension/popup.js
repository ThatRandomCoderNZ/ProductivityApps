document.addEventListener("DOMContentLoaded", () => {
    main();
})

function setData(data){
    chrome.storage.sync.set(data, () => {
        console.log("Set " + data);
    })
    
}

function updateGroups(keyName, groupName){
    chrome.storage.sync.get(keyName, (result) => {
        console.log(result.myGroups);
        data = result[keyName];
        data.push(groupName);
        console.log(result.myGroups);
        let dataObj = {}
        dataObj[keyName] = data;
        chrome.storage.sync.set( dataObj , () => {
            console.log("Set values: " + dataObj);
            createGroupLabel(groupName)
        })
    })
}

function removeGroup(keyName, groupName){
    chrome.storage.sync.get(keyName, (result) => {

        data = result[keyName];
        groupIndex = data.indexOf(groupName)
        data.splice(groupIndex, 1)

        let dataObj = {}
        dataObj[keyName] = data;
        chrome.storage.sync.set( dataObj , () => {
            console.log("Set values: " + dataObj);
        })
    })
}


function getData(keyName){
    var resultData = { }
    chrome.storage.sync.get(keyName, (result) => {
        resultData[keyName] = result;
        populateGroups(result);
    })
    
}

function resetStorage(){
    chrome.storage.sync.clear(() => {});
}

function main(){
    getData("myGroups");

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

function createGroupLabel(name){
    let parentNode = document.getElementById("group-container")
    let id = parentNode.childElementCount + 1;
    let groupLabel = document.createElement("div");
    groupLabel.id = "group-label-" + id;
    groupLabel.innerHTML = `
    <div style="display: block;">
        <button class="group-button"> ${name} </button>
        <button class="clearButton"> clear </button>
    </div>
    `;

    groupLabel.querySelector(".group-button").addEventListener('click', () => {
        handleGroupDetails(name, id)
    })

    groupLabel.querySelector(".clearButton").addEventListener('click', () => {
        parentNode.removeChild(groupLabel);
        removeGroup("myGroups", name)
    })



    let children = parentNode.children;
    let lastGroupNode = 0;
    for(let i = 0; i < children.length; i++){
        let childId = children[i].id;
        if(childId.match(/group-label/)){
            lastGroupNode = i;
        }
    }

    if(children.length > 0){
        lastGroupNode++;
    }

    parentNode.insertBefore(groupLabel, children[lastGroupNode]);
}

function handleGroupDetails(groupName, groupId){
    const focusThreshold = 1

    groupNode = document.querySelector("#group-label-" + groupId);
    groupElemChildren = groupNode.children;

    if(groupElemChildren.length > focusThreshold){
        hideGroupDetails(groupName, groupId);
    }else{
        showGroupDetails(groupName, groupId);
    }
}

function hideGroupDetails(groupName, groupId){
    let groupNode = document.querySelector("#group-label-" + groupId);
    console.log(groupNode.children)
    let details = groupNode.querySelector("#website-details-" + groupId);
    groupNode.removeChild(details);
}

function addWebsite(groupName, node){
   
}

function showGroupDetails(groupName, groupId){
    groupNode = document.querySelector("#group-label-" + groupId);

    websiteNode = document.createElement("div");
    websiteNode.id = "website-details-" + groupId;
    websiteNode.class = "website-details";

    chrome.storage.sync.get(groupName, (result) => {
        resultData[keyName] = result;
        for(let i = 0; i < resultData.length; i++){
            websiteLabel = document.createElement("div");
            websiteLabel.class = "website-label";
            websiteLabel.id = "website-group-" + groupId + "-label-" + i
            websiteLabel.innerHTML = `
            <p>${resultData[i]}</p>
            `;
            websiteNode.appendChild(websiteLabel);
        }
    })

    let entryField = document.createElement("div");
    entryField.id = "website-entry-" + groupId;
    entryField.innerHTML = `
        <input type="text" id="input-${groupId}" class="website-text-input">
        <button class="save"> Save </button> 
        <button class="cancel"> Cancel </button>
    `;
    websiteNode.appendChild(entryField);

    entryField.querySelector('.save').addEventListener('click', () => {
        let websiteEntryField = document.querySelector("#input-" + groupId).value;
        addWebsite(groupName, websiteEntryField.value)
    });

    entryField.querySelector('.cancel').addEventListener('click', () => {
        hideGroupDetails(groupName, groupId);
    })
    entryField.querySelector('#input-' + groupId).addEventListener('keyup', () => {
        let websiteEntryField = document.querySelector("#input-" + groupId).value;
        addWebsite(groupName, websiteEntryField.value)
    })

    groupNode.appendChild(websiteNode)





}

async function populateGroups(groupData){
    console.log(JSON.stringify(groupData));
    var groupNames = groupData.myGroups;
    for(let i = 0; i < groupNames.length; i++){
        createGroupLabel(groupNames[i]);
    }

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
        let groupName = document.querySelector(".group-text-input").value;
        document.querySelector(".group-text-input").value = "";
        let output = document.querySelector("#output");
        output.textContent = groupName;
        updateGroups("myGroups", groupName);
        console.log("We made it here!");
        
    }
}

function cancelGroup(){
    document.querySelector("#group-container").removeChild(document.querySelector("#group-entry-field"));
}


