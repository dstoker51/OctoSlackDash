"use strict()";

var printerModuleCount = 0;
var numModulesPerRow = 4;
var snapshotHeightToWidthRatio = 1.3333333; // 440px/330px
var shouldUpdateSnapshots = true;

var printerModule = function(printer) {
    this.DOM = this.createPrinterModule(printer);
    this.id = this.DOM.id;
};

printerModule.prototype.createPrinterModule = function(printer) {
    // Create a new row if needed
    if (printerModuleCount % numModulesPerRow === 0) {
        var row = document.createElement("DIV");
        row.className = "row";
        document.getElementById("container").appendChild(row);
    }

    //Update module count
    printerModuleCount++;

    // Create elements
    var col = document.createElement("DIV");
    col.className = "col-xs-12 col-sm-6 col-md-6 col-lg-3 col-xl-3";

    var module = document.createElement("DIV");
    module.className = "printer_module";
    module.id = printerModuleCount;

    var printerName = document.createElement("DIV");
    printerName.className = "printer_name";
    if(printer !== undefined)    // Properly constucted printer object
        printerName.innerHTML = printer.name;
    else {
        // Badly constructed printers still need a name
        printerName.innerHTML = "Error" + module.id;
    }

    var snapshotWrapper = document.createElement("DIV");
    snapshotWrapper.className = "snapshot_wrapper";

    var snapshot = document.createElement("IMG");
    snapshot.className = "snapshot";
    snapshot.id = "snapshot_" + Number(module.id);
    snapshot.src = printer.octoprintWebcamSnapshotUrl;
    snapshot.alt = printerName.innerHTML;
    snapshot.title = "0";   // Used for rotation calculation
    snapshotWrapper.appendChild(snapshot);

    var infoOverlay = this.createInfoOverlay(Number(module.id));  // Overlay that covers snapshot
    snapshotWrapper.appendChild(infoOverlay);
    var settingsOverlay = this.createSettingsOverlay(Number(module.id));  // Overlay that covers snapshot
    snapshotWrapper.appendChild(settingsOverlay);

    // snapshot.onerror = function() {
    //     snapshot.src = "img/offline.png";
    // };

    var toolbar = document.createElement("DIV");
    toolbar.className = "toolbar";
    toolbar.id = "toolbar_" + Number(module.id);

    var printerIcon = document.createElement("IMG");
    printerIcon.className = "icon printer_icon";
    printerIcon.id = "printer_icon_" + Number(module.id);
    printerIcon.src = "img/3dprinter_icon.png";

    var infoIcon = document.createElement("IMG");
    infoIcon.className = "icon info_icon";
    infoIcon.id = "info_icon" + Number(module.id);
    infoIcon.src = "img/info_icon.png";

    var settingsIcon = document.createElement("IMG");
    settingsIcon.className = "icon settings_icon";
    settingsIcon.id = "settings_icon" + Number(module.id);
    settingsIcon.src = "img/gear_icon.png";

    var status = document.createElement("DIV");
    status.className = "status";
    status.id = "status_" + Number(module.id);

    var progressContainer = document.createElement("DIV");
    progressContainer.className = "progress";
    var progressBar = document.createElement("DIV");
    progressBar.className = "progress-bar progress-bar-danger progress-bar-striped active";
    progressBar.id = "progress_bar_" + Number(module.id);
    progressBar.role = "progressbar";
    $(progressBar).attr("aria-valuenow", "30");
    $(progressBar).attr("aria-valuemin", "0");
    $(progressBar).attr("aria-valuemax", "100");
    $(progressBar).attr("style", "width:30%");
    progressBar.innerHTML = "30%";
    progressContainer.appendChild(progressBar);
    status.appendChild(progressContainer);

    // Structure them
    module.appendChild(printerName);
    module.appendChild(snapshotWrapper);
    module.appendChild(toolbar);
    toolbar.appendChild(printerIcon);
    toolbar.appendChild(infoIcon);
    toolbar.appendChild(settingsIcon);
    module.appendChild(status);
    col.appendChild(module);

    // Display them
    document.getElementById("container").lastChild.appendChild(col);

    return module;
};

