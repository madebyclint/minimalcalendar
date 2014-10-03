(function($) {
    'use strict';

    var today = moment();
    var month = today.month();
    var thisMonth = today.month(month);
    var activeday = ''; 

    var buildDays = function(el) {
        var days = thisMonth.daysInMonth(),
            dayList = '';
        if(el === 'li') {
            dayList += '<ul>';
            for(var i = 1; i <= days; i ++) {
                if(i !== activeday) {
                    dayList += '<' + el + ' class="day">' + i + '</' + el + '>'; 
                } else {
                    dayList += '<' + el + ' class="day activeday">' + i + '</' + el + '>'; 
                }
            }
            dayList += '</ul>';
        }
        return dayList;
    };

    var buildWeek = function(el) {
        var days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            dayList = '',
            arrPos = days.indexOf(thisMonth.startOf('month').format('dd'));
        if(el === 'li') {
            dayList += '<ul>';
            for(var i = 1, len = $('#days').find('li').length; i <= len; i ++) { 
                if(i !== activeday) {
                    // dayList += '<' + el + ' class="day">' + days[arrPos] + '</' + el + '>'; 
                    if(arrPos === 0 || arrPos === 6) {
                        dayList += '<' + el + ' class="day dot">' + '•' + '</' + el + '>'; 
                    } else {
                        dayList += '<' + el + ' class="day">' + '•' + '</' + el + '>'; 
                    }
                } else {
                    dayList += '<' + el + ' class="day activeday">' + days[arrPos] + '</' + el + '>'; 
                }
                arrPos++;
                if(arrPos >= 7) {
                    arrPos = arrPos - 7;
                }
            }
            dayList += '</ul>';
        }
        return dayList;
    };

    var setCal = function(month) { 
        if(month + 1 === parseInt(today.format('M'))) {
            activeday = moment().date();
        } else {
            activeday = '';
        }
        thisMonth = moment().month(month);
        $('#month').text(thisMonth.format('MMM'));    
        $('#year').text(thisMonth.format('YY'));
        $('#days').html(buildDays('li'));
        $('#daynames').html(buildWeek('li'));
    };

    setCal(month);

    var buildMonths = function(el) {
        var months = '';
        if(el === 'li') {
            months += '<ul>';
            for(var i = 0; i < 12; i++) {
                if(i === moment().month()) {
                    months += '<' + el + ' class="month activeday"><a href="#">' + moment().month(i).format('MMM') + '</a></' + el + '>';
                } else {
                    months += '<' + el + ' class="month"><a href="#">' + moment().month(i).format('MMM') + '</a></' + el + '>';
                }
                
            }
        }
        months += '</ul>';
        return months;
    };
    $('#months').html(buildMonths('li'));

    $('#months').find('.month').on('click', function(e) {
        setCal($(this).index());
        $('#months').find('.month').removeClass('activeday');
        $(this).addClass('activeday');
    });
}(jQuery));
