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

    start = new Date("9/8/20");
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

function firstLessThan(arr, val) {
    let count = 0;
    for (let day of arr) {
        if (val < new Date(day))
            return count;
        count++;
    }
    return count;
}

function datediff(first, second) {
    return Math.round((second-first)/(1000*60*60*24));
}

async function otherStuff(today) {
    resposnse = await fetch("/days_off.json")
    days_off = await resposnse.json();

    const the_end = new Date('June 15, 2021');
    const the_bad = new Date('December 15, 2020');
    const days_till_the_end = 180 - (working_days(new Date("9/8/20"), today) - firstLessThan(days_off, today));
    document.getElementById("other").setAttribute('tbd', datediff(today, the_bad) + 1);
    document.getElementById("other").setAttribute('end', days_till_the_end);
}

const today = new Date()

update_letter(today);
document.getElementById("date").innerHTML = format_date(today);

otherStuff(today)
