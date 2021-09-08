
/**
 * General outline
 * when a new group is created catalog it and add it to 
 * 
 * 
 * 
 */


function saveGroup(group){
  console.log("We are saving a new group");
  chrome.storage.sync.get((group.id).toString(), (result) => {
    tabList = (result[group.id] == null) ? []:result[group.id].tabs;
    storageObject = {};
    storageObject[(group.id).toString()] = {
      "title": group.title,
      color: group.color,
      tabs: tabList
    }
    chrome.storage.sync.set(storageObject, (result) => {
      chrome.storage.sync.get((group.id).toString(), (result) => {
        console.log(result);
      });
      chrome.storage.sync.get("allTabs", (result) => {
        console.log(result);
      })
    });
  })


}

function saveGroupedTab(tab){

}

function updateTabList(tabList){
  storageObject = {};
  storageObject["allTabs"] = tabList;
  chrome.storage.sync.set(storageObject);
}

function removeTabFromGroup(tab, groupId){
  chrome.storage.sync.get((groupId).toString(), (result) => {
    tabList = result[groupId].tabs;
    newTabList = tabList.filter((tabVal) => tabVal !== tab.url);

    storageObject = {}
    storageObject[(groupId).toString()] = {
      tabs: newTabList,
      title: result[groupId].title,
      color: result[groupId].color
    }
    chrome.storage.sync.set(storageObject, (result) => {
      chrome.storage.sync.get((groupId).toString(), (result) => {
        console.log(result);
      });
    });
  });
}

function addTabToGroup(tab){
  chrome.storage.sync.get((tab.groupId).toString(), (result) => {
    tabList = [];
    if(result[tab.groupId].hasOwnProperty("tabs")){
      tabList = result[tab.groupId].tabs;
    }
    tabList.push(tab.url);
    console.log(tabList);
    storageObject = {};
    storageObject[(tab.groupId).toString()] = {
      tabs: tabList,
      title: result[tab.groupId].title,
      color: result[tab.groupId].color
    };
    chrome.storage.sync.set(storageObject, (result) => {
      chrome.storage.sync.get((tab.groupId).toString(), (result) => {
        console.log(result);
      });
    });

  });
}


function handleTabUpdate(tab){
  console.log("Handling tab updates");
  if(tab.groupId > -1){
    duplicated = false;
    chrome.storage.sync.get("allTabs", (result) => {
      tabList = result["allTabs"];
      if(tabList != null){
        for(i = tabList.length - 1; i >= 0; i--){
          tabId = Object.keys(tabList[i])[0];
          if(tabId == tab.id){
            if(tab.groupId != tabList[i][tabId]){
              removeTabFromGroup(tab, tabList[i][tabId]);
              tabList.splice(i, 1);
            }else{
              duplicated = true;
            }
          }
        }
      }else{
        tabList = [];
      }
      if(!duplicated){
        addTabToGroup(tab);
        tabObject = {};
        tabObject[tab.id] = tab.groupId;
        tabList.push(tabObject);
        updateTabList(tabList);
      }
    });
  }else{
    console.log("looking to remove a tab")
    chrome.storage.sync.get("allTabs", (result) => {
      tabList = result["allTabs"];
      if(tabList != null){
        for(i = tabList.length - 1; i >= 0; i--){
          tabId = Object.keys(tabList[i])[0];
          if(tabId == tab.id){
            console.log("removing tabs neow")
            removeTabFromGroup(tab, tabList[i][tabId]);
            tabList.splice(i, 1);
            updateTabList(tabList);
          }
        }
      }
    })
  }
}

chrome.runtime.onStartup.addListener(() => {
  console.log("initialisation initialised");
  chrome.storage.sync.clear();
});


chrome.tabGroups.onCreated.addListener(saveGroup);

chrome.tabGroups.onUpdated.addListener(saveGroup);


chrome.tabs.onCreated.addListener(handleTabUpdate);



chrome.tabs.onMoved.addListener( (tabId, moveInfo) => {
  chrome.tabs.get(tabId, (tab) => {
    handleTabUpdate(tab);
  })

});