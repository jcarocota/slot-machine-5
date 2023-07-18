export enum RequestStatus {
  pending,
  resolved,
  error,
}

export enum RequestType {
  init,
  balance,
  spin,
  strips,
  symbols,
  cheat,
}

export interface RequestValues {
  idRequest: number;
  action: string;
  user: string;
  stake: number;
  idCheat: number | undefined;
}

export interface RequestInfo {
  idRequest: number;
  requestType: RequestType;
  requestStatus: RequestStatus;
  data: any;
  event: ((data: any) => void) | undefined;
}

export interface balanceResponse {
  idRequest: number;
  moneyBalance: number;
}
