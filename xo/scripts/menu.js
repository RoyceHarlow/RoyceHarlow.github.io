$.extend({
	redirectGet: function(location, args) {
		var form = "";
		
		$.each(args, function(key, value) {
			form += '<input type="hidden" name="' + key + '" value="' + value + '">';
		});

		$('<form action="' + location + '" method="GET">' + form + '</form>').appendTo($(document.body)).submit();
	}
});

$(document).ready(function() {
	$("#options").hide();

	$("#start-button").click(function() {
		$.redirectGet("game.html", {
			size: $("#size-slider").slider("option", "value"),
			ai: $("#ai-check").is(":checked") ? $("#ai-slider").slider("option", "value") : 0
		});
	});

	$("#options-button").click(function() {
		$("#options").toggle();
	});

	$("#ai-check").click(function() {
		if($(this).is(":checked")) $("#ai-slider").slider("option", "disabled", false);
		else $("#ai-slider").slider("option", "disabled", true);
	});

	$("#ai-check").attr("checked", true);
});
