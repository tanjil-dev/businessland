var updateBtns = document.getElementsByClassName('update-cart')

for (var i = 0; i < updateBtns.length; i++) {
    updateBtns[i].addEventListener('click', function () {
        var productId = this.dataset.product
        var action = this.dataset.action
        console.log('productID:', productId, 'action:', action)

        console.log('USER:', user)
        if (user === 'AnonymousUser') {
            addCookieItem(productId, action)
        } else {
            updateUserOrder(productId, action)
        }
    })
}

function addCookieItem(productId, action) {
    console.log('Not logged in..')
    if (action == 'add') {
        if (cart[productId] == undefined) {
            cart[productId] = {'quantity': 1}
        } else {
            cart[productId]['quantity'] += 1
        }
    }

    if (action == 'remove') {
        cart[productId]['quantity'] -= 1

        if (cart[productId]['quantity'] <= 0) {
            console.log('Remove Item')
            delete cart[productId]
        }
    }
    console.log('Cart:', cart)
    document.cookie = 'cart=' + JSON.stringify(cart) + ";domain=;path=/"
    location.reload()

}

function updateUserOrder(productId, action) {
    console.log('User is logged in, sending data..')

    var url = '/update_item/'

    fetch(url, {
        method: 'POST',
        headers: {
            'content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({'productId': productId, 'action': action})
    })

        .then((response) => {
            return response.json()
        })

        .then((data) => {
            console.log('data:', data)
            location.reload()
        })
}


$(function () {
    /*make the master div has a static height to prevent it from disppearing while the master img is feading in,
    this step is important if you use a fadeIn duration for the master img more than 1s, but if you use a duration less than 1s
    you don't need to make the height of the master div is static, and it is preferred to make the duration less than 1s to prevent the
    user to choose 2 images at the same time, so the implementation of the code will be faster than the user selection*/
    $(".master").css({
        height: $(".master img").height() + 13
    });

    //make the width of the thumbnails images is dynamic
    var imagesNumber = $(".thumbnails").children().length,
        marginBetweenImages = 1,
        totalMargins = marginBetweenImages * (imagesNumber - 1),
        imageWidth = (100 - totalMargins) / (imagesNumber);

    $(".thumbnails img").css({
        width: imageWidth + "%",
        marginRight: marginBetweenImages + "%"
    });


    //remove the active class from all thumbnails images and add it to the selected one, then add this selected as the master image in the master div
    $(".thumbnails img").on("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".master img").hide().attr("src", $(this).attr("src")).fadeIn(300);
    });


    //use the chevron left and right to select images and translate between them
    $(".master .fas").on("click", function () {
        if ($(this).hasClass("fa-chevron-left")) {
            if ($(".thumbnails img.active").is(":first-child")) {
                $(".thumbnails img:last-child").click();
            } else {
                $(".thumbnails img.active").prev().click();
            }
        } else {
            if ($(".thumbnails img.active").is(":last-child")) {
                $(".thumbnails img:first-child").click();
            } else {
                $(".thumbnails img.active").next().click();
            }
        }
    })
})


/* sticky header */

// var height = $('.navbar').height();
//
// $(window).scroll(function () {
//     if ($(this).scrollTop() > height) {
//         $('.navbar').addClass('fixed');
//     } else {
//         $('.navbar').removeClass('fixed');
//     }
// });
//
// $('.carousel').carousel({
//     interval: 1000 * 2
// });

// $(document).ready(function () {
//     $('#search').keyup(function () {
//         $('result').html('');
//         var searchField = $('search').val();
//         var expression = new RegExp(searchField, "i");
//         $.ajax({
//             url: search + "?partial_data=" + searchField.trim(),
//             type: 'get',
//             dataType: "json"
//         }).each(data, function (key, value) {
//             if (value.name.search(expression) != -1 || value.location.search(expression) != -1) {
//                 $('#result').append('<li class="list-group-item"><img src="" ' + value.image + ' height="40" width="40" class="img-thumbnail" /> ' + value.name + ' | <span class="text-muted">'+value.location+'</span></li>');
//             }
//         })
//     });
// });

$(document).ready(function () {
    $(function () {
        $("#" + input_id).autocomplete({
            source: function (request, response) {
                var source = [];
                var input_val = $("#" + input_id).val();

                $.ajax({
                    url: search + "?partial_data=" + input_val,
                    type: 'get',
                    dataType: "json"
                }).done(function (res) {
                    for (var i = 0; i < res.data.length; i++) {
                        source.push(res.data[i].suggestion);
                    }

                    response(source);
                });

            },
            minLength: 1,
            select: function (event, ui) {
                event.preventDefault();
                var sp = ui.item.value.split("-");
                $("#" + input_id).val(sp[0].trim());
                console.log(sp[0].trim());
            }
        });
    });
});