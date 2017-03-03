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
    infoOverlay.className = "overlay";
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
    infoOverlay.appendChild(overlayContent);
    overlayContent.appendChild(link1);
    overlayContent.appendChild(link2);
    overlayContent.appendChild(link3);
    overlayContent.appendChild(link4);

    // Display them
    //document.getElementById(parent_id).appendChild(infoOverlay);
    return infoOverlay;
}

function createSettingsOverlay(id) {
    // Create elements
    var settingsOverlay = document.createElement("DIV");
    settingsOverlay.className = "overlay";
    settingsOverlay.id = "settings_overlay" + id;

    var overlayContent = document.createElement("DIV");
    overlayContent.className = "settings_overlay_content";

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
    settingsOverlay.appendChild(overlayContent);
    overlayContent.appendChild(link1);
    overlayContent.appendChild(link2);
    overlayContent.appendChild(link3);
    overlayContent.appendChild(link4);

    // Display them
    //document.getElementById(parent_id).appendChild(infoOverlay);
    return settingsOverlay;
}

function createOctoSlackModal() {
    // Create elements
    var octoSlackModal = document.getElementById("octo_slack_modal");

    var modalContent = document.createElement("DIV");
    modalContent.className = "octo_slack_modal_content";
    octoSlackModal.appendChild(modalContent);

    var modalHeader = document.createElement("DIV");
    modalHeader.className = "modal_header";

    var modalHeaderTitle = document.createElement("H2");
    var mhtNode = document.createTextNode("Modal Header");
    modalHeaderTitle.appendChild(mhtNode);
    modalHeader.appendChild(modalHeaderTitle);

    // Modal body creation
    var modalBody = document.createElement("DIV");
    var p = document.createElement("P");
    var pText = document.createTextNode("Some text in the Modal Body");
    p.appendChild(pText);
    modalBody.appendChild(p);

    //Modal footer creation
    var modalFooter = document.createElement("DIV");
    modalFooter.className = "modal_footer";

    var modalFooterText = document.createElement("H3");
    var mftText = document.createTextNode("Modal Footer");
    modalFooterText.appendChild(mftText);
    modalFooter.appendChild(modalFooterText);

    // Structure them
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);

    // Set up the click event for the modal
    $(".printer_icon").click(function(){
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
    snapshotModal.appendChild(modalContent);

    var snapshotImage = document.createElement("IMG");
    snapshotImage.id = "snapshot_modal_image";
    snapshotImage.src = "img/offline.png";

    modalContent.appendChild(snapshotImage);
}

function displaySnapshotModal(printer_id) {
    var modalContent = document.getElementById("snapshot_modal_image");
    var printer = getPrinterById(printer_id);
    modalContent.src = printer.octoprintWebcamLiveUrl;

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
