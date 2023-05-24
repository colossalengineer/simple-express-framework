async function query(query){
    return await $.ajax({
        method: "POST",
        data: JSON.stringify({
            query: query
        }),
        url: "/query"
    })
}