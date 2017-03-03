"use strict()";
var printers = [];

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

function getPrinterById(id) {
    for (var i = 0; i < printers.length; i++) {
        if (printers[i].id == id) {
            return printers[i];
        }
    }
    return null;
}

// Printer
var printer = function (name, type, num_extruders, has_heated_bed) {
     if (name !== undefined && typeof(name)==='string' &&
         type !== undefined && typeof(type)==='string' &&
         num_extruders !== undefined && typeof(num_extruders)==='number' &&
         has_heated_bed !== undefined && typeof(has_heated_bed)==='boolean')
     {
        this.id = printers.length + 1;  //TODO this +1 should go away when the database id is used
        this.name = name;
        this.type = type;
        this.num_extruders = num_extruders;
        this.has_heated_bed = has_heated_bed;
        this.octoprintUrl = "http://155.97.12.12" + this.id;
        this.octoprintWebcamLiveUrl = "http://155.97.12.12" + this.id + "/webcam/?action=stream";
        this.octoprintWebcamSnapshotUrl = "http://155.97.12.12" + this.id + "/webcam/?action=snapshot";
    }
    else
    {
        // If there are any errors in the input then put in a null printer
        this.id = printers.length;
        this.name = null;
        this.type = null;
        this.num_extruders = null;
        this.has_heated_bed = null;
        this.octoprintUrl = null;
        this.octoprintWebcamLiveUrl = null;
        this.octoprintWebcamSnapshotUrl = null;
    }

    addPrinter(this);
    // console.log(printers);
};

// Printer Function Definitions
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
