function format_date(date) {
    return (date.getMonth() + 1) +
        "/" + date.getDate() +
        "/" + date.getFullYear();
}

function working_days(fromDate, toDate) {
    if (!fromDate || isNaN(fromDate) || this < fromDate) {
        return -1;
    }
    if (!toDate || isNaN(toDate) || this < toDate) {
        return -1;
    }

    // clone date to avoid messing up original date and time
    var frD = new Date(fromDate.getTime()),
        toD = new Date(toDate.getTime()),
        numOfWorkingDays = 1;

    // reset time portion
    frD.setHours(0, 0, 0, 0);
    toD.setHours(0, 0, 0, 0);

    while (frD < toD) {
        frD.setDate(frD.getDate() + 1);
        var day = frD.getDay();
        if (day != 0 && day != 6) {
            numOfWorkingDays++;
        }
    }
    return numOfWorkingDays - 1;
}

const update_letter = async (date) => {
    if (date.getDay() == 6 || date.getDay() == 0) {
        letter.innerHTML = "∅";
        return;
    }

    letter = document.getElementById("letter");
    letter_symbols = ["A", "B", "C", "D", "E", "F"]
    one_day = 24 * 60 * 60 * 1000;

    start = new Date("8/28/19");
    school_days = working_days(start, date);

    resposnse = await fetch("/days_off.json")
    days_off = await resposnse.json();

    for (let day of days_off) {
        if (format_date(new Date(day)) == format_date(date)) {
            letter.innerHTML = "∅";
            return;
        } else if (new Date(day) < date) {
            school_days--;
        }
    }

    letter.innerHTML = letter_symbols[school_days % 6];

    ga('send', {
        hitType: 'event',
        eventCategory: 'calculate',
        eventAction: 'calculateDate',
        eventLabel: format_date(date)
    });
}

function yesterday() {
    date = new Date(document.getElementById("date").innerHTML);
    date.setDate(date.getDate() - 1);
    update_letter(date);
    document.getElementById("date").innerHTML = format_date(date);
    ga('send', {
        hitType: 'event',
        eventCategory: 'view',
        eventAction: 'goto',
        eventLabel: 'yesterday'
    });
}

function tomorrow() {
    date = new Date(document.getElementById("date").innerHTML);
    date.setDate(date.getDate() + 1);
    update_letter(date);
    document.getElementById("date").innerHTML = format_date(date);
    ga('send', {
        hitType: 'event',
        eventCategory: 'view',
        eventAction: 'goto',
        eventLabel: 'tomorrow'
    });
}

update_letter(new Date());
document.getElementById("date").innerHTML = format_date(new Date());
