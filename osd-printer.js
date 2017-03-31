/*jshint esversion: 6 */
"use strict()";

var printer = function (name, type, numExtruders, hasHeatedBed, nonStandardUrl, apiKey) {
     if (name !== undefined && typeof(name)==='string' &&
         type !== undefined && typeof(type)==='string' &&
         numExtruders !== undefined && typeof(numExtruders)==='number' &&
         hasHeatedBed !== undefined && typeof(hasHeatedBed)==='boolean')
     {
        this.id = printers.length + 1;  //TODO this +1 should go away when the database id is used
        this.name = name;
        this.type = type;
        this.numExtruders = numExtruders;
        this.hasHeatedBed = hasHeatedBed;
        if(nonStandardUrl !== undefined)
            this.octoprintUrl = nonStandardUrl;
        else
            this.octoprintUrl = "http://155.97.12.12" + this.id;
        this.octoprintWebcamLiveUrl = this.octoprintUrl + "/webcam/?action=stream";
        this.octoprintWebcamSnapshotUrl = this.octoprintUrl + "/webcam/?action=snapshot";
        this.printerModule = new printerModule(this);
        //var apiKey = //TODO Get from database
        this.octoPrintClient = new OctoPrintClient({baseurl: this.octoprintUrl, apikey: apiKey});
        this.octoPrintClient.socket.connect();  // Start the socket

        // Private functions
        var self = this;
        //connected: apikey, version. branch, display_version, plugin_hash, config_hash
        this.octoPrintClient.socket.onMessage("connected", function(message) {
            self.onSocketConnect(this, message);
        });
        // current: state, job, progress, currentZ, offsets, temps, logs, messages
        this.octoPrintClient.socket.onMessage("current", function(message) {
            self.onSocketReceiveCurrent(this, message);
        });
        // history: state, job, progress, currentZ, offsets, temps, logs, messages
        this.octoPrintClient.socket.onMessage("history", function(message) {
            self.onSocketReceiveHistory(this, message);
        });
        // event: type, payload
        this.octoPrintClient.socket.onMessage("event", function(message) {
            self.onSocketReceiveEvent(this, message);
        });
        // slicingProgress: slicer, source_location, source_path, dest_location, dest_path, progress
        this.octoPrintClient.socket.onMessage("slicingProgress", function(message) {
            self.onSocketReceiveSlicingProgress(this, message);
        });
        // plugin: messages generated by plugins. Plugin-specific.
        this.octoPrintClient.socket.onMessage("plugin", function(message) {
            self.onSocketReceivePluginMessage(this, message);
        });
    }
    else
    {
        // If there are any errors in the input then put in a null printer
        this.id = printers.length;
        this.name = null;
        this.type = null;
        this.numExtruders = null;
        this.hasHeatedBed = null;
        this.octoprintUrl = null;
        this.octoprintWebcamLiveUrl = null;
        this.octoprintWebcamSnapshotUrl = null;
        this.printerModule = null;
    }

    addPrinter(this);
};

// Printer Function Definitions
printer.prototype.onSocketConnect = function(printer, message) {
    console.log(this.name + " socket connected successfully.");
};

printer.prototype.onSocketReceiveCurrent = function(printer, message) {
    // console.log(this.name + " received a current message.");
    this.printerModule.updatePrinterStatus(message);
};

printer.prototype.onSocketReceiveHistory = function(printer, message) {
    // console.log(this.name + " received a history message.");
};

printer.prototype.onSocketReceiveEvent = function(printer, message) {
    // console.log(this.name + " received an event message.");
};

printer.prototype.onSocketReceiveSlicingProgress = function(printer, message) {
    // console.log(this.name + " received a slicing progress message.");
};

printer.prototype.onSocketReceivePluginMessage = function(printer, message) {
    // console.log(this.name + " received a plugin message.");
};

// printer.prototype.requestBatchInfo = function() {
//     var command_object;
//     if (this.hasHeatedBed) {
//         command_object = {
//             "job_name":null,
//             "time_remaining":null,
//             "progress":null,
//             "bed_temp":null,
//             "extruder_temps":null
//         };
//     }
//     else {
//         command_object = {
//             "job_name":null,
//             "time_remaining":null,
//             "progress":null,
//             "extruder_temps":null
//         };
//     }
//     httpRequest(this, command_object);
// };
//
// printer.prototype.requestProgressInfo = function() {
//     var command_object = {
//         "progress":null
//     };
//     httpRequest(this, command_object);
// };
//
// printer.prototype.requestTemperatureInfo = function() {
//     var command_object;
//     if (this.hasHeatedBed) {
//         command_object = {
//             "bed_temp":null,
//             "extruder_temps":null
//         };
//     }
//     else {
//         command_object = {
//             "extruder_temps":null
//         };
//     }
//     httpRequest(this, command_object);
// };
//
// printer.prototype.requestJobName = function() {
//     var command_object = {
//         "job_name":null
//     };
//     httpRequest(this, command_object);
// };
