
// Appending Json VAlue
$(document).ready(function () {

	var Item = [];

	$.getJSON('https://api.jsonbin.io/b/5e95c47a2940c704e1d7d944', function (data) {
		$.each(data.items, function (i, f) {
			var tblRow =

				"<div class='col-lg-4 col-md-6 mb-4'><div class='card h-100'><div class='card-img-top'><img class='img-responsive' src='https://d1xbedroeo1z0l.cloudfront.net/fit-in/400x600/Myntra.com/XRVOS_myn_8809813_1100x1100.jpg' alt='" + f.name + "' title='" + f.name + "' /></div><div class='card-body'><h4 class='card-Dt'>" + f.name + "</h4><h5 class='card-Dt'><b>Rs. " + f.price.actual + "</b>&nbsp;&nbsp;Rs. " + f.price.display + "</h5><h6 class='card-Dt'>" + f.discount + "% Off</h6></div><div class='card-footer'><button onclick='addtocart(" + f.id + ")' class='Add-Kart' id='ADD_Kt" + f.id + "' data-name='" + f.name + "' data-price='" + f.price.actual + "'>Add to Cart</button></div></div>"

			$(tblRow).appendTo('#Items-data');
		});

	});

});


// Shopping Cart

var shoppingCart = (function () {
	// Private methods and propeties
	cart = [];

	// Constructor
	function Item(name, price, count) {
		this.name = name;
		this.price = price;
		this.count = count;
	}

	// Save cart
	function saveCart() {
		sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
	}

	// Load cart
	function loadCart() {
		cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
	}
	if (sessionStorage.getItem("shoppingCart") != null) {
		loadCart();
	}

	// Public methods and propeties
	var obj = {};

	// Add to cart
	obj.addItemToCart = function (name, price, count) {
		for (var item in cart) {
			if (cart[item].name == name) {
				cart[item].count++;
				saveCart();
				return;
			}
		}
		var item = new Item(name, price, count);
		cart.push(item);
		saveCart();
	}
	// Set count from item
	obj.setCountForItem = function (name, count) {
		for (var i in cart) {
			if (cart[i].name === name) {
				cart[i].count = count;
				break;
			}
		}
	};
	// Remove item from cart
	obj.removeItemFromCart = function (name) {
		for (var item in cart) {
			if (cart[item].name === name) {
				cart[item].count--;
				if (cart[item].count === 0) {
					cart.splice(item, 1);
				}
				break;
			}
		}
		saveCart();
	}

	// Remove all items from cart
	obj.removeItemFromCartAll = function (name) {
		for (var item in cart) {
			if (cart[item].name === name) {
				cart.splice(item, 1);
				break;
			}
		}
		saveCart();
	}

	// Clear cart
	obj.clearCart = function () {
		cart = [];
		saveCart();
	}

	// Count cart 
	obj.totalCount = function () {
		var totalCount = 0;
		for (var item in cart) {
			totalCount += cart[item].count;
		}
		return totalCount;
	}

	// Total cart
	obj.totalCart = function () {
		var totalCart = 0;
		for (var item in cart) {
			totalCart += cart[item].price * cart[item].count;
		}
		return Number(totalCart.toFixed(2));
	}

	// List cart
	obj.listCart = function (name) {
		var cartCopy = [];
		for (i in cart) {
			item = cart[i];
			itemCopy = {};
			for (p in item) {
				itemCopy[p] = item[p];

			}
			itemCopy.total = Number(item.price * item.count).toFixed(2);
			cartCopy.push(itemCopy)
		}
		return cartCopy;
	}

	return obj;
})();

// Add item
function addtocart(id) {
	$(id).each(function () {
		var name = $('#ADD_Kt' + id).data('name');
		var price = Number($('#ADD_Kt' + id).data('price'));
		shoppingCart.addItemToCart(name, price, 1);
	});
	displayCart();
}


// Clear items
$('.clear-cart').click(function () {
	shoppingCart.clearCart();
	displayCart();
});


function displayCart() {
	var cartArray = shoppingCart.listCart();
	var output = "";
	for (var i in cartArray) {
		output += "<div class='td-12'> <div class='td-cnt'>" +
			"<span class='col4'><span class='Cart-Img'><img class='img-responsive' src='https://d1xbedroeo1z0l.cloudfront.net/fit-in/400x600/Myntra.com/XRVOS_myn_8809813_1100x1100.jpg' alt='Img'></span></span>" +
			"<span class='col6'><span class='n-6'>" + cartArray[i].name + "</span>" +
			"<span class='M-prc'><b>Rs. " + cartArray[i].price + "</b><span class='Mrp'>Rs. 900</span><span class='Disct'>64% Off</span></span>" +
			"<span class='td-min'><span class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name='" + cartArray[i].name + "'>-</button>" +
			"<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>" +
			"<button class='plus-item btn btn-primary input-group-addon' data-name='" + cartArray[i].name + "'>+</button></span></span>" +
			"<span class='td-min td-20'><button class='delete-item btn btn-danger' data-name='" + cartArray[i].name + "'>X</button></span>"

			+
			"<span class='Total-H6'>Total: Rs." + cartArray[i].total + "</span>" +
			"</span></div></div>";
	}

	$('.show-cart').html(output);
	$('.total-cart').html(shoppingCart.totalCart());
	$('.total-count').html(shoppingCart.totalCount());
}

// Delete item button

$('.show-cart').on("click", ".delete-item", function (event) {
	var name = $(this).data('name')
	shoppingCart.removeItemFromCartAll(name);
	displayCart();
})


// -1
$('.show-cart').on("click", ".minus-item", function (event) {
	var name = $(this).data('name')
	shoppingCart.removeItemFromCart(name);
	displayCart();
})
// +1
$('.show-cart').on("click", ".plus-item", function (event) {
	var name = $(this).data('name')
	shoppingCart.addItemToCart(name);
	displayCart();
})

// Item count input
$('.show-cart').on("change", ".item-count", function (event) {
	var name = $(this).data('name');
	var count = Number($(this).val());
	shoppingCart.setCountForItem(name, count);
	displayCart();
});

displayCart();

// Mobile Header ---------

$(".nvg_tb").click(function () {
	var e = $(this).attr("data_id");
	$(".nvg_tb").removeClass("Act-tab");
	$(".Nvgtb").removeClass("Show");
	$(this).addClass("Act-tab");
	$("#" + e).addClass("Show");
})

$(".close.Flr_cls, .nav-link").click(function () {
	$(".nvg_tb").removeClass("Act-tab");
	$(".Nvgtb").removeClass("Show");
})