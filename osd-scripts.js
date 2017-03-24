"use strict()";

function createOctoSlackModal() {
    // Create elements
    var octoSlackModal = document.getElementById("octo_slack_modal");

    var modalContent = document.createElement("DIV");
    modalContent.className = "octo_slack_modal_content";
    octoSlackModal.appendChild(modalContent);

    var iframe = document.createElement("IFRAME");
    modalContent.appendChild(iframe);

    // Set up the click event for the modal
    $(".printer_icon").click(function(){
        var printer_id = this.id.replace("printer_icon_", "");
        var printer = getPrinterByPrinterId(printer_id);
        iframe.src = printer.octoprintUrl;
        octoSlackModal.style.display = "block";
    });
}

function createNavBar() {
    var navBar = document.getElementById("nav_bar");

    var heroLogo = document.createElement("IMG");
    heroLogo.className = "hero_logo";
    heroLogo.id = "hero_logo";
    heroLogo.src = "img/uofulogo.png";

    navBar.appendChild(heroLogo);
}

function createSnapshotModal() {
    var snapshotModal = document.getElementById("snapshot_modal");

    var modalContent = document.createElement("DIV");
    modalContent.className = "snapshot_modal_content";
    modalContent.id = "snapshot_modal_content";
    snapshotModal.appendChild(modalContent);

    var snapshotImage = document.createElement("IMG");
    snapshotImage.id = "snapshot_modal_image";
    snapshotImage.src = "img/offline.png";

    modalContent.appendChild(snapshotImage);
}

function displaySnapshotModal(printer_id) {
    // Rotate the container to match the set rotation of the static snapshot
    var snapshot = document.getElementById("snapshot_" + printer_id);
    var angle = snapshot.title; //Title contains angle
    var modalContent = document.getElementById("snapshot_modal_content");
    modalContent.style.webkitTransform = "rotate("+angle+"deg)";

    // Set the modal image source to be the appropriate webcam feed
    var printer = getPrinterByPrinterId(printer_id);
    var modalImage = document.getElementById("snapshot_modal_image");
    modalImage.src = printer.octoprintWebcamLiveUrl;

    // Display the modal
    var snapshotModal = document.getElementById("snapshot_modal");
    snapshotModal.style.display = "block";

    // Keep the snapshots from updating while the modal is active
    shouldUpdateSnapshots = false;
}

function createWindowEventListeners() {
    //Modals
    // If the user clicks anywhere outside the modal, close it
    window.onclick = function(event) {
        if (event.target.id == "snapshot_modal") {
            var snapshotModal = document.getElementById("snapshot_modal");
            snapshotModal.style.display = "none";
            window.stop();  // This stops the stream so that it doesn't keep running in the background

            // Restart the snapshot updates
            shouldUpdateSnapshots = true;
        }
        else if (event.target.id == "octo_slack_modal") {
            var octoSlackModal = document.getElementById("octo_slack_modal");
            octoSlackModal.style.display = "none";
            window.stop();  // This stops the stream so that it doesn't keep running in the background

            // Restart the snapshot updates
            shouldUpdateSnapshots = true;
        }
    };

    // Set snapshot update interval
    window.setInterval(updateSnapshotViews, 3000);
}

function updateSnapshotViews() {
    for (var printer in printers) {
        var printerModule = printers[printer].printerModule;
        printerModule.updateSnapshotView();
    }
}