printerModule.prototype.updateProgressBar = function(value) {
    var progressBar = document.getElementById("progress_bar_" + Number(this.id));
    $(progressBar).attr("aria-valuenow", "" + value + "%");
    $(progressBar).attr("style", "width:" + value + "%");
    progressBar.innerHTML = "" + value + "%";
};

printerModule.prototype.updateJobName = function(value) {
    if(value !== null) {

    }
};

printerModule.prototype.updateTimeRemaining = function(value) {

};

printerModule.prototype.updateProgress = function(value) {

    if (value !== null) {
        // Update status overlay values
        var textArea = document.getElementById("print_time_value_" + Number(this.id));
        textArea.innerHTML = value.printTime;
        textArea = document.getElementById("print_time_left_value_" + Number(this.id));
        textArea.innerHTML = value.printTimeLeft;

        // Update progress bar
        this.updateProgressBar(value.completion);
    }
};

printerModule.prototype.updateBedTemp = function(value) {

};

printerModule.prototype.updateExtruderTemps = function(value) {

};

printerModule.prototype.updatePrinterStatus = function(message) {
    this.updateJobName(message.data.job.file.name);
    if (message.hasOwnProperty("time_remaining")) {
        this.updateTimeRemaining(message.time_remaining);
    }
    if (message.data.progress !== null) {
        this.updateProgress(message.data.progress);
    }

    if (message.hasOwnProperty("extruder_temps")) {
        this.updateExtruderTemps(message.extruder_temps);

        if (getPrinterByModuleId(this.id).hasHeatedBed)
            this.updateBedTemp(message.extruder_temps);
    }
};

printerModule.prototype.updateSnapshotView = function() {
    if(shouldUpdateSnapshots) {
        var snapshot = document.getElementById("snapshot_" + this.id);
        var copy = snapshot.src;
        snapshot.src = copy;
    }
};

printerModule.prototype.createInfoOverlay = function(id) {
    // Create elements
    var infoOverlay = document.createElement("DIV");
    infoOverlay.className = "overlay info_overlay";
    infoOverlay.id = "info_overlay" + id;

    var overlayContent = document.createElement("DIV");
    overlayContent.className = "info_overlay_content";

    /*************************************************/
    var overlayTextLine = document.createElement("DIV");
    overlayTextLine.className = "text_line";
    overlayContent.append(overlayTextLine);

    var stateKey = document.createElement("DIV");
    stateKey.className = "state_key";
    stateKey.id = "state_key_" + id;
    stateKey.innerHTML = "State: ";
    overlayTextLine.append(stateKey);

    var stateValue = document.createElement("DIV");
    stateValue.className = "state_value";
    stateValue.id = "state_value_" + id;
    overlayTextLine.append(stateValue);

    /*************************************************/
    overlayTextLine = document.createElement("DIV");
    overlayTextLine.className = "text_line";
    overlayContent.append(overlayTextLine);

    var fileKey = document.createElement("DIV");
    fileKey.className = "file_key";
    fileKey.id = "file_key_" + id;
    fileKey.innerHTML = "File: ";
    overlayTextLine.append(fileKey);

    var fileValue = document.createElement("DIV");
    stateValue.className = "file_value";
    stateValue.id = "file_value_" + id;
    overlayTextLine.append(fileValue);

    /*************************************************/
    overlayTextLine = document.createElement("DIV");
    overlayTextLine.className = "text_line";
    overlayContent.append(overlayTextLine);

    var approxTotalPrintTimeKey = document.createElement("DIV");
    approxTotalPrintTimeKey.className = "approx_total_print_time_key";
    approxTotalPrintTimeKey.id = "approx_total_print_time_key_" + id;
    approxTotalPrintTimeKey.innerHTML = "Approx Total Print Time: ";
    overlayTextLine.append(approxTotalPrintTimeKey);

    var approxTotalPrintTimeValue = document.createElement("DIV");
    approxTotalPrintTimeValue.className = "approx_total_print_time_value";
    approxTotalPrintTimeValue.id = "approx_total_print_time_value_" + id;
    overlayTextLine.append(approxTotalPrintTimeValue);

    /*************************************************/
    overlayTextLine = document.createElement("DIV");
    overlayTextLine.className = "text_line";
    overlayContent.append(overlayTextLine);

    var printTimeKey = document.createElement("DIV");
    printTimeKey.className = "print_time_key";
    printTimeKey.id = "print_time_key_" + id;
    printTimeKey.innerHTML = "Print Time: ";
    overlayTextLine.append(printTimeKey);

    var printTimeValue = document.createElement("DIV");
    printTimeValue.className = "print_time_value";
    printTimeValue.id = "print_time_value_" + id;
    overlayTextLine.append(printTimeValue);

    /*************************************************/
    overlayTextLine = document.createElement("DIV");
    overlayTextLine.className = "text_line";
    overlayContent.append(overlayTextLine);

    var printTimeLeftKey = document.createElement("DIV");
    printTimeLeftKey.className = "print_time_left_key";
    printTimeLeftKey.id = "print_time_left_key_" + id;
    printTimeLeftKey.innerHTML = "Print Time Left: ";
    overlayTextLine.append(printTimeLeftKey);

    var printTimeLeftValue = document.createElement("DIV");
    printTimeLeftValue.className = "print_time_left_value";
    printTimeLeftValue.id = "print_time_left_value_" + id;
    overlayTextLine.append(printTimeLeftValue);

    // Structure it
    infoOverlay.appendChild(overlayContent);

    return infoOverlay;
};

