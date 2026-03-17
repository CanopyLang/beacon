// Canopy Beacon FFI — navigator.sendBeacon binding
//
// Imported in Beacon.can via:
//   foreign import javascript "external/beacon.js" as BeaconFFI


// ============================================================================
// RESULT CONSTRUCTORS
// ============================================================================

/**
 * Construct a Queued result.
 * @returns {Object} Queued variant of SendResult
 */
function _Beacon_queued() {
    return __canopy_debug ? { $: 'Queued' } : { $: 0 };
}

/**
 * Construct a Rejected result.
 * @returns {Object} Rejected variant of SendResult
 */
function _Beacon_rejected() {
    return __canopy_debug ? { $: 'Rejected' } : { $: 1 };
}


// ============================================================================
// SEND BEACON
// ============================================================================

/**
 * Send a beacon with a string payload.
 * Calls navigator.sendBeacon(url, data) and returns a Task with the result.
 *
 * @canopy-type String -> String -> Task Never SendResult
 * @name sendStringPayload
 */
var sendStringPayload = F2(function(url, data) {
    return _Scheduler_binding(function(callback) {
        try {
            if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
                var result = navigator.sendBeacon(url, data);
                callback(_Scheduler_succeed(result ? _Beacon_queued() : _Beacon_rejected()));
            } else {
                callback(_Scheduler_succeed(_Beacon_rejected()));
            }
        } catch (e) {
            callback(_Scheduler_succeed(_Beacon_rejected()));
        }
    });
});


/**
 * Send a beacon with a Blob payload (for JSON with correct Content-Type).
 * Creates a Blob from the JSON string with application/json Content-Type.
 *
 * @canopy-type String -> String -> Task Never SendResult
 * @name sendJsonBlob
 */
var sendJsonBlob = F2(function(url, jsonString) {
    return _Scheduler_binding(function(callback) {
        try {
            if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
                var blob = new Blob([jsonString], { type: 'application/json' });
                var result = navigator.sendBeacon(url, blob);
                callback(_Scheduler_succeed(result ? _Beacon_queued() : _Beacon_rejected()));
            } else {
                callback(_Scheduler_succeed(_Beacon_rejected()));
            }
        } catch (e) {
            callback(_Scheduler_succeed(_Beacon_rejected()));
        }
    });
});


/**
 * Send a beacon with a Bytes (ArrayBuffer) payload.
 *
 * @canopy-type String -> Bytes -> Task Never SendResult
 * @name sendBytesPayload
 */
var sendBytesPayload = F2(function(url, bytes) {
    return _Scheduler_binding(function(callback) {
        try {
            if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
                var buffer = bytes.buffer || bytes;
                var result = navigator.sendBeacon(url, buffer);
                callback(_Scheduler_succeed(result ? _Beacon_queued() : _Beacon_rejected()));
            } else {
                callback(_Scheduler_succeed(_Beacon_rejected()));
            }
        } catch (e) {
            callback(_Scheduler_succeed(_Beacon_rejected()));
        }
    });
});


/**
 * Send a beacon with FormData payload.
 * Converts a Canopy List of (String, String) pairs to FormData.
 *
 * @canopy-type String -> List (String, String) -> Task Never SendResult
 * @name sendFormPayload
 */
var sendFormPayload = F2(function(url, pairs) {
    return _Scheduler_binding(function(callback) {
        try {
            if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
                var formData = new FormData();
                var arr = _List_toArray(pairs);
                for (var i = 0; i < arr.length; i++) {
                    formData.append(arr[i].a, arr[i].b);
                }
                var result = navigator.sendBeacon(url, formData);
                callback(_Scheduler_succeed(result ? _Beacon_queued() : _Beacon_rejected()));
            } else {
                callback(_Scheduler_succeed(_Beacon_rejected()));
            }
        } catch (e) {
            callback(_Scheduler_succeed(_Beacon_rejected()));
        }
    });
});


/**
 * Send a beacon with URLSearchParams payload.
 * Converts a Canopy List of (String, String) pairs to URLSearchParams.
 *
 * @canopy-type String -> List (String, String) -> Task Never SendResult
 * @name sendUrlEncodedPayload
 */
var sendUrlEncodedPayload = F2(function(url, pairs) {
    return _Scheduler_binding(function(callback) {
        try {
            if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
                var params = new URLSearchParams();
                var arr = _List_toArray(pairs);
                for (var i = 0; i < arr.length; i++) {
                    params.append(arr[i].a, arr[i].b);
                }
                var result = navigator.sendBeacon(url, params);
                callback(_Scheduler_succeed(result ? _Beacon_queued() : _Beacon_rejected()));
            } else {
                callback(_Scheduler_succeed(_Beacon_rejected()));
            }
        } catch (e) {
            callback(_Scheduler_succeed(_Beacon_rejected()));
        }
    });
});


// ============================================================================
// SUPPORT CHECK
// ============================================================================

/**
 * Check if navigator.sendBeacon is supported.
 *
 * @canopy-type Task Never Bool
 * @name isSupported
 */
var isSupported = _Scheduler_binding(function(callback) {
    var supported = typeof navigator !== 'undefined'
        && typeof navigator.sendBeacon === 'function';
    callback(_Scheduler_succeed(supported));
});
