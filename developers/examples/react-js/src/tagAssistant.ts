interface IndexInfoResult {
  version: string;
  connectedDevices: number;
}

interface ConnectionResult {
  /** True if Tag Assistant return a result within the specified timeout. Other false if request timesout
   * or some other error occured.
   *  False if TagAssistant was not detected or no devices were connected.*/
  success: boolean;

  /** An error number indicating the reason why the probe failed. If success is true, this will be -1.
  * Error codes:
  *  0 = Unknown. An unknwon or unexpected error has occured. See message for details.
  *  1 = AbortError. Occurs if Tag Assistant is not installed nor running on user's device.
  *  2 = TypeError. Occurs if Tag Assistant is installed and running but requests was blocked due to CORS configuration.
  *  3 = No Tag Presented was presented during the wait window.
  */
  errorCode: number,

  /** Additional informational message for logging purposes */
  errorMessage: string
}

export interface ReadTagResult extends ConnectionResult {
  /** The Tag unique identifier. Will be empty if no tag was read within timeout period, or if an 
   * error occured.
   */
  tag: string;
}

interface GetTagResponse {
  tag: string;
}

export interface ProbeResult extends ConnectionResult {
  /** The installed version of Tag Assistant. This can be compared with known minimal supported version 
   * and provide user feedback if the version is not supported. if success is false, this will be empty.
   */
  installedVersion: string;

  /** The number of currently connected devices. If success is false, this will be 0. If success is true and 
   * this valus is 0, then the user does not have any supported devices connected at time of the probe.
  */
  connectedDevices: number;
}

export async function Probe(timeoutMilliseconds: number = 1000, portNumber: number = 37888): Promise<ProbeResult> {
  /**
   * Probes to check if Tag Assistant is installed on user's computer. This is a Cross Origin call so the 
   * browser will first do a preflight request
   *
   * @param timeout - The timeout, in miliseconds to wait for the result. Since the call is to localhost
   *  the response should typically be a few milliseconds. Default is 1000 ms. 
   * @param portNumber - The port number that Tag Assistant is expected to be running. Default is 37888.
   * @returns - A ProbeResult indicating success and an error message if it fails.
   **/

  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMilliseconds);

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
        connectedDevices: 0,
        installedVersion: '',
        errorCode: 0,
        errorMessage: `Tag Assistant returned unexpected response ${probe.status}.`,
      }
    }

    const indexInfo = await probe.json() as IndexInfoResult;

    return {
      success: true,
      connectedDevices: indexInfo.connectedDevices,
      installedVersion: indexInfo.version,
      errorCode: 3,
      errorMessage: 'Fetch to TagAssistant was successful, however no tag was presented duing the wait window.'
    }
  }
  catch (error) {
    var errorCode = 0;
    const errorObject = (error as Error);
    var message = errorObject.message;
    const name = errorObject.name;

    if (name === 'AbortError') {
      errorCode = 1;
    }
    else if (name === 'TypeError') {
      errorCode = 2;
    }
    return {
      success: false,
      connectedDevices: 0,
      installedVersion: '',
      errorCode: errorCode,
      errorMessage: message,
    }
  }
}

export async function ReadTag(timeoutSeconds: number = 30, portNumber: number = 37888): Promise<ReadTagResult> {
  /**
   * Reads the Tag. This is a blocking HTTP call. Tag Assistant will wait the specified time to wait for the user
   * to present their tag. If their tag is already presented, it will return immediately.
   * 
   * @param timeout - The timeout, in seconds to wait for the result. Should be long enought to allow the user
   * time to present their tag. Default is 30 seconds.
   * @param portNumber - The port number that Tag Assistant is expected to be running. Default is 37888.
   * @returns - A ReadTagResult indicating success and an error message if it fails.
   */

  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), (timeoutSeconds * 1000) + 1000);

    const getTokens = await fetch(`http://localhost:${portNumber}/v1/tag?wait=${timeoutSeconds}`, {
      method: 'GET',
      headers: {
        'accept-type': 'application/json;charset=UTF-8'
      }
    });

    if (!getTokens.ok) {
      return {
        success: false,
        errorCode: 0, 
        errorMessage: `Tag Assistant returned unexpected response ${getTokens.status}.`,
        tag: ''
      }
    }
    const getTagResponse = await getTokens.json() as GetTagResponse

    const tag = getTagResponse.tag;

    if(tag === ''){
      return {
        success: false,
        errorCode: 0,
        errorMessage: '',
        tag: getTagResponse.tag
      };
    }

    return {
      success: true,
      errorCode: -1,
      errorMessage: '',
      tag: getTagResponse.tag
    };
  }
  catch (error) {
    var errorCode = 0;
    const errorObject = (error as Error);
    const message = errorObject.message;
    const name = errorObject.name;

    if (name === 'AbortError') {
      errorCode = 1;
    }
    else if (name === 'TypeError') {
      errorCode = 2;
    }
    return {
      success: false,
      errorCode: errorCode,
      errorMessage: message,
      tag: ''
    }
  }
}