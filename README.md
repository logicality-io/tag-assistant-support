# Logicality Tag Assistant

Welcome to the technical support area for the [Logicality Tag Assistant](https://tag-assistant.logicality.io) (_not final name_).

At this time, the product status is **preview** and for evaluation with early adopters.

If you have a technical support issue or a new product feature request, please [create an issue](https://github.com/logicality-io/tag-assistant-support/issues/new).

For licencing, sales and other enquiries, please email contact@logicality.io.

## What is it?

Logicality Tag Assistant is a desktop Windows service that bridges reading USB devices (such as iButton) to authorized web applications. Enabled web
applications use some simple JavaScript to make an HTTP call to this service. By default, browsers won't allow such traffic due to CORS. Thus, only
web applications that you explicitly configure are authorized to call the Tag Assistant.

## Technical Requirements & Information

- All up-to-date major browsers on Windows (Chrome, Edge and Firefox) are supported.
- Currently tested with Windows 10, 64bit. If another operating system version or 32bit is desired, please let us know.
- Low system requirements - the service typically consumes less than 50MB RAM and 0% CPU when idle.
- Allow the handling of incoming HTTP requests on localhost on port 37888, adjusting any firewall rules as necessary.

Currently supported devices:

1. iButton reader using [DS9490R USB Adapter](https://www.maximintegrated.com/en/products/ibutton-one-wire/ibutton/DS9490R.html). Download drivers [here](https://www.maximintegrated.com/en/products/ibutton-one-wire/one-wire/software-tools/drivers/download-1-wire-ibutton-drivers-for-windows.html). Supported driver version is `v405`, 64bit.
2. NFC/RFID Tags using [ACS ACR122U USB NFC](https://www.acs.com.hk/en/products/3/acr122u-usb-nfc-reader/). Other similar devices that support the same standards will likely work. Contact us to verify.

If you would like to see support of additional devices, smart card readers etc., please contact us.

## Installation Guide

Downloads are available in two formats:

- An MSI that installs a Windows Service. You will need the appropriate rights to perform the installation.
- A standalone console application. Useful for trying out on a restricted system and/or for development purposes.
  
1. Download the latest `.msi.zip` release from https://github.com/logicality-io/tag-assistant-support/releases
2. Extract the `msi` installer from the zip file.
3. Run the `msi` program and follow the on-screen instructions.
4. After installation browse to http://localhost:37888 to view the embedded Administation UI, diagnostics, configuration and to test your installation.
5. Go to https://tag-assistant.logicality.io to test your installation with a remote web application.

Notes:
1. During installation you may see a windows warning: "Windows protected your PC. Microsoft Defender SmartScreen prevented...".  The
reason for this is that the package is not yet digitally signed. This will be addressed in a future version. Click `More Info` followed by `Run anyway` to proceed with installation.
2. If during installation you will see a windows warning, "Do you want to allow this app from an unknown publisher to make changes to your device?". 
. The reason for this is that the package is not yet digitally signed. This will be addressed in a future version. Click "Proceed" to continue.
3. By default, Tag Assistant will install into `%ProgramFiles%\Logicality\Tag Assistant`.
4. Tag Assistant stores data (configuration and logs) in `%ProgramData%\Logicality\Tag Assistant\`

## Configure Allowed CORS Origins

Leveraging [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) for security reasons, Tag Assistant will only respond to
HTTP requests from [Origin(s)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin) that you explicitly allow.

Tag Assistant supports two mechanism of configuration:
1. Manual configuration through the embedded administration UI and stored in the data.
2. Scripted installation with configuration stored in the installation directory.

### Manual Configuration.

After running the software for the first time, if no Allowed CORS Origns configuration is found, an `origins.json` template file is written to
`%ProgramData%\Logicality\Tag Assistant\origins.json`. It looks similar to this:

```json
{
  "allowedOrigins": [
    "https://tag-assistant.logicality.io"
  ]
}
```

From the embedded Administraion UI you can add/remove desired origins, or manually edit this file. Changes will require
a service restart.

Add the origin of the application that integrates with Tag Assistant to this list. For example, if your applcation is hosted
at `https://company.internal/myapp` the origin entry will be `https://company.internal`. Restart the service / console application 
after making any changes. 

### Scripted installation.

Many enterprise will re-package `.msi` installers for their own needs. If that options is chosen, an `origins.json` file can 
be packed and stored in the installation directory. Tag Assistant will use this configuration regardless of whether an `origins.json`
file exists in the data directory or not. Configuration through the embedded Administration UI will be disabled.
