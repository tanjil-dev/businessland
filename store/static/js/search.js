// $(document).ready(function () {
//     $('#search').keyup(function () {
//         $('result').html('');
//         var searchField = $('#search').val();
//         var expression = new RegExp(searchField, "i");
//         $.ajax({
//             url: search + "?partial_data=" + searchField.trim(),
//             type: 'get',
//             dataType: "json"
//         }).done(function (res) {
//             console.log(res.data);
//             for (i = 0; i < res.data.length; i++) {
//                 $('#result').val(res.data[i]);
//                  // $('#result').append('<li class="dropdown-item">' + toString(res.data[i]) + '</li>');
//
//             }
//
//         })
//     });
// });


// $(document).ready(function () {
//     $(function () {
//         $("#search").autocomplete({
//             source: function (request, response) {
//                 var source = [];
//                 var input_val = $("#" + search).val();
//
//                 $.ajax({
//                     url: GET_API_URL + "?partial_data=" + input_val.trim(),
//                     type: 'GET',
//                     dataType: "json"
//                 }).done(function (res) {
//                     for (var i = 0; i < res.data.length; i++) {
//                         source.push(res.data[i].suggestion);
//                     }
//
//                     response(source);
//                 });
//             },
//             minLength: 1,
//             select: function (event, ui) {
//                 event.preventDefault();
//                 var sp = ui.item.value.split("-");
//                 $("#search").val(sp[0].trim());
//                 console.log(sp[0].trim());
//             }
//         });
//     });
// });

$(document).ready(function () {
    $('#searchinput').autocomplete({
        source: search

    });
    console.log(this.source)
});