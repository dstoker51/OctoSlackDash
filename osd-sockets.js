/*jshint esversion: 6 */
"use strict()";

var socket;
const numTimesToRetrySocketBeforeError = 100000;
var timesRetried = 0;
var timeout;
const timeoutInterval = 6000; //ms

// Start the web socket connection to the given server url
// This includes defining the onopen, onmessage, and onclose functions
function startWebSocket(url) {
    // Let's open a web socket
    socket = new SockJS(url);

    socket.onopen = function(event) {
        // Web Socket is connected
        console.log("Server socket connect successful.");
        timesRetried = 0;
    };

    socket.onmessage = function (event) {
        // Web Socket received message
        var payload = JSON.parse(event.data);
        var message = payload.message;
        var numPrintersToAdd = payload.num_printers;
        var printerId;
        var printerObject;

        // Printer setup occurs on server connect
        if(payload.message_type == "on_server_connect") {
            for (var printerDef in message) {
                // Check if printer already exists (happens on socket reconnect)
                printerId = message[printerDef].printer_id;
                if(getPrinterByPrinterId(printerId) !== null){
                    return;
                }
                // Else create new printer
                var type = message[printerDef].printer_type;
                var name = message[printerDef].printer_name;
                var url = message[printerDef].url;
                printerObject = new printer(printerId, name, type, url);

                // Rotate the snapshot to the angle defined in the database
                var angle = message[printerDef].camera_rotation % 360;  // Get it in standard angle range
                var timesToRotate = Math.floor(angle / 90); // Number of times to rotate by 90
                for(var rotationCount=0; rotationCount<timesToRotate; rotationCount++) {
                    if(angle > 0) {
                        printerObject.printerModule.rotateSnapshotRight90Deg(angle);
                    }
                    else {
                        printerObject.printerModule.rotateSnapshotLeft90Deg(angle);
                    }
                }

                // Flip the image as required
                var horizFlip = message[printerDef].horizontal_flip;
                var vertFlip = message[printerDef].vertical_flip;

                if(horizFlip == "True"){
                    printerObject.printerModule.flipSnapshotHorizontally();
                }
                if(vertFlip == "True") {
                    printerObject.printerModule.flipSnapshotVertically();
                }
            }
        }
        // Heartbeat from the printer
        else if(payload.message_type == "heartbeat") {
            printerObject = getPrinterByPrinterId(payload.printer_id);
            if(printerObject !== null && printerObject !== undefined) {
                printerObject.onSocketReceiveHeartbeat(message);
            }
        }
        //Printer updates occur on all other types of messages
        //connected: apikey, version. branch, display_version, plugin_hash, config_hash
        else if(payload.message_type == "connected") {
            printerObject = getPrinterByPrinterId(payload.printer_id);
            if(printerObject !== null && printerObject !== undefined) {
                printerObject.onSocketConnect(message);
            }
        }
        // current: state, job, progress, currentZ, offsets, temps, logs, messages
        else if(payload.message_type == "current") {
            printerObject = getPrinterByPrinterId(payload.printer_id);
            if(printerObject !== null && printerObject !== undefined) {
                printerObject.onSocketReceiveCurrent(message);
            }
        }
        // history: state, job, progress, currentZ, offsets, temps, logs, messages
        else if(payload.message_type == "history") {
            printerObject = getPrinterByPrinterId(payload.printer_id);
            if(printerObject !== null && printerObject !== undefined) {
                printerObject.onSocketReceiveHistory(message);
            }
        }
        // event: type, payload
        else if(payload.message_type == "event") {
            printerObject = getPrinterByPrinterId(payload.printer_id);
            if(printerObject !== null && printerObject !== undefined) {
                printerObject.onSocketReceiveEvent(message);
            }
        }
        // slicingProgress: slicer, source_location, source_path, dest_location, dest_path, progress
        else if(payload.message_type == "slicingProgress") {
            printerObject = getPrinterByPrinterId(payload.printer_id);
            if(printerObject !== null && printerObject !== undefined) {
                printerObject.onSocketReceiveSlicingProgress(message);
            }
        }
        // plugin: messages generated by plugins. Plugin-specific.
        else if(payload.message_type == "plugin") {
            printerObject = getPrinterByPrinterId(payload.printer_id);
            if(printerObject !== null && printerObject !== undefined) {
                printerObject.onSocketReceivePluginMessage(message);
            }
        }
        else {
            // Unknown payload type
            console.error("Unknown payload type detected. Check Octoprint docs for info on new type.");
        }

        // TODO Remove this line after testing
        // document.getElementById("test_area").innerHTML = JSON.stringify(message);
    };

    socket.onclose = function(event) {
        // Web Socket is closed. Display error state on printer modules
        for(var printer in printers) {
            var printerModule = printers[printer].printerModule;
            printerModule.DOM.className = "printer_module error";
        }

        // Try to reconnect
        if(timesRetried <= numTimesToRetrySocketBeforeError) {
            console.error("Socket connection closed. Trying to reconnect.");
            timeout = setTimeout(reconnectSocket, timeoutInterval);
        }
        else {
            console.error("Socket connection could not be reestablished. Please refresh the page.");
        }
    };
}

function reconnectSocket() {
    timesRetried = timesRetried + 1;
    startWebSocket(socket.url);
}
