interface IndexInfoResult{
  version: string;
  connectedDevices: number;  
}

interface GetTagResult {
  tag: string;
  errorMessage: string;
}

interface GetTagResponse {
  tag: string;
}

export interface IndexResult {
  success: boolean;
  errorMessage: string,
}

export async function GetIndex(timeout: number = 2000, portNumber: number = 37888) : Promise<IndexResult> {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout);

  try {
    const probe = await fetch(`http://localhost:${portNumber}/index.json`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'accept-type': 'application/json;charset=UTF-8'
      },
    });

    if (!probe.ok) {
      return {
        success: false,
        errorMessage: `Tag Assistant returned unexpected response ${probe.status}.`,
      }
    }

    const indexInfo = await probe.json() as IndexInfoResult;

    if(indexInfo.connectedDevices === 0){
      return {
        success: false,
        errorMessage: `No devices connected.`,
      }
    }

    return {
      success: true,
      errorMessage: ''
    }
  }
  catch (error) {
      var message = (error as Error).message;
      
      if (message.startsWith('NetworkError')) {
        message = `Connection failed. Is the Tag Assistant software installed and running?`
      }
      if (message.startsWith('The operation was aborted.')) {
          message = `Connection failed. Is the Tag Assistant software installed and running?`
      }
      if (message.startsWith('The user aborted a request.')) {
        message = `Connection failed. Is the Tag Assistant software installed and running?`
      }
      return {
        success: false,
        errorMessage: message,
      }
    }
}

export async function GetTag(timeout: number = 20000, portNumber: number = 37888): Promise<GetTagResult> {

  try {
    // Read tokens
    const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout + 1000);

    const getTokens = await fetch(`http://localhost:${portNumber}/v1/tag?wait=${timeout}`, {
    method: 'GET',
    headers: {
      'accept-type': 'application/json;charset=UTF-8'
    }});

    if (!getTokens.ok) {
      return {
        errorMessage: `Tag Assistant returned unexpected response ${getTokens.status}.`,
        tag: ""
      }
    }
    const getTagResponse = await getTokens.json() as GetTagResponse

    return {
      errorMessage: '',
      tag: getTagResponse.tag
    };
  }
  catch (error) {
    var message = (error as Error).message;

    if (message.startsWith('NetworkError')) {
      message = `${message} Is the Tag Assistant software installed and running?`
    }
    if (message.startsWith('The operation was aborted.')) {
        message = `Operation timed out. Is the Tag Assistant software installed and running?`
    }
    if (message.startsWith('The user aborted a request.')) {
      message = `Operation timed out. Is the Tag Assistant software installed and running?`
    }
    return {
      errorMessage: message,
      tag: ''
    }
  }
}