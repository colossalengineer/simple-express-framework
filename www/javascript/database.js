async function query(query){
    return await $.ajax({
        method: "POST",
        data: {
            query: query
        },
        url: "/query"
    })
}