import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import { createServer } from "http";
import { SlotMachine } from "./SlotMachine.js";

const slotMachine = new SlotMachine(50000, "USD");

const app = express();

const server = createServer(app);

const port = 3000;

const wss = new WebSocketServer({
  server: server,
});

wss.on("connection", (ws: WebSocket) => {
  //connection is up, let's add a simple simple event
  ws.on("message", (message: string) => {
    //log the received message and send it back to the client

    //console.log('received: %s', message, '... trying to convert to json');

    let jsonMessage;
    try {
      jsonMessage = JSON.parse(message);
    } catch (error) {
      const errorMessage = `Unable to convert ${message} to JSON`;
      console.error(errorMessage);
      ws.send(errorMessage);
    }

    if (
      jsonMessage &&
      jsonMessage["idRequest"] &&
      jsonMessage["action"] &&
      jsonMessage["user"] &&
      jsonMessage["stake"]
    ) {
      let action = String(jsonMessage["action"]).toLowerCase();
      let idRequest = jsonMessage["idRequest"];

      let result;
      switch (action) {
        case "init":
          result = slotMachine.initSymbols(idRequest);
          ws.send(JSON.stringify(result));
          break;
        case "spin":
          const stake: number = jsonMessage["stake"];
          result = slotMachine.spin(stake, idRequest);
          ws.send(JSON.stringify(result));
          break;
        case "strips":
          result = slotMachine.stripsArray(idRequest);
          ws.send(JSON.stringify(result));
          break;
        case "symbols":
          result = slotMachine.symbolsDescription(idRequest);
          ws.send(JSON.stringify(result));
          break;
        case "balance":
          result = slotMachine.getMoneyBalance(idRequest);
          ws.send(JSON.stringify(result));
          break;
        case "paylines":
          result = slotMachine.getPaylines(idRequest);
          ws.send(JSON.stringify(result));
          break;
        case "cheat":
          const stakeCheat: number = jsonMessage["stake"];
          const idCheat: number = jsonMessage["idCheat"];
          result = slotMachine.spin(stakeCheat, idRequest, idCheat);
          ws.send(JSON.stringify(result));
          break;
        default:
          const error = `Action '${action}' not recognized`;
          console.error(error);
          ws.send(error);
          break;
      }
    } else {
      const error = `Unable to process request for the data: ${message}`;
      console.error(error);
      ws.send(error);
    }

    //console.log('received: %s', jsonMessage);
    //ws.send(`Hello, you sent -> ${jsonMessage}`);
  });

  //send immediatly a feedback to the incoming connection
  ws.send("Hi there, I am a WebSocket server");
});

//start our server
server.listen(port, () => {
  console.log(`Server started on port ${port} :)`);
});