printerModule.prototype.createSettingsOverlay = function(id) {
    // Create elements
    var settingsOverlay = document.createElement("DIV");
    settingsOverlay.className = "overlay settings_overlay";
    settingsOverlay.id = "settings_overlay" + id;

    var overlayContent = document.createElement("DIV");
    overlayContent.className = "settings_overlay_content";

    var rotateLeft = document.createElement("A");
    rotateLeft.className = "icon rotate_left_link";
    rotateLeft.id = "rotate_left_link_" + id;
    var rotateLeftIcon = document.createElement("IMG");
    rotateLeftIcon.className = "icon rotate_left_icon";
    rotateLeftIcon.id = "rotate_left_icon_" + id;
    rotateLeftIcon.src = "img/rotate_left.png";
    rotateLeft.onclick = function() {
        var id = this.id.replace("rotate_left_link_", "");
        var printer = getPrinterByModuleId(id);
        printer.printerModule.rotateSnapshotLeft90Deg();
    };

    var rotateRight = document.createElement("A");
    rotateRight.className = "icon rotate_right_link";
    rotateRight.id = "rotate_right_link_" + id;
    var rotateRightIcon = document.createElement("IMG");
    rotateRightIcon.className = "icon rotate_right_icon";
    rotateRightIcon.id = "rotate_right_icon_" + id;
    rotateRightIcon.src = "img/rotate_right.png";
    rotateRight.onclick = function() {
        var id = this.id.replace("rotate_right_link_", "");
        var printer = getPrinterByModuleId(id);
        printer.printerModule.rotateSnapshotRight90Deg();
    };

    // Structure them
    rotateLeft.appendChild(rotateLeftIcon);
    rotateRight.appendChild(rotateRightIcon);
    overlayContent.appendChild(rotateLeft);
    overlayContent.appendChild(rotateRight);
    settingsOverlay.appendChild(overlayContent);

    return settingsOverlay;
};

printerModule.prototype.rotateSnapshotLeft90Deg = function() {
    // Get the rotation angle stored in the snapshot title tag
    var image = document.getElementById("snapshot_" + this.id);
    var oldAngle = Number(image.title);
    var newAngle = (oldAngle - 90) % 360;
    image.title = newAngle; /* Store the rotation */

    // Perform the rotation
    image.style.webkitTransform = "rotate("+newAngle+"deg) scale("+snapshotHeightToWidthRatio+")";
};

printerModule.prototype.rotateSnapshotRight90Deg = function() {
    // Get the rotation angle stored in the snapshot title tag
    var image = document.getElementById("snapshot_" + this.id);
    var oldAngle = Number(image.title);
    var newAngle = (oldAngle + 90) % 360;
    image.title = newAngle; /* Store the rotation */
    image.style.webkitTransform = "rotate("+newAngle+"deg) scale("+snapshotHeightToWidthRatio+")";
};

printerModule.prototype.rotateSnapshotToAngle = function(angle) {
    var image = document.getElementById("snapshot_" + this.id);
    image.style.webkitTransform = "rotate("+angle+"deg)";
};
