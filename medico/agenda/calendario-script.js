var monthName = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

/**
var now = new Date();
var day = now.getDate();
var month = now.getMonth();
var currentMonth = month;
var year = now.getFullYear();

initCalendar();
console.log(startDay());

function initCalendar() {
    $("#month").text(monthName[month]);
    $("#year").text(year);

    $(".item_day").remove();
    for (let i =; getTotalDays(month); i++) {
        $(.)
    }
}

function getNextMonth() {
    if (month !== 11) {
        month++;
    } else {
        year++;
        month = 0;
    }
    initCalendar;
}

function getPrevMonth() {
    if (month !== 0) {
        month--;
    } else {
        year--;
        month = 11;
    }
    initCalendar();
}

function startDay() {
    var start = new Date(year, month, 1);
    return((start.getDate()-1)===-1) ? 6 : start.getDate;
}

function leapMonth() {
    return ((year % 400 === 0) || (year % 4 === 0) && (year & 100 !=== 0));
}

function getTotalDays() {
    if (month === -1) month = 11;
    if (month == 3 || month == 5 || month == 8 || month == 10) {
        return 31;
    } else if (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month = 11) {
        return 30;
    } else {
        return leapMonth() ? 29 : 28;
    }
}

$("#Next_Month").click(function()) {
    getNextMonth();
}

*/