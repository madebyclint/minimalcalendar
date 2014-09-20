(function($) {
    'use strict';

    $('#month').text(moment().format('MMM'));    
    $('#year').text(moment().format('YY'));

    var buildDays = function(el) {
        var days = moment().daysInMonth(),
            dayList = '',
            today = moment().date();
        if(el === 'li') {
            dayList += '<ul>';
            for(var i = 1; i <= days; i ++) {
                if(i !== today) {
                    dayList += '<' + el + ' class="day">' + i + '</' + el + '>'; 
                } else {
                    dayList += '<' + el + ' class="day today">' + i + '</' + el + '>'; 
                }
            }
            dayList += '</ul>'
        }
        return dayList;
    }
    // var today = moment().weekday();
    $('#days').html(buildDays('li'));

}(jQuery));
