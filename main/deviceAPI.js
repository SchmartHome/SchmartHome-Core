// Default
EVENTNAMES = {
  WHO_ARE_YOU: "whoareyou",
  I_AM: "iam"
};

/*

{
  "name": "Lampe",
  "features": [
    {
      "type": "Actuator"
      "name": "Lampe an.",
      "eventname": "LampOn",
      "args": []
    },
    {
      "type": "get"
      "name": "Get State",
      "eventname": "getLampState",
      "args": []
    }
  ]
}


 */


// Imports
const events = require("events");
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.clients

wss.on('connection', function connection(ws) {

  ws.device = {
    id: null,
    name: null,
    features: []
  }

  ws.on('message', function incoming(messageRaw) {
    
    var message = null;
    try {
      message = JSON.parse(messageRaw);
    } catch(err) {
      return;
    } finally {
      if(typeof message.event == "undefined") return;
      if(typeof message.data == "undefined") return;

      switch(message.event) {
        case EVENTNAMES.I_AM:
          ws.name = data.name;
          break;
      }
    }
  });

  ws.send(JSON.stringify({event: EVENTNAMES.WHO_ARE_YOU, data: null}));
});



module.exports;