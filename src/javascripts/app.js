import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../stylesheets/style.scss";

(function () {
  const DOMAIN = process.env.DOMAIN || "https://localhost:8080/";
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
    savedUrlContainer.classList.add(
      "savedurl-container",
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "col-12"
    );

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
      .then((response) => response.json())
      .then((res) => {
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
      .catch((error) => console.error(error));
  });

  /**
   * handles submitting a url
   */
  document.addEventListener("submit", (event) => {
    // Prevent form from submitting to the server
    event.preventDefault();

    // validate input as url, domain is optional
    let isUrl = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    
    let input = INPUTNODE.value;
    let data = {};
    if ( isUrl.test(input) ) {
      let hasHttp = /(https?:\/\/)/ig;
      let hasWWW = /w{3}/ig;
      // make into valid url, add https:// and/or www.
      if ( input.match(/^w{3}/gi) ) {
        input = `https://${input}`;
      } else if ( !hasHttp.test(input) && !hasWWW.test(input) ) {
        input = `https://www.${input}`;
      }
      data = { url: input };
    } else {
      throw new Error("Input is not a valid url.");
    }
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

  console.log("main.js loaded!");
})();
