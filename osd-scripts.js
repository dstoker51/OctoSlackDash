"use strict()";
var printerModuleCount = 0;
var numModulesPerRow = 4;

function updateSnapshotViews(){
    for(i=1; i<=printerModuleCount; i++){
        var snapshot = document.getElementById("snapshot_" + i);
        var copy = snapshot.src;
        snapshot.src = copy;
    }
}

function switchToStream(snapshot) {
    var id = Number(snapshot.id[snapshot.id.length-1]);
    var printer = getPrinterById(id);
    snapshot.src = printer.octoprintWebcamLiveUrl;
    // snapshot.src = "http://155.97.12.12" + id + "/webcam/?action=stream";
}

function switchToSnapshot(snapshot) {
    var id = Number(snapshot.id[snapshot.id.length-1]);
    window.stop();  // This stops the stream so that it doesn't keep running in the background
    var printer = getPrinterById(id);
    snapshot.src = printer.octoprintWebcamSnapshotUrl;
    // snapshot.src = "http://155.97.12.12" + id + "/webcam/?action=snapshot";
}

function createInfoOverlay(id) {
    // Create elements
    var infoOverlay = document.createElement("DIV");
    infoOverlay.className = "overlay info_overlay";
    infoOverlay.id = "info_overlay" + id;

    var overlayContent = document.createElement("DIV");
    overlayContent.className = "info_overlay_content";

    var link1 = document.createElement("A");
    var linkText = document.createTextNode("About");
    link1.appendChild(linkText);
    var link2 = document.createElement("A");
    linkText = document.createTextNode("Services");
    link2.appendChild(linkText);
    var link3 = document.createElement("A");
    linkText = document.createTextNode("Clients");
    link3.appendChild(linkText);
    var link4 = document.createElement("A");
    linkText = document.createTextNode("Contact");
    link4.appendChild(linkText);

    // Structure them
    overlayContent.appendChild(link1);
    overlayContent.appendChild(link2);
    overlayContent.appendChild(link3);
    overlayContent.appendChild(link4);
    infoOverlay.appendChild(overlayContent);

    return infoOverlay;
}

function createSettingsOverlay(id) {
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
        rotateSnapshotLeft90Deg(id);
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
        rotateSnapshotRight90Deg(id);
    };

    // Structure them
    rotateLeft.appendChild(rotateLeftIcon);
    rotateRight.appendChild(rotateRightIcon);
    overlayContent.appendChild(rotateLeft);
    overlayContent.appendChild(rotateRight);
    settingsOverlay.appendChild(overlayContent);

    return settingsOverlay;
}

function rotateSnapshotLeft90Deg(id) {
    // Get the rotation angle stored in the snapshot title tag
    var image = document.getElementById("snapshot_" + id);
    var oldAngle = Number(image.title);
    var newAngle = (oldAngle - 90) % 360;
    image.title = newAngle; /* Store the rotation */

    // TODO make the image fill the container. Resizing the image causes
    // the DOM to resize the container as well, but set sizes on the
    // container doesn't work either because of the responsive bootstrap

    // Perform the rotation
    image.style.webkitTransform = "rotate("+newAngle+"deg)";
}

function rotateSnapshotRight90Deg(id) {
    var image = document.getElementById("snapshot_" + id);
    var oldAngle = Number(image.title);
    var newAngle = (oldAngle + 90) % 360;
    image.title = newAngle; /* Store the rotation */
    image.style.webkitTransform = "rotate("+newAngle+"deg)";
}

function rotateSnapshotToAngle(id, angle) {
    var image = document.getElementById("snapshot_" + id);
    image.style.webkitTransform = "rotate("+angle+"deg)";
}

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
        var printer = getPrinterById(printer_id);
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
    var printer = getPrinterById(printer_id);
    var modalImage = document.getElementById("snapshot_modal_image");
    modalImage.src = printer.octoprintWebcamLiveUrl;

    // Display the modal
    var snapshotModal = document.getElementById("snapshot_modal");
    snapshotModal.style.display = "block";
}

function createWindowEventListeners() {
    //Modals
    // If the user clicks anywhere outside the modal, close it
    window.onclick = function(event) {
        if (event.target.id == "snapshot_modal") {
            var snapshotModal = document.getElementById("snapshot_modal");
            snapshotModal.style.display = "none";
            window.stop();  // This stops the stream so that it doesn't keep running in the background
        }
        else if (event.target.id == "octo_slack_modal") {
            var octoSlackModal = document.getElementById("octo_slack_modal");
            octoSlackModal.style.display = "none";
            window.stop();  // This stops the stream so that it doesn't keep running in the background
        }
    };

    // Set snapshot update interval
    window.setInterval(updateSnapshotViews, 3000);
}
