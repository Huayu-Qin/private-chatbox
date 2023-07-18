let limitTime = 1 * 60 * 1000;
let maxRequest = 2;
let requestPreventMessage = `Too many requests from this IP, please try again after ${
  limitTime / 60 / 1000
} minutes`;

export function setLimitTime(setLimitTime) {
  limitTime = setLimitTime;
  return limitTime;
}

export function getLimitTime() {
  return limitTime;
}

export function setMaxRequest(setMaxRequest) {
  maxRequest = setMaxRequest;
  return maxRequest;
}

export function getMaxRequest() {
  return maxRequest;
}


export function setRequestPreventMessage(setRequestPreventMessage) {
  requestPreventMessage = setRequestPreventMessage;
  return requestPreventMessage;
}

export function getRequestPreventMessage() {
  return requestPreventMessage;
}
