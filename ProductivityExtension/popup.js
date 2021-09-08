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

function main(){
    document.querySelector("#reset-button").addEventListener('click', () => {
        console.log("Clicked");
        chrome.storage.sync.clear();
    });

    groupDiv = document.querySelector("#group-container");

    chrome.storage.sync.get(null, (result) => {
        for(var obj in result){
            if(obj != "allTabs"){
                let group = document.createElement("div");
                group.class = "group-div";
                group.id = "group-" + obj;
                
                innerElements = `
                <p>${result[obj].title}</p>
                <button class="show">Show/Hide</button>
                <button class="cancel"> Delete </button>
                <div class="tab-container closed">
                <ul>`;
                
                tabs = result[obj].tabs;
                for(tab in tabs){
                    innerElements +=`<li>
                                        <div class="tab-logo-container"></div>
                                        <p>${cleanURL(tabs[tab])}</p>
                                     </li>`;
                }

                innerElements += "</ul></div>"
                group.innerHTML = innerElements;

                groupDiv.appendChild(group);

                group.querySelector(".show").addEventListener('click', (e) => {
                    toggleAccordian(group);
                });
            }
        }
    })
}