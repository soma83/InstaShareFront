function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON);
}

function buildBasicHeaders(extraparams) {
  return {
    headers: Object.assign({}, {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }, extraparams)
  };
}

export function buildParams(params = '') {
  return params.length ? `?${new URLSearchParams(params).toString()}` : '';
}

export function accessData(url, callback, headers = {}, method = 'GET', body={}) {
  const data = { method };
  if (Object.keys(body).length) {
    data.body = JSON.stringify(body);
  }
  request(url, Object.assign({}, buildBasicHeaders(headers), data))
    .then(response => {
      const objToReturn = { response };
      callback(objToReturn);
    })
    .catch(error => {
      if (error.response) {
        error.response
          .json()
          .then(json => {
            callback({ error: json });
          });
      } else {
        const obj = { ...error };
        if (!obj.error) {
          obj.error = {};
        }
        if (!obj.error.message) {
          obj.error.message = error.toString();
        }
        callback(obj);
      }
    });
}
