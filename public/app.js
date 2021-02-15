(function() {
  // const DOMAIN = "http://localhost:8080/";
  const DOMAIN = "https://p-url.herokuapp.com/";
  const URL = DOMAIN + "url";
  const GETSAVED = DOMAIN + "saved";
  const INPUTNODE = document.getElementById("url");
  const URLLISTNODE = document.getElementById("savedurl-list");
  const MAX_URL_LENGTH = 45;

  // saveNewUrl
  // inputs: hash, the shortened url, string
  //         url, the original url (the first 50 characters), string
  // creates and returns a list element (li)
  // containing the original (url) and hashed url (hash)
  // ie: <li class="savedurl-container">
  //         <p class="savedurl-item">{url}</p>
  //         <a class="savedurl-item" href={hash}>{hash}</a>
  //         <div class="savedurl-item">
  //              <button id={hash} class="copy-button">Copy</button>
  //         </div>
  //     </li>
  function saveNewUrl(hash, url) {
    let savedUrlContainer = document.createElement("li");
    savedUrlContainer.classList.add("savedurl-container",
      "list-group-item", "d-flex", "justify-content-between", "align-items-center", "col-12");

    let urlText = document.createElement("p");
    // only the first 50 characters
    urlText.textContent =
      url.length > MAX_URL_LENGTH ? url.substr(0, MAX_URL_LENGTH) + "..." : url;
    urlText.id = url;
    urlText.classList.add("savedurl-item", "col-6");
    savedUrlContainer.appendChild(urlText);

    let urlLink = document.createElement("a");
    urlLink.textContent = hash;
    urlLink.href = hash;
    urlLink.classList.add("savedurl-item", "col-4", "overflow-auto");
    savedUrlContainer.appendChild(urlLink);

    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("savedurl-item", "col-2");

    // add a 'click' event listener to write hash to clipboard
    let copyButton = document.createElement("button");
    copyButton.textContent = "Copy";
    copyButton.id = hash;
    copyButton.classList.add("copy-button");
    copyButton.addEventListener("click", (event) => {
      // clipboard functionality
      navigator.clipboard.writeText(hash).then(
        function () {
          /* clipboard successfully set */
          console.log("success: wrote to clipboard");
        },
        function () {
          /* clipboard write failed */
          console.error("error: clipboard write failed");
        }
      );

      // setup timer to show "Copied!" 
      console.log(copyButton.id);
      toggleCopied(copyButton.id);
      setTimeout(function () {
      toggleCopied(copyButton.id);
      }, 3000);
    });
    buttonContainer.appendChild(copyButton);
    savedUrlContainer.appendChild(buttonContainer);

    return savedUrlContainer;
  }

  // get the current sessions's saved urls
  window.addEventListener("load", () => {
    // first clear the input
    document.getElementById("url").value = "";

    fetch(GETSAVED)
      .then(response => response.json())
      .then(res => {
        console.log(res);

        if (res.status !== 200) {
          return console.error("Error: ", jsonRes.status);
        }

        if (res.saved.length > 0) {
          res.saved.forEach((curr) => {
            // if a savedurl doesn't already exist, add it
            if (document.getElementById(curr.url) === null) {
              let savedurl = saveNewUrl(DOMAIN + "url/" + curr.hash, curr.url);
              console.log(savedurl);
              URLLISTNODE.appendChild(savedurl);
            }
          });
          // change container id from url-section-empty to url-section
          // for css
          if (document.getElementById("url-section-empty")) {
            document.getElementById("url-section-empty").id = "url-section";
          }
        }
  
      })
      .catch(error => console.error(error));
  });

  /**
   * handles submitting a url
   */
  document.addEventListener("submit", (event) => {
    // Prevent form from submitting to the server
    event.preventDefault();

    // valid url checking done by html
    const data = { url: INPUTNODE.value };
    console.log(data);

    // post the data using fetch api
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((res) => {
        console.log("Success:", res);

        // if url and hash are already saved, skip adding a new url element
        // look at div with id of {url}
        if (!document.getElementById(res.url)) {
          let savedUrlElement = saveNewUrl(DOMAIN + "url/" + res.hash, res.url);
          URLLISTNODE.appendChild(savedUrlElement);
        }

        // setup copyButton css
        // onclick adds css class for 1 second (1000 ms)
        let copyButton = document.getElementById(DOMAIN + "url/" + res.hash);
        copyButton.addEventListener("click", () => {
          copyButton.classList.add("show-copied");
          setTimeout(function () {
            copyButton.classList.remove("show-copied");
          }, 6000);
        });

        // change container id from url-section-empty to url-section
        // for css
        if (document.getElementById("url-section-empty")) {
          document.getElementById("url-section-empty").id = "url-section";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  /**
   * toggles the id's button textContent,
   * for use in a setTimer function for 3 seconds
   * @param {string} id - a button
   */
  const toggleCopied = (id) => {
    const elem = document.getElementById(id); 
    const currText = elem.textContent;

    if (currText === "Copy") {
      elem.textContent = "Done";
    } else if (currText === "Done") {
      elem.textContent = "Copy";
    }
  };

  console.log("app.js loaded!");
})();
