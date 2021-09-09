document.addEventListener("DOMContentLoaded", () => {
    main();
});

function cleanURL(url){
    domain = url.split("//")[1];
    if(domain.includes("www.")){
        domain = domain.split("www.")[1];
    }
    return domain;
}

function toggleAccordian(container){
    console.log("Its toggle time baby");
        element = container.querySelector(".tab-container");
        if(element.classList.contains("closed")){
            element.classList.remove("closed");
            element.classList.add("open");
        }else{
            element.classList.remove("open");
            element.classList.add("closed");
        }

}

function deleteGroup(groupId, groupElement){
    chrome.storage.sync.remove(groupId);
    groupElement.remove();
}

function createTabs(groupId, groupData){
    tabsToOpen = groupData["tabs"];
    chrome.tabs.create({ url: tabsToOpen[0] + "/", active: false }, (firstTab) => {
        chrome.tabs.group({ tabIds: firstTab.id }, (groupId) => {
            for (let i = 1; i < tabsToOpen.length; i++){
                let newURL = tabsToOpen[i] + "/";
                chrome.tabs.create({ url: newURL, active: false }, (newTab) => {
                    console.log(groupId);
                    chrome.tabs.group({ tabIds: newTab.id, groupId: groupId }, (groupId) => {
                        chrome.tabGroups.update(groupId, { title: groupData.title, color: groupData.color });
                    });
                });
            };
        });
    });
}

function main(){
    document.querySelector("#reset-button").addEventListener('click', () => {
        console.log("Clicked");
        chrome.storage.sync.clear();
    });

    groupDiv = document.querySelector("#group-container");

    chrome.storage.sync.get(null, (result) => {
        for(var obj in result){
            console.log(obj);
            if(obj !== "allTabs"){
                console.log("Putting in the work");
                let group = document.createElement("div");
                group.class = "group-div";
                group.id = "group-" + obj;
                
                innerElements = `
                <details class="group-details">
                    <summary>
                    <div class="group-header">
                    <p>${result[obj].title}</p>
                    <button class="invis-button open-group"><img class="button-image"src="https://img.icons8.com/ios/50/000000/open-in-popup.png"/></button>
                    <button class="invis-button delete"><img class="button-image" src="delete.png"></button>
                    </div>
                    </summary>
                    <ul>`;
                    
                    tabs = result[obj].tabs;
                    for(tab in tabs){
                        innerElements +=
                        `<li>
                            <div class="tab-logo-container"></div>
                            <p>${cleanURL(tabs[tab])}</p>
                        </li>`;
                    }
    
                    innerElements += "</ul></details>"

                group.innerHTML = innerElements;

                groupDiv.appendChild(group);

                let data = result[obj];
                const groupId = obj;
                const groupElement = group;

                group.querySelector(".open-group").addEventListener('click', (e) => {
                    
                    createTabs(groupId, data);
                });

                group.querySelector(".delete").addEventListener('click', (e) => {
                    deleteGroup(groupId, groupElement);
                });


            }
        }
    })
}