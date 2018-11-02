/// <reference path="jquery-3.3.1.min.js" />
/// <reference path="itunes.countries.js" />

/* TODO:
 * Format review card
 * Search using link/name
 * Sort by date, regardless of country
*/

var get_json = function (id, country) {
	var d;

	$.ajax({
		url: "https://itunes.apple.com/" + country + "/rss/customerreviews/id=" + id + "/sortBy=mostRecent/json",
		dataType: "json",
		async: false,
		success: function (data) {
			d = data;
		}
	});

	return d;
};

var get_country_from_uri = function (uri) {
	var country_code = uri.match(/(?<=\/)([a-z][a-z])(?=\/)/g);
	return country_code[0];
};

var get_reviews = function (id) {

	var reviews = [];

	for (var c in countries) {
		// var uri = "https://itunes.apple.com/" + c + "/rss/customerreviews/id=" + id + "/sortBy=mostRecent/json";
		
		var data = get_json(id, c);

		// Something went wrong
		if (!data) {
			continue;
		}

		// Get the country of the review
		var country = get_country_from_uri(data.feed.id.label);

		// At least one review
		if (data.feed.entry) {
			var entries = data.feed.entry;

			// Multiple reviews
			if ($.isArray(entries)) {
				for (e in entries) {
					reviews.push(entries[e]);
				}
			}

			// Only 1 review
			else {
				reviews.push(entries);
			}

		}

	}

	return reviews;
};

var display_reviews = function (reviews) {

	var grid = $("#grid-container");

	grid.empty();

	if (reviews.length === 0) {
		var noResults = $("<h3></h3>").text("No results found.").hide();

		grid.append(noResults);

		noResults.fadeIn();
	}

	// review counter
	var num = 0;

	// row amount
	var row_count = Math.ceil(reviews.length / 3);

	// Iterate through all rows
	for (var row = 0; row < row_count; row++) {

		var row_element = $("<div></div>").addClass("w3-row-padding");

		// Display all reviews for that row
		var i = 0;
		while (i < 3) {
			if (num >= reviews.length)
				break;

			var review = reviews[num];

			var review_container = $("<div></div>").addClass(["w3-third", "w3-container", "w3-margin-bottom"]);

			var review_content = $("<div></div>").addClass(["w3-container", "w3-white"]);

			var name = review.author.name.label;

			var rating = review["im:rating"].label;

			var title = review.title.label;

			var content = review.content.label;

			var p = $("<p></p>").append(name + "\n" + rating + title + content);

			review_content.append(p);

			review_container.append(review_content);

			row_element.append(review_container);

			// Iterate through row member and review count
			i++;
			num++;
		}

		grid.append(row_element);

	}
};

var validate_id = function (id, success, error) {
	// Use USA to test if id is valid
	$.ajax({
		url: "https://itunes.apple.com/lookup?id=" + id + "&callback=?",
		dataType: "jsonp",
		async: false,

		// Success
		success: success,

		// Error
		error: error
	});
};

$(document).ready(function () {
	$("#search-text").keypress(function (event) {

		var key = event.keyCode || event.which;
		
		if (key === 13) {
			// Enter was clicked... search time
			var id = $("#search-text").val();

			var success = function (data) {
				var reviews = get_reviews(id);

				display_reviews(reviews);
			};

			var error = function (e) {
				// Could not find product in US store
				alert("Invalid ID");
				display_reviews([]);
				return;
			};

			validate_id(id, success, error);
		}
	});
});
