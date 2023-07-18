import { gameConfig } from "../config/GameConfig.ts";
import {
  RequestInfo,
  RequestStatus,
  RequestType,
  RequestValues,
} from "./RequestInfo.ts";

export class GameSocketClient extends WebSocket {
  private static _instance: GameSocketClient;

  private readonly pendingRequests = new Map<number, RequestInfo>();
  constructor() {
    const url = `ws://${gameConfig.wsUrl}:${gameConfig.wsPort}/`;

    super(url);
    this.loadListeners();
  }

  private loadListeners = () => {
    // Connection opened
    super.addEventListener("open", (event) => {
      console.log("WebSocket connection established.", event);

      // Sending data to the server
      //socket.send('Hello Server!');
    });

    // Listen for messages from the server
    super.addEventListener("message", (event) => {
      //console.log("Message from server:", event.data);

      try {
        const jsonData = JSON.parse(event.data);

        const request = this.pendingRequests.get(Number(jsonData["idRequest"]));

        if (request) {
          request.requestStatus = RequestStatus.resolved;
          request.data = jsonData;
          if (request.event) {
            request.event(jsonData);
          }

          console.log(
            "Request ID:",
            request.idRequest,
            "resolved. Data:",
            jsonData
          );
        }
      } catch (e) {
        console.log("Unable to convert to JSON. Data received:", event.data, e);
        //console.error(e);
      }
    });

    // Handle errors
    super.addEventListener("error", (event) => {
      console.error("WebSocket error:", event);
    });

    // Connection closed
    super.addEventListener("close", (event) => {
      console.log("WebSocket connection closed.", event);
    });
  };

  private waitForOpenConnection = () => {
    return new Promise((resolve, reject) => {
      const maxNumberOfAttempts = 10;
      const intervalTime = 200; //ms

      let currentAttempt = 0;
      const interval = setInterval(() => {
        if (currentAttempt > maxNumberOfAttempts - 1) {
          clearInterval(interval);
          reject(new Error("Maximum number of attempts exceeded"));
        } else if (this.readyState === this.OPEN) {
          clearInterval(interval);
          resolve("Connection Opened");
        }
        currentAttempt++;
      }, intervalTime);
    });
  };

  private sendMessage = async (data: string) => {
    if (this.readyState !== this.OPEN) {
      try {
        await this.waitForOpenConnection();
        this.send(data);
      } catch (err) {
        console.error(err);
      }
    } else {
      this.send(data);
    }
  };

  private addRequestToTrackingMap = (
    idRequest: number,
    requestType: RequestType,
    event: ((data: any) => void) | undefined
  ) => {
    const request: RequestInfo = {
      idRequest: idRequest,
      requestType: requestType,
      requestStatus: RequestStatus.pending,
      data: undefined,
      event: event,
    };

    this.pendingRequests.set(idRequest, request);
  };

  private removeRequestToTrackingMap = (idRequest: number) => {
    this.pendingRequests.delete(idRequest);
  };

  getRequestData = (idRequest: number) => {
    const request = this.pendingRequests.get(idRequest);

    let data;

    if (request && request.requestStatus == RequestStatus.resolved) {
      data = request.data;
      this.removeRequestToTrackingMap(idRequest);
    }

    return data;
  };

  initPositions = (event: ((data: any) => void) | undefined) => {
    const idRequest = this.generateIdRequest();
    const query: RequestValues = {
      idRequest: idRequest,
      action: "init",
      user: "guest",
      stake: 1,
      idCheat: undefined,
    };
    this.sendMessage(JSON.stringify(query));

    this.addRequestToTrackingMap(idRequest, RequestType.init, event);

    return idRequest;
  };

  balance = (event: ((data: any) => void) | undefined) => {
    const idRequest = this.generateIdRequest();
    const query: RequestValues = {
      idRequest: idRequest,
      action: "balance",
      user: "guest",
      stake: 1,
      idCheat: undefined,
    };
    this.sendMessage(JSON.stringify(query));

    this.addRequestToTrackingMap(idRequest, RequestType.balance, event);

    return idRequest;
  };

  spin = (stake: number, event: ((data: any) => void) | undefined) => {
    const idRequest = this.generateIdRequest();
    const query: RequestValues = {
      idRequest: idRequest,
      action: "spin",
      user: "guest",
      stake: stake,
      idCheat: undefined,
    };
    this.sendMessage(JSON.stringify(query));

    this.addRequestToTrackingMap(idRequest, RequestType.spin, event);

    return idRequest;
  };

  cheat = (
    stake: number,
    idCheat: number,
    event: ((data: any) => void) | undefined
  ) => {
    const idRequest = this.generateIdRequest();
    const query: RequestValues = {
      idRequest: idRequest,
      action: "cheat",
      user: "guest",
      stake: stake,
      idCheat: idCheat,
    };
    this.sendMessage(JSON.stringify(query));

    this.addRequestToTrackingMap(idRequest, RequestType.cheat, event);

    return idRequest;
  };

  symbols = (event: ((data: any) => void) | undefined) => {
    const stake = 1;
    const idRequest = this.generateIdRequest();
    const query: RequestValues = {
      idRequest: idRequest,
      action: "symbols",
      user: "guest",
      stake: stake,
      idCheat: undefined,
    };
    this.sendMessage(JSON.stringify(query));

    this.addRequestToTrackingMap(idRequest, RequestType.symbols, event);

    return idRequest;
  };

  strips = (event: ((data: any) => void) | undefined) => {
    const stake = 1;
    const idRequest = this.generateIdRequest();
    const query: RequestValues = {
      idRequest: idRequest,
      action: "strips",
      user: "guest",
      stake: stake,
      idCheat: undefined,
    };
    this.sendMessage(JSON.stringify(query));

    this.addRequestToTrackingMap(idRequest, RequestType.strips, event);

    return idRequest;
  };

  private generateIdRequest = () => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0];
  };

  static get instance(): GameSocketClient {
    if (!this._instance) {
      this._instance = new GameSocketClient();
    }

    return this._instance;
  }
}
