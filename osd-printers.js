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
        if (printers[i].id == Number(id))
            return printers[i];
    }
    return null;
}

function getPrinterByModuleId(id) {
    id = Number(id) - 1;
    if(printers.length > Number(id))
        return printers[id];
    else
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
        this.numExtruders = num_extruders;
        this.hasHeatedBed = has_heated_bed;
        this.octoprintUrl = "http://155.97.12.12" + this.id;
        this.octoprintWebcamLiveUrl = "http://155.97.12.12" + this.id + "/webcam/?action=stream";
        this.octoprintWebcamSnapshotUrl = "http://155.97.12.12" + this.id + "/webcam/?action=snapshot";
        this.printerModule = new printerModule(this);
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
    // console.log(printers);
};

// Printer Function Definitions
printer.prototype.requestBatchInfo = function() {
    var command_object;
    if (this.has_heated_bed) {
        command_object = {
            "job_name":null,
            "time_remaining":null,
            "progress":null,
            "bed_temp":null,
            "extruder_temps":null
        };
    }
    else {
        command_object = {
            "job_name":null,
            "time_remaining":null,
            "progress":null,
            "extruder_temps":null
        };
    }
    httpRequest(this, command_object);
};

printer.prototype.requestProgressInfo = function() {
    var command_object = {
        "progress":null
    };
    httpRequest(this, command_object);
};

printer.prototype.requestTemperatureInfo = function() {
    var command_object;
    if (this.has_heated_bed) {
        command_object = {
            "bed_temp":null,
            "extruder_temps":null
        };
    }
    else {
        command_object = {
            "extruder_temps":null
        };
    }
    httpRequest(this, command_object);
};

printer.prototype.requestJobName = function() {
    var command_object = {
        "job_name":null
    };
    httpRequest(this, command_object);
};
