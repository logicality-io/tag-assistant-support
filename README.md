# Logicality Tag Assistant

Welcome to the technical support area for the [Logicality Tag Assistant](https://tag-assistant.logicality.io) (_not final name_).

At this time, the product status is **preview** for testing with early adopters.

If you have a technical support issue or a new product feature request, please [create an issue](https://github.com/logicality-io/tag-assistant-support/issues/new).

For licencing & sales and other enquiries, please email contact@logicality.io.

## Technical Requirements/Information

- All up-to-date major browsers (Chrome, Edge and Firefox) are supported.
- Currently tested with Windows 10, 64bit.If other operating system version / bitness required, please let us know.
- Low system requirements - the service typically consumes less than 50MB RAM and 0% CPU when idle.
- [1-Wire/iButton Drivers for Windows](https://www.maximintegrated.com/en/products/ibutton-one-wire/one-wire/software-tools/drivers/download-1-wire-ibutton-drivers-for-windows.html)
- Allow the handling of incoming HTTP requests on localhost on port 37888, adjusting any firewall rules as necessary.

Currently supported devices:

1. iButton reader using [DS9490R USB Adapter](https://www.maximintegrated.com/en/products/ibutton-one-wire/ibutton/DS9490R.html). Download drivers [here](https://www.maximintegrated.com/en/products/ibutton-one-wire/one-wire/software-tools/drivers/download-1-wire-ibutton-drivers-for-windows.html). Supported driver version is `v405`, 64bit.

If you would like to see support of additional devices, smart card readers etc, please let us know.

## Installation Guide

Downloads are available in two formats:

- An MSI that installs a Windows Service. You will need the appropriate rights to perform the installation.
- A standalone console application. Useful for trying out on a restricted system and/or for development purposes.
  
Download the latest release from https://github.com/logicality-io/tag-assistant-support/releases

**Note 1**: During installation you will see a warning, "This package was created with a trial version of Advanced Installer...". This will be fixed
in a future version.
**Note 2**: During installation you will see a windows warning, "Do you want to allow this app from an unknown publisher to make changes to your device?". This will be fixed
in a future version.

By default, Tag Assistant will install into `%ProgramFiles%\Logicality\Tag Assistant`.

Go to https://tag-assistant.logicality.io to test your installation.

## Configure Allowed Origins

Leveraging [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) for security reasons, Tag Assistant will only respond to
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

## Test your installation.

Go to https://tag-assist.logicality.io to test your installation and follow the instruction there. Any issues, please let us know.

## Developer Guide

Coming soon...
