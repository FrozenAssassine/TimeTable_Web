class HourItem {
    constructor(from, to) {
      this.from = from;
      this.to = to;
    }
}

var AllHours = [
    new HourItem(8.00, 8.45),
    new HourItem(8.46, 9.30),
    new HourItem(9.50, 10.35),
    new HourItem(10.36, 11.20),
    new HourItem(11.40, 12.25),
    new HourItem(12.26, 13.10),
    new HourItem(13.40, 14.25),
    new HourItem(14.26, 15.10),
    new HourItem(15.11, 16.00),
]
function GetCurrentTime(d){
    var minute = d.getMinutes();
    var out;
    
    if(minute.toString().length == 1){
        out = "0" + minute;
    }
    else {
        out = minute;
    }
    return parseFloat(d.getHours() + "." + out);
    //return 10.10;
}

function FindCurrentHourIndex(d, Day){
    
    //find the correct Index for the Hour
    var CurrentTime = GetCurrentTime(d);
    console.log(CurrentTime);

    for(var i = 0; i<AllHours.length; i++){
        var CurrentItem = AllHours[i];
        if(CurrentItem.to >= CurrentTime && CurrentItem.from <= CurrentTime)
        {
            if(GetCurrentHour(Day, i, false) == null)
            {
                return -1;
            }
            console.log(AllHours[i].from);            
            return i;
        }
    }
    //return that currently it is break
    if(CurrentTime < 16.00 && CurrentTime > 8.00){
        return -2;
    }
    //No more school
    return -1;
}

function GetCurrentHour(day, HourIndex, ClearClassList){
    if(day == null)
        return null;

    var child = day.querySelectorAll(".DayHeadline");
    for(var i = 0 ; i<child.length; i++)
    {
        if(ClearClassList){
            child[i].classList.remove("ActiveHour");
        }
        
        if(i == HourIndex)
        {
            //if it has content
            if(child[i].innerHTML != ""){
                return child[i];
            }
        }
    }
    return null;
}

function AddNullToEnd(Number){
    var str = Number.toString();
    if(str.includes(".")){
        if(str.split(".")[1].length == 1){
            return str + "0";
        }
    }
    else{
        return str + ".00";
    }
    return str;
}

function DetectDoubleLessons(CurrentIndex, CurrentHour, CurrentDay){
    //Check whether there are hours left
    if(CurrentIndex < AllHours.length - 1){
        var NextHour = GetCurrentHour(CurrentDay, CurrentIndex + 1, false);
        if(NextHour == null)
        return CurrentIndex;
        //Double lesson
        if(NextHour.innerHTML == CurrentHour.innerHTML){
            //Check for triple lesson
            return DetectDoubleLessons(CurrentIndex + 1, NextHour, CurrentDay);
        }
    }
    return CurrentIndex;
}

function GetTimeToNextLesson(CurrentIndex, CurrentHour, CurrentDay){
    return AllHours[DetectDoubleLessons(CurrentIndex, CurrentHour, CurrentDay)].to;
}

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function GetTimeLeftPerHour(CurrentIndex, CurrentTime){

    var splitted1 = AddNullToEnd(AllHours[CurrentIndex].to).split(".");
    var splitted2 = AddNullToEnd(CurrentTime).split(".");
    var utc1;
    if(splitted1.length == 1){
        utc1 = Date.UTC(2022,9,18,splitted1[0]);
    }
    else if(splitted1.length > 1){
        utc1 = Date.UTC(2022,9,18,splitted1[0], splitted1[1]);
    }
    var utc2;
    if(splitted2.length == 1){
        utc2 = Date.UTC(2022,9,18,splitted2[0]);
    }
    else if(splitted2.length > 1){
        utc2 = Date.UTC(2022,9,18,splitted2[0], splitted2[1]);
        console.log(splitted2[0] + ":" + splitted2[1] );
    }
    var d = new Date(time_diff = Math.abs(utc1 - utc2));

    var hour = d.getHours() -1;
    var minute = d.getMinutes();

    if(hour == 0)
        return "<b class='TimeText'>" + minute + "</b>Min";
    else 
        return "<b class='TimeText'>" + hour + "</b>Std <b class='TimeText'>" + minute + "</b>Min";
}

function GetTimeLeftToNextLesson(CurrentIndex, CurrentHour, CurrentDay, d){
    var res = DetectDoubleLessons(CurrentIndex, CurrentHour, CurrentDay);
    return GetTimeLeftPerHour(res, GetCurrentTime(d));
}


function ClearAll(){
    
    for(var j = 1; j<6; j++){
        var day = document.getElementById("Day" + j);
        var child = day.querySelectorAll(".DayHeadline");
        for(var i = 0 ; i<child.length; i++)
        {
            //if it has content
            if(child[i].innerHTML != ""){
                child[i].classList.remove("ActiveHour");
            }
        }
    }
}

function removeTags(str) {
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();
          
    // Regular expression to identify HTML tags in 
    // the input string. Replacing the identified 
    // HTML tag with a null string.
    return str.replace( /(<([^>]+)>)/ig, '');
}

function SetTimer(){
    setTimeout(HighlightHour, 20000);
}

function GetHourName(HourName){
    var splitted = HourName.split("\n");
    if(splitted.length == 1)
        return splitted[1];
    if(splitted.length > 2)
        return splitted[1] + " in " +  removeTags(splitted[2]);
}

function HighlightHour()
{
    var SkipContent = false;

    ClearAll();

    var d = new Date();
    var DayIndex = d.getDay();
    //Weekend
    if(DayIndex > 5 || DayIndex == 0){
        ChangeContent("Wochenende!");
        SetTimer();
        return;
    }
    
    //Get the current day
    var Day = document.getElementById("Day" + DayIndex);
    var CurrentHourIndex = FindCurrentHourIndex(d, Day);

    //For break
    if(CurrentHourIndex == -2){
        ChangeContent("Pause!");
        SkipContent = true;
    }
    //No more school
    if(CurrentHourIndex == -1){
        ChangeContent("Schulschluss");
        SkipContent = true;
    }

    if(!SkipContent){

        var CurrentHour = GetCurrentHour(Day, CurrentHourIndex, true);
        if(CurrentHour == null)
            return;

        CurrentHour.classList.add("ActiveHour");
        
        TopInfo.innerHTML = GetHourName(CurrentHour.innerHTML) + 
            " bis " + 
            AddNullToEnd(GetTimeToNextLesson(CurrentHourIndex, CurrentHour, Day)).replace(".", ":") + "\n" +
            " noch " + GetTimeLeftToNextLesson(CurrentHourIndex, CurrentHour, Day, d);

        document.title = (
            GetHourName(CurrentHour.innerHTML) + " - " + 
            AddNullToEnd(GetTimeToNextLesson(CurrentHourIndex, CurrentHour, Day)).replace(".", ":") + "\n" +
            "(" + removeTags(GetTimeLeftToNextLesson(CurrentHourIndex, CurrentHour, Day, d))) + ")";

    }
    SetTimer();
}

function ChangeContent(Content){
    document.title = TopInfo.innerText = Content;
}

HighlightHour();

function ScrollIntoView(id){
    var doc = document.getElementById(id);
    if(doc != null)
        doc.scrollIntoView({behavior: "smooth", block: "center", inline:"nearest"});
}

//Ideen:
//Übrige Zeit für die Pause anzeigen
//Grade/Ungrade Wochen anzeigen