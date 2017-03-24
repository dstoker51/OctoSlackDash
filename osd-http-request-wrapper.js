"use strict()";
var server_url = "https://studarin.ngrok.io/";
var server_printer_url = "https://studarin.ngrok.io/printer";

function httpRequest(printer, command_object) {
    var serializable_object = {
        "printer_id" : String(printer.id),
        "commands": command_object
    };
    var json = JSON.stringify(serializable_object);
    //$.get(URL,data,function(data,status,xhr),dataType)
    //$.post(URL,data,function(data,status,xhr),dataType)

    $.ajax({
        url:server_printer_url,
        type:"POST",
        data:json,
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(data, status) {
            // var jsonObject = JSON.stringify(data);
            // showResponse(jsonObject, status);

            var response = data.payload; // Send only the data.
            var printer = getPrinterByPrinterId(data.printer_id);
            printer.printerModule.updatePrinterStatus(response);
        }
    }).fail(function(data, status) {
        var received_error = $.parseJSON(data.responseText);
        alert(data.status + ": " + received_error.message);
        // alert(showResponse(data, status));
    });
}

function showResponse(data, status) {
    alert("Data: " + data + "\nStatus: " + status);
}
