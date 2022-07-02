# Logicality Tag Assistant

Welcome to the technical support area for the [Logicality Tag Assistant](https://tag-assistant.logicality.io). 

At this time, the product status is **preview** for testing by early adopters.

If you have a technical support issue or a new product feature request, please [create an issue](https://github.com/logicality-io/tag-assistant-support/issues/new).

For licencing & sales enquiries, please email contact@logicality.io.

## Technical Requirements/Information

- All up-to-date major browsers (Chrome, Edge and Firefox) are supported.
- Windows 7 or later, 64 bit.
- Low system requirements - the service typically consumes less than 50MB RAM and 0% CPU when idle.
- [1-Wire/iButton Drivers for Windows](https://www.maximintegrated.com/en/products/ibutton-one-wire/one-wire/software-tools/drivers/download-1-wire-ibutton-drivers-for-windows.html)
- Allow the handling of incoming HTTP requests on localhost on port 37888, adjusting any firewall rules as necessary.

## Installation Guide

Downloads are available in two formats:

- An MSI that installs as a Windows Service. You will need the appropriate rights to perform the installation.
- A standalone console application. Useful for trying out on a restricted system and/or for development purposes.
  
Download the latest release from https://github.com/logicality-io/tag-assistant-support/releases

By default, the MSI will install into `%ProgramFiles%\Tag Assistant`.

Go to https://tag-assistant.logicality.io to test your installation.

## Configure Allowed Origins

Leveraging [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing), Tag Assistant will only respond to
HTTP requests from [Origin(s)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin) that you explicitly configure.

In the installation directory(or the extraction directory if using the standalone version) there is an `origin.json` file. 
By default is looks like:

```json
{
  "AllowedOrigins": [
    "https://tag-assistant.logicality.io",
    "http://localhost:3000",
    "https://localhost:3000",
    "http://localhost:5000",
    "https://localhost:5000"
  ]
}
```

Add the rigin of the application that integrates with Tag Assistant to this list. For example, if your applcation is hosted
at `https://company.internal/myapp` the origin entry will be `https://company.internal`. Restart the service / console application 
after making the changes. 

You may optionally remove the other entries, however if you remove `https://tag-assistant.logicality.io`
you will not be able to use the test/diagnostic facilities hosted there. 

_Could this process be improved?_ [Please let us know!](https://github.com/logicality-io/tag-assistant-support/issues/new)

## Developer Guide

Coming soon...
