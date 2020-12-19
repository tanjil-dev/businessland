
    // $('#search').keyup(function () {
    //     $('result').html('');
    //     var searchField = $('#search').val();
    //     var expression = new RegExp(searchField, "i");
    //     $.ajax({
    //         url: search + "?term=" + searchField.trim(),
    //         type: 'get',
    //         dataType: "json"
    //     }).done(function (res) {
    //         console.log(res.data);
    //         for (i = 0; i < res.data.length; i++) {
    //             // $('#result').val(res.data[i]);
    //              $('#result').append('<li style="color: black; background-color: white; border: double;">' + res.data[i] + '</li>');
    //
    //         }
    //
    //     })
    // });


$(document).ready(function () {
    $(function () {
        $("#search").autocomplete({
            source: function (request, response) {
                var source = [];
                var input_val = request.term;
                console.log(search)
                $.ajax({
                    url: search + "?term=" + input_val.trim(),
                    type: 'get',
                    dataType: "json"

                }).done(function (res) {
                    for (var i = 0; i < res.data.length; i++) {
                        source.push(res.data[i]);

                        // $('#result').val(res.data[i]);
                 // source.push('<li style="color: black; background-color: white; border: double;">' + res.data[i] + '</li>');

                    }

                    response(source);
                });
            },
            minLength: 1,
            select: function (event, ui) {
                event.preventDefault();
                var sp = ui.item.value.split("-");
                $("#search").val(sp[0].trim());
                console.log(sp[0].trim());
            }
        });
        // $( "#search" ).autocomplete( "option", "appendTo", "#result" );
    });
});

// $(document).ready(function () {
//     $('#searchinput').autocomplete({
//         source: search
//
//     });
//     console.log(this.source)
// });