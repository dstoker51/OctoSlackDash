function createPrinterModule(printer) {
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
    col.className = "col-xs-8 col-sm-6 col-md-6 col-lg-3 col-xl-3";
    // var gutter = document.createElement("DIV");
    // gutter.className = "col-xs-2 col-sm-4 col-md-";

    var printerModule = document.createElement("DIV");
    printerModule.className = "printer_module";
    printerModule.id = printerModuleCount;

    var printerName = document.createElement("DIV");
    printerName.className = "printer_name";
    if(printer !== undefined)    // Properly constucted printer object
        printerName.innerHTML = printer.name;
    else {
        printerName.innerHTML = "OctoPi-" + printerModule.id; // Badly constructed still need a name
    }

    var snapshot = document.createElement("IMG");
    snapshot.className = "snapshot";
    snapshot.id = "snapshot_" + Number(printerModule.id);
    snapshot.src = "http://155.97.12.12" + Number(printerModule.id) + "/webcam/?action=snapshot";
    snapshot.alt = printerName.innerHTML;
    snapshot.onclick = function(){
        displaySnapshotModal(Number(printerModule.id));
    };
    // snapshot.onerror = function() {
    //     snapshot.src = "img/offline.png";
    // };
    // setUpSnapshotLiveFeedHover(snapshot);

    var toolbar = document.createElement("DIV");
    toolbar.className = "toolbar";
    toolbar.id = "toolbar_" + Number(printerModule.id);

    var printerIcon = document.createElement("IMG");
    printerIcon.className = "icon printer_icon";
    printerIcon.id = "printer_icon_" + Number(printerModule.id);
    printerIcon.src = "img/3dprinter_icon.png";

    var infoIcon = document.createElement("IMG");
    infoIcon.className = "icon info_icon";
    infoIcon.id = "info_icon" + Number(printerModule.id);
    infoIcon.src = "img/info_icon.png";

    var settingsIcon = document.createElement("IMG");
    settingsIcon.className = "icon settings_icon";
    settingsIcon.id = "settings_icon" + Number(printerModule.id);
    settingsIcon.src = "img/gear_icon.png";

    var status = document.createElement("DIV");
    status.className = "status";
    status.id = "status_" + Number(printerModule.id);

    var progressContainer = document.createElement("DIV");
    progressContainer.className = "progress";
    var progressBar = document.createElement("DIV");
    progressBar.className = "progress-bar progress-bar-danger progress-bar-striped active";
    progressBar.role = "progressbar";
    $(progressBar).attr("aria-valuenow", "30");
    $(progressBar).attr("aria-valuemin", "0");
    $(progressBar).attr("aria-valuemax", "100");
    $(progressBar).attr("style", "width:30%");
    progressBar.innerHTML = "30%";
    progressContainer.appendChild(progressBar);
    status.appendChild(progressContainer);

    // Structure them
    printerModule.appendChild(printerName);
    printerModule.appendChild(snapshot);
    printerModule.appendChild(toolbar);
    toolbar.appendChild(printerIcon);
    toolbar.appendChild(infoIcon);
    toolbar.appendChild(settingsIcon);
    printerModule.appendChild(status);
    col.appendChild(printerModule);

    // Display them
    document.getElementById("container").lastChild.appendChild(col);

    // Set up status hover and overlay now that the elements exist in the dom
    // setUpStatusHoverOverlay(status.id);
}
