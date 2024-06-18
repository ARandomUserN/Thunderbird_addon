// // // The user clicked our button, get the active tab in the current window using
// // // the tabs API.

let tabs = await messenger.tabs.query({ active: true, currentWindow: true });

// // // Get the message currently displayed in the active tab, using the
// // // messageDisplay API. Note: This needs the messagesRead permission.
// // // The returned message is a MessageHeader object with the most relevant
// // // information.
let message = await messenger.messageDisplay.getDisplayedMessage(tabs[0].id);


// // // Update the HTML fields with the message subject and sender.
// // document.getElementById("subject").textContent = message.subject;
// // document.getElementById("from").textContent = message.author;

// // // Request the full message to access its full set of headers.
let full = await messenger.messages.getFull(message.id);

// console.log(res)

function getWebLinks(message)
{
    if(!message)
        return ['b']
    // console.log(message)
    //TODO regex improvements
    const regexp = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&=/]*)/g
    let Links = [...message.matchAll(regexp)]
    return Links.map(function(value,index) { return value[0]; });
}
/*
On startup, connect to the "ping_pong" app.
*/
var port = browser.runtime.connectNative("ping_pong");

//TODO 
// Try catch for multilayered messages
let res = getWebLinks(full.parts[0].body.toString())
//
console.log(res)
console.log(res.length)

/*
Listen for messages from the app.
*/
port.onMessage.addListener((response) => {
  console.log("Received: " + response);
  response = response.split(",");
  console.log( response);
  var htmlList = "";
  var flavorText = "";
  for(var i = 0; i<response.length-1;i++)
    {
      flavorText = res[i]
      if(response[i]==1){
        flavorText += ": <font color='green'>bezpieczny</font>"
      }
      else if(response[i]==0){
        flavorText += ": <font color='orange'>podejrzany</font>"
      }
      else{
        flavorText += ": <font color='red'>niebezpieczny</font>"
      }
      htmlList += "<li>"+  flavorText +"</li>";
    }
  document.getElementById("links").innerHTML = htmlList
});


// get all links from message body

/*
On a click on the browser action, send the app a message.
*/
if(res.length>0){
  console.log("Sending: " + res.toString());
  port.postMessage(res.toString());
}
else{
  document.getElementById("links").innerHTML = "<li>Brak linków w wiadomości</li>"
}


