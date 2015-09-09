 $(function(){
	$(document).on('focus', 'div.form-group-options div.input-group-option:last-child input', function(){
		var sInputGroupHtml = $(this).parent().html();
		var sInputGroupClasses = $(this).parent().attr('class');
		$(this).parent().parent().append('<div class="'+sInputGroupClasses+'">'+sInputGroupHtml+'</div>');
	});
	
	$(document).on('click', 'div.form-group-options .input-group-addon-remove', function(){
		$(this).parent().remove();
	});
});

//help!
//add edit trip, and display trips by start date
function addTrip () {
	$('#curr_trips').append('<row id="new_trip"></row>');
	$('#new_trip').append('<div class="col-md-8" id="trip_info">bigCol</div><div class = "col-md-4" id="activities">smCol</div>');
	$('#trip_info').append('<strong><h2>'+$('#destination').val()+'</strong></h2><br>'+ $('#start_date').val() + ' - ' + $('#end_date').val());
	$('#activities').append('<h4>activities goes here</h4>');
};

// var activitiesHTML =
//      '<div class="container">
//           <h4><i>activities</i></h4>
//           <div class="row">
//             <div class="form-group form-group-options col-xs-11 col-sm-8 col-md-4">
//               <div class="input-group input-group-option col-xs-12">
//                 <input type="text" name="option[]" class="form-control" placeholder="what do you want to do?">
//                 <span class="input-group-addon input-group-addon-remove">
//                   <span class="glyphicon glyphicon-remove"></span>
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>';

$(function () {
        $('#datetimepicker6').datetimepicker({
        	format: "MMM Do YYYY",
        	minDate: moment()
        });
        $('#datetimepicker7').datetimepicker({
        	format: "MMM Do YYYY",
            useCurrent: false,
            minDate: moment()
        });
        $("#datetimepicker6").on("dp.change", function (e) {
            $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
        });
        $("#datetimepicker7").on("dp.change", function (e) {
            $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
        });
    });
