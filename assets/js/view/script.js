today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
selectYear = document.getElementById("year");
selectMonth = document.getElementById("month");
monthEvents = [];

months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];


monthAndYear = document.getElementById("monthAndYear");

initialize();

async function initialize(){
    await showEventList(currentMonth);
    console.log(monthEvents);
    await showCalendar(currentMonth, currentYear);
}



async function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    await showEventList(currentMonth);
    await showCalendar(currentMonth, currentYear);
}

async function previous() {
    
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    await showEventList(currentMonth);
    await showCalendar(currentMonth, currentYear);
}

async function jump() {
    
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    await showEventList(currentMonth);
    await showCalendar(currentMonth, currentYear);

}

async function showEventList(month){
    document.getElementById("event-list").innerHTML = "";
    fetch('./assets/js/model/event.json')
    .then((response) => response.json())
    .then((events) => {
        
        for(let event of events.data){
           if(month == new Date(event.begin_date).getMonth()){
            monthEvents.push(event.begin_date);
            eventItem = document.createElement("li");
            var eventDate;
        
            if(eventItem.end_date){
                eventDate = new Date(event.begin_date).getUTCDate() + " - " + new Date(event.end_date).getUTCDate().toString();
            } else {
                eventDate = new Date(event.begin_date).getUTCDate();
            }
        
            eventDescription = document.createTextNode(eventDate + ": " + event.description);
            eventItem.appendChild(eventDescription);
            document.getElementById("event-list").appendChild(eventItem);
        }
       }

    });

}

function showCalendar(month, year) {
    console.log(monthEvents);

    let firstDay = (new Date(year, month)).getDay();

    tbl = document.getElementById("calendar-body");

    tbl.innerHTML = "";

    monthAndYear.innerHTML = "Calendário Acadêmico - " + months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    let date = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                cell = document.createElement("td");
                cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth(month, year)) {
                break;
            }

            else {
                cell = document.createElement("td");
                cellText = document.createTextNode(date);

                for(let event of monthEvents){
                    if(date == new Date(event).getDate()){
                    cell.classList.add("event");
                    }
                }

                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("today");
                } 

                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }


        }

        tbl.appendChild(row);
    }

}


function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}