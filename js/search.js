/// <reference path="jquery-3.3.1.min.js" />
/// <reference path="itunes.countries.js" />

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

		// $.getJSON(uri, function (data) {
		var data = get_json(id, c);

		// Get the country of the review
		var country = get_country_from_uri(data.feed.id.label);

		// At least one review
		if (data.feed.entry) {
			var entries = data.feed.entry;

			// Multiple reviews
			if ($.isArray(entries)) {
				for (entry in entries) {
					reviews.push(entry);
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

};

$(document).ready(function () {
	$("#search-text").keypress(function (event) {

		var key = event.keyCode || event.which;

		if (key === 13) {
			// Enter was clicked... search time
			var id = $("#search-text").val();

			var reviews = get_reviews(id);

			display_reviews(reviews);
		}

	});
});
