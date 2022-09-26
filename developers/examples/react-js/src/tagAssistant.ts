interface IndexInfoResult {
  version: string;
  connectedDevices: number;
}

export interface ReadTagResult {
  /** The Tag unique identifier. Will be empty if no tag was read within timeout period, or an 
   * error occurs.
   */
  tag: string;
  /** An error message if any. */
  errorMessage: string;
}

interface GetTagResponse {
  tag: string;
}

export interface ProbeResult {
  /** True if Tag Assistant is detected and has one or more devices connected.
   *  False if TagAssistant was not detected or no devices were connected. UI elements, such
   * as disabling an icon, should be reactive to this value. The errorMessage contains details of the 
   * error. */
  success: boolean;
  /** The installed version of Tag Assistant. This can be compared with known minimal supported version 
   * and provide user feedback if the version is not supported. if success is false, this will be empty.
   */
  installedVersion: string;
  /** The number of currently connected devices. If success is false, this will be 0. If success is true and 
   * this valus is 0, then the user does not have any supported devices connected at time of the probe.
  */
  connectedDevices: number;
  /** An error message indicating the reason why the probe failed. If success is true, this will be empty. */
  errorMessage: string,
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
        errorMessage: `Tag Assistant returned unexpected response ${probe.status}.`,
      }
    }

    const indexInfo = await probe.json() as IndexInfoResult;

    return {
      success: true,
      connectedDevices: indexInfo.connectedDevices,
      installedVersion: indexInfo.version,
      errorMessage: ''
    }
  }
  catch (error) {
    var message = (error as Error).message;

    console.log('TagAssistant: Error occured: ${error}')

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
      connectedDevices: 0,
      installedVersion: '',
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