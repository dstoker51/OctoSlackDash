"use strict()";

/* The second level object is any object like a modal or overlay that is "above"
 * the regular page. Clicking on anything that is not this object will cause
 * the object to close. This makes it so only one modal or menu item can be
 * active at a time, and is much cheaper than scanning through all items
 * whenever a click occurs to see if they are active and disable them.
 */
var activeSecondLevelObject = null;
var activeSecondLevelController = null;

// Set snapshot update interval
window.setInterval(updateSnapshotViews, 3000);

function createNavBar() {
    var navBar = document.getElementById("nav_bar");

    var heroLogo = document.createElement("IMG");
    heroLogo.className = "hero_logo";
    heroLogo.id = "hero_logo";
    heroLogo.src = "img/uofulogo.png";

    navBar.appendChild(heroLogo);
}

function createOctoSlackModal() {
    // Create elements
    var octoSlackModal = document.getElementById("octo_slack_modal");

    var modalContent = document.createElement("DIV");
    modalContent.className = "octo_slack_modal_content";
    modalContent.id = "octo_slack_modal_content";
    octoSlackModal.appendChild(modalContent);

    var iframe = document.createElement("IFRAME");
    iframe.id = "octo_slack_modal_iframe";

    modalContent.appendChild(iframe);
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

function displayOctoSlackModal(printerId) {
    // Set the modal iframe source to be the appropriate URL
    var printer = getPrinterByPrinterId(printerId);
    var modalIframe = document.getElementById("octo_slack_modal_iframe");
    modalIframe.src = printer.octoprintUrl;

    // Display the modal
    var octoSlackModalContent = document.getElementById("octo_slack_modal_content");
    octoSlackModalContent.style.display = "block";
    var octoSlackModal = document.getElementById("octo_slack_modal");
    octoSlackModal.style.display = "block";

    // Keep the snapshots from updating while the modal is active
    shouldUpdateSnapshots = false;

}

function hideOctoSlackModal() {
    // Stop any large images or streams
    window.stop();

    // Set the modal iframe source to be the appropriate URL
    var modalIframe = document.getElementById("octo_slack_modal_iframe");
    modalIframe.src = "about:blank";

    // Display the modal
    var octoSlackModalContent = document.getElementById("octo_slack_modal_content");
    octoSlackModalContent.style.display = "none";
    var octoSlackModal = document.getElementById("octo_slack_modal");
    octoSlackModal.style.display = "none";

    // Keep the snapshots from updating while the modal is active
    shouldUpdateSnapshots = true;
}

function displaySnapshotModal(printerId) {
    // Rotate the container to match the set rotation of the static snapshot
    var snapshot = document.getElementById("snapshot_" + printerId);
    var angle = snapshot.title; //Title contains angle
    var modalContent = document.getElementById("snapshot_modal_content");
    modalContent.style.webkitTransform = "rotate("+angle+"deg)";

    // Set the modal image source to be the appropriate webcam feed
    var printer = getPrinterByPrinterId(printerId);
    var modalImage = document.getElementById("snapshot_modal_image");
    modalImage.src = printer.octoprintWebcamLiveUrl;

    // Display the modal
    var snapshotModal = document.getElementById("snapshot_modal");
    snapshotModal.style.display = "block";
    modalContent.style.display = "inline-block";

    // Keep the snapshots from updating while the modal is active
    shouldUpdateSnapshots = false;
}

function hideSnapshotModal() {
    // Stop any large images or streams
    window.stop();
    
    var modalImage = document.getElementById("snapshot_modal_image");
    modalImage.src = "img/offline.png";

    // Display the modal
    var snapshotModal = document.getElementById("snapshot_modal");
    snapshotModal.style.display = "none";
    var modalContent = document.getElementById("snapshot_modal_content");
    modalContent.style.display = "none";

    // Keep the snapshots from updating while the modal is active
    shouldUpdateSnapshots = true;
}

function createSecondLevelObjectEventListeners() {
    window.onclick = function(event) {
        var clickedObject = event.target;

        /* ACTIVE SECOND-LEVEL OBJECT */
        if (activeSecondLevelObject !== null &&
            clickedObject !== activeSecondLevelObject &&
            !$.contains(activeSecondLevelObject, clickedObject) &&
            clickedObject !== activeSecondLevelController)
        {
            activeSecondLevelObject.style.display = "none";
            activeSecondLevelObject = null;
            activeSecondLevelController = null;

            if (clickedObject.id == "snapshot_modal") {
                hideSnapshotModal();
            }
            else if(clickedObject.id == "octo_slack_modal") {
                hideOctoSlackModal();
            }
        }
        /* BUTTONS */
        else if (clickedObject.className.includes("settings_icon")) {
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
        else if (clickedObject.className.includes("info_icon")) {
            var printerId = event.target.id.replace("info_icon", "");
            var overlay = document.getElementById("info_overlay" + printerId);

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
        /* MODALS */
        // This is a button, but the controller is unclickable while it is up.
        // It counts as a modal
        else if (clickedObject.className.includes("printer_icon")) {
            var printerId = event.target.id.replace("printer_icon_", "");
            activeSecondLevelObject = document.getElementById("octo_slack_modal_content");
            activeSecondLevelController = clickedObject;
            displayOctoSlackModal(Number(printerId));
        }
        else if (clickedObject.className.includes("snapshot")) {
            var printerId = event.target.id.replace("snapshot_", "");
            activeSecondLevelObject = document.getElementById("snapshot_modal_content");
            activeSecondLevelController = clickedObject;
            displaySnapshotModal(Number(printerId));
        }
    };
}

function updateSnapshotViews() {
    for (var printer in printers) {
        var printerModule = printers[printer].printerModule;
        printerModule.updateSnapshotView();
    }
}

// http://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
String.prototype.toHHMMSS = function() {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
};

String.prototype.toHHMM = function() {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    return hours+':'+minutes;
};
