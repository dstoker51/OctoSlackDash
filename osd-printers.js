"use strict()";
var printers = [];

var printer = function (name, type, num_extruders, has_heated_bed, octoprintAPIKey, octoprintWebcamFeedUrl, octoprintStillsFeedUrl) {
     if (name !== undefined && typeof(name)==='string' &&
         type !== undefined && typeof(type)==='string' &&
         octoprintAPIKey !== undefined && typeof(octoprintAPIKey)==='string' &&
         octoprintWebcamFeedUrl !== undefined && typeof(octoprintWebcamFeedUrl)==='string' &&
         octoprintStillsFeedUrl !== undefined && typeof(octoprintStillsFeedUrl)==='string')
     {
        this.id = printers.length;
        this.name = name;
        this.type = type;
        this.num_extruders = num_extruders;
        this.has_heated_bed = has_heated_bed;
        this.octoprintAPIKey = octoprintAPIKey;
        this.octoprintWebcamFeedUrl = octoprintWebcamFeedUrl;
        this.octoprintStillsFeedUrl = octoprintStillsFeedUrl;
    }
    else
    {
        // If there are any errors in the input then put in a null printer
        this.id = printers.length;
        this.name = null;
        this.type = null;
        this.num_extruders = null;
        this.has_heated_bed = null;
        this.octoprintAPIKey = null;
        this.octoprintWebcamFeedUrl = null;
        this.octoprintStillsFeedUrl = null;
    }

    addPrinter(this);
    // console.log(printers);
};

// Global functions
function addPrinter(printer) {
    printers.push(printer);
}

function deletePrinter(printer) {
    for (i=0; i<printers.length; i++) {
        if (printers[i].id == printer.id)
            printers.splice(i, 1);  //Delete the printer without leaving a hole
    }
}

//Printer Function Definitions
printer.prototype.batchInfo = function() {
    var command_object = {
        "job_name":null,
        "time_remaining":null,
        "progress":null,
        "bed_temp":null,
        "extruder_temps":null
    };
    httpRequest(this, command_object);
};

printer.prototype.progress = function() {
    var command_object = {
        "progress":null
    };
    httpRequest(this, command_object);
};

printer.prototype.temps = function() {
    var command_object = {
        "bed_temp":null,
        "extruder_temps":null
    };
    httpRequest(this, command_object);
};

printer.prototype.jobName = function() {
    var command_object = {
        "job_name":null
    };
    httpRequest(this, command_object);
};
