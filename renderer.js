var currentOption

function printLog(message) {window.api.printLog(message)}

function img_pdf(value) {
    $("#form-file").show()
    $("#form-db").hide()
    switch (value) {
        case "img":
            $("#select-file").html("Scegli immagine")
            $("#file-label").html("Nessuna immagine selezionata")
            $("#view-file").html("Visualizza immagine")
            break
        case "pdf":
            $("#select-file").html("Scegli PDF")
            $("#file-label").html("Nessun PDF selezionato")
            $("#view-file").html("Visualizza PDF")
            break
    }
    $("#view-file").attr("disabled", true)
}

$("#info").html(`Questa app usa Chrome (versione ${versions.chrome()}), Node.js (versione ${versions.node()}) ed Electron (versione ${versions.electron()})`)

$(".dropdown-link").on("click", function(event) {
    currentOption = event.target.id
    switch (currentOption) {
        case "img":
        case "pdf":
            img_pdf(currentOption)
            break;
        case "sql":
            $("#form-file").hide()
            $("#form-db").show()
            break;
    }
})

$(document).on("click", function(event) {
    let clicked = event.target;
    if (clicked.className!='dropbtn') $("#myDropdown").hide();
    else $("#myDropdown").show();
})

$("#select-file").on("click", async() => {
    let filePath = await window.api.selectFile(currentOption)
    $("#file-label").html(filePath)
    $("#view-file").removeAttr("disabled")
})

$("#view-file").on("click", function() {
    $(".box").hide()
    let filePath = $("#file-label").html()
    $(`#${currentOption}-box`).show()
    $(`#${currentOption}-label`).html(`Ecco ${
        (currentOption=="img") ? "l'immagine" : "il documento"
    } ${filePath}`)
    $(`#${currentOption}-viewer`).attr("src", filePath)
})

$("#select-db").on("click", async () => {
    let filePath = await window.api.selectFile(currentOption)
    $("#db-label").html(filePath)
    $("#prepare-db").removeAttr("disabled")
})

$("#prepare-db").on("click", async () => {
    try {
        let result = await window.api.prepareDb();
        if (result==true) $("#prepared-db").html("Database connesso");
        else $("#prepared-db").html("Connessione fallita");
    }
    catch (error) {
        $("#prepared-db").html("Connessione fallita")
    }

    try {
        let result = await window.api.fetchDb("SELECT name FROM sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%'");
        $("#label-db").show()
        $("#choose-table").show()
        $("#view-records").show()
        jQuery.each(result, function(index, value) {
            let name = value["name"]
            $("#choose-table").append(`<option value="${name}">${name}</option>`)
        })
    }
    catch (error) {
        $("#sub").html("Query fallita")
    }
})

$("#view-records").on("click", async () => {
    $(".box").hide()
    $("#db-box").show()
    let selected = $("#choose-table").find(":selected").text()
    let result = await window.api.fetchDb(`SELECT * FROM ${selected}`)
    if (result.length==0) {
        $("#db-viewer").html(`La tabella ${selected} non ha record`)
        $("#record-table").remove()
        return
    }
    $("#db-viewer").html(`Ecco tutti i record della tabella ${selected}:`)
    let dbFields = Object.keys(result[0])
    let tablePieces = ["<table id='record-table'>", "<tr>"]
    jQuery.each(dbFields, function(index, value) {
        tablePieces.push(`<th>${value}</th>`)
    })
    tablePieces.push("</tr>")
    jQuery.each(result, function(indexR, valueR) {
        tablePieces.push("<tr>")
        jQuery.each(dbFields, function(indexD, valueD) {
            tablePieces.push(`<td>${valueR[valueD]}</td>`)
        })
        tablePieces.push("</tr>")
    })
    tablePieces.push("</table>")
    $("#db-viewer").append(tablePieces.join(" "))
})