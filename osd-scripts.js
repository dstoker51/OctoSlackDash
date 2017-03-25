"use strict()";

/* The second level object is any object like a modal or overlay that is "above"
 * the regular page. Clicking on anything that is not this object will cause
 * the object to close. This makes it so only one modal or menu item can be
 * active at a time, and is much cheaper than scanning through all items
 * whenever a click occurs to see if they are active and disable them.
 */
var activeSecondLevelObject = null;
var activeSecondLevelController = null;

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
    window.onclick = function(event) {
        var clickedObject = event.target;

        /* BUTTONS */
        if (clickedObject.className.includes("settings_icon")) {
            var printerId = event.target.id.replace("settings_icon", "");
            var overlay = document.getElementById("settings_overlay" + printerId);

            if (clickedObject === activeSecondLevelController) {
                overlay.style.display = "none";
                activeSecondLevelController = null;
                activeSecondLevelObject = null;
            }
            else {
                overlay.style.display = "block";
                activeSecondLevelObject = overlay;
                activeSecondLevelController = clickedObject;
            }
        }
        // else if(clickedObject.className.includes("info_icon")) {
        //
        // }

        /* ACTIVE SECOND-LEVEL OBJECT */
        if (activeSecondLevelObject !== null &&
            clickedObject !== activeSecondLevelObject &&
            !$.contains(activeSecondLevelObject, clickedObject) &&
            clickedObject !== activeSecondLevelController)
        {
            activeSecondLevelObject.style.display = "none";
            activeSecondLevelObject = null;
            activeSecondLevelController = null;

            if (clickedObject.id == "snapshot_modal" || clickedObject.id == "octo_slack_modal") {
                window.stop();  // This stops the stream so that it doesn't keep running in the background
                shouldUpdateSnapshots = true; // Restart the snapshot updates
            }
        }

        /* MODALS */
        // If the user clicks anywhere outside the modals, close it
        // if (clickedObjectId == "snapshot_modal_content" || clickedObjectId == "octo_slack_modal_content") {
        //     event.target.style.display = "none";
        //     window.stop();  // This stops the stream so that it doesn't keep running in the background
        //
        //     // Restart the snapshot updates
        //     shouldUpdateSnapshots = true;
        // }
        //
        // /* OVERLAYS */
        // if (clickedObjectId == "info_overlay" || clickedObjectId == "settings_overlay") {
        //     event.target.style.display = "none";
        //     window.stop();  // This stops the stream so that it doesn't keep running in the background
        //
        //     // Restart the snapshot updates
        //     shouldUpdateSnapshots = true;
        // }
        // If the user clicks anywhere outside the info button, close it
        // if (!clickedObjectClass.includes("info_overlay") && !clickedObjectClass.includes("info_icon")){
        //     var overlays = document.getElementsByClassName("overlay");
        //     if(overlays !== undefined) {
        //         for(var i=0; i<overlays.length; i++) {
        //             overlays.item(i).style.display = "none";
        //         }
        //     }
        // }

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
