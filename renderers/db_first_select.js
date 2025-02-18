$("#select_db").on("click", async () => {
    let selected = await window.api.selectFile("sql")
    $("label[for*='select_db']").html(selected)
    $("#send_db").removeAttr("disabled")
})

$("#send_db").on("click", () => {
    window.api.changePage($("label[for*='select_db']").html())
})