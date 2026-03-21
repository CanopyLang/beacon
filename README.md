# canopy/beacon

Fire-and-forget analytics using the browser's `navigator.sendBeacon()` API.

## Installation

```
canopy install canopy/beacon
```

## Core Concept

`navigator.sendBeacon()` enqueues an HTTP POST in the browser's network layer and returns immediately. Unlike a standard `Http.post`, the request is non-blocking and — critically — survives page unload. This makes it the correct primitive for analytics, logging, and telemetry that must be delivered even when the user navigates away or closes the tab. Because the browser owns the request lifecycle, there is no response to handle.

## Quick Start

```canopy
import Beacon
import Json.Encode as Encode


logPageView : String -> Cmd msg
logPageView path =
    Beacon.sendJson
        "https://analytics.example.com/collect"
        (Encode.object
            [ ( "event", Encode.string "page_view" )
            , ( "path", Encode.string path )
            ]
        )


-- Check support before relying on it
init : ( Model, Cmd Msg )
init =
    ( initialModel
    , Beacon.isSupported
        |> Task.perform GotBeaconSupport
    )
```

## API Summary

### Sending Data

| Name | Type | Description |
|------|------|-------------|
| `Beacon.send` | `String -> Payload -> Cmd msg` | Send a `Payload` value to the given URL |
| `Beacon.sendJson` | `String -> Value -> Cmd msg` | Convenience wrapper; encodes a `Json.Encode.Value` as `application/json` |
| `Beacon.sendString` | `String -> String -> Cmd msg` | Convenience wrapper; sends a plain text body as `text/plain` |

### Feature Detection

| Name | Type | Description |
|------|------|-------------|
| `Beacon.isSupported` | `Task x Bool` | Resolve whether `navigator.sendBeacon` is available in the current browser |

### Types

**`Payload`** — The body of a beacon request. Construct with one of these variants:

| Constructor | Description |
|-------------|-------------|
| `StringPayload String` | Plain text body |
| `JsonPayload Value` | JSON body; sets `Content-Type: application/json` |
| `BytesPayload Bytes` | Raw binary body |
| `FormPayload (List (String, String))` | Key-value pairs encoded as `multipart/form-data` |
| `UrlEncodedPayload (List (String, String))` | Key-value pairs encoded as `application/x-www-form-urlencoded` |

**`SendResult`** — The outcome of a send attempt:

| Variant | Description |
|---------|-------------|
| `Queued` | The browser accepted the request and will send it |
| `Rejected` | The browser declined to queue the request |

## Gotchas

**Beacon is one-way.** There is no response, status code, or error to handle. If you need to confirm delivery, use `Http.post` instead.

**`Rejected` means the queue was full, not that the network failed.** The browser returns `false` from `sendBeacon` only when the payload is too large to be queued — typically when the total queued data exceeds 64 KB. It does not indicate a network error or server-side failure. Normal transient network conditions will still result in `Queued`.

**`isSupported` may return `False` in older browsers and non-browser environments.** When it does, fall back to `Http.post` for your telemetry. The `sendBeacon` API is unavailable in Node.js and some WebView environments.

**Do not use Beacon for requests that require authentication headers.** The API does not support custom request headers beyond what the browser sets automatically for the payload type.

## License

BSD-3-Clause
