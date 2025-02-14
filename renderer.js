$(async () => {
    try {
        let check = await window.api.prepareDb(window.constants.defaultDB);
        if (check==true) $("#prepared-db").html("Database connesso");
        else $("#prepared-db").html("Connessione fallita");
    }
    catch (error) {
        $("#prepared-db").html("Connessione fallita");
        window.api.printLog(error)
    }

    let selected = window.constants.defaultTable;
    let result = await window.api.fetchDb(`SELECT * FROM ${selected}`)
    if (result.length==0) {
        $("#db-viewer").html(`La tabella ${selected} non ha record`)
        $("#record-table").remove()
        return
    }
    $("#db-viewer").html(`Ecco tutti i record della tabella ${selected}:`)
    let dbFields = Object.keys(result[0])
    let tablePieces = ["<table id='record-table'>", "<thead>", "<tr>"]
    jQuery.each(dbFields, function(index, value) {
        tablePieces.push(`<th>${value}</th>`)
    })
    tablePieces.push("</tr>")
    tablePieces.push("</thead>")
    tablePieces.push("<tbody>")
    jQuery.each(result, function(indexR, valueR) {
        tablePieces.push("<tr>")
        jQuery.each(dbFields, function(indexD, valueD) {
            tablePieces.push(`<td>${valueR[valueD]}</td>`)
        })
        tablePieces.push("</tr>")
    })
    tablePieces.push("</tbody>")
    tablePieces.push("</table>")
    $("#db-viewer").append(tablePieces.join(" "))

    $("#record-table").DataTable({
        scrollY: $("#db-box").height(),
        scrollX: $(document).width(),
    })
    
    window.api.setTablesMenu()
})

$("#select-db").on("click", async () => {
    let filePath = await window.api.selectFile("sql")
    $("#db-label").html(filePath)
    $("#prepare-db").removeAttr("disabled")
})

$("#prepare-db").on("click", async () => {
    try {
        let result = await window.api.prepareDb($("#db-label").html());
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
    let tablePieces = ["<table id='record-table'>", "<thead>", "<tr>"]
    jQuery.each(dbFields, function(index, value) {
        tablePieces.push(`<th>${value}</th>`)
    })
    tablePieces.push("</tr>")
    tablePieces.push("</thead>")
    tablePieces.push("<tbody>")
    jQuery.each(result, function(indexR, valueR) {
        tablePieces.push("<tr>")
        jQuery.each(dbFields, function(indexD, valueD) {
            tablePieces.push(`<td>${valueR[valueD]}</td>`)
        })
        tablePieces.push("</tr>")
    })
    tablePieces.push("</tbody>")
    tablePieces.push("</table>")
    $("#db-viewer").append(tablePieces.join(" "))

    $("#record-table").DataTable({
        scrollY: $("#db-box").height(),
        scrollX: $(document).width(),
    })
})