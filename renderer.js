/**
 * Display all records of given table on page
 * @param {String} table name of table
 * @returns {void}
 */
async function displayTable(table) {
    $("#record-table").remove()

    let result = await window.api.fetchDb(`SELECT * FROM ${table}`)
    if (result.length==0) {
        $("#db-viewer").html(`La tabella ${selected} non ha record`)
        $("#record-table").remove()
        return
    }
    $("#db-viewer").html(`Ecco tutti i record della tabella ${table}:`)
    let dbFields = Object.keys(result[0])
    let tablePieces = ["<table id='record-table' class='hover order-column'>", "<thead>", "<tr>"]
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
        paging: false,
    })
}

/**
 * When page is opened, connect to default database and display default table
 */
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
    await displayTable(selected)
    
    window.api.setTablesMenu()
})

/**
 * When process sends the name of a table, display table's records on page
 */
window.api.onDisplayTable((value) => {
    displayTable(value)
})