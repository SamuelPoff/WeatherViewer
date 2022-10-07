
const MonthMap: Map<number, number> = new Map<number, number>(
    [[1, 0],
     [2, 3],
     [3, 3],
     [4, 6],
     [5, 1],
     [6, 4],
     [7, 6],
     [8, 2],
     [9, 5],
     [10, 0],
     [11, 3],
     [12, 5]
    ]
    );

const YearMap: Map<string, number> = new Map<string, number>(
    [
        ["17", 4],
        ["18", 2],
        ["19", 0],
        ["20", 6],
        ["21", 4],
        ["22", 2],
        ["23", 0]
    ]
);

const DowMap: Map<number, string> = new Map<number, string>(
    [
        [0, "Sunday"],
        [1, "Monday"],
        [2, "Tuesday"],
        [3, "Wednesday"],
        [4, "Thursday"],
        [5, "Friday"],
        [6, "Saturday"]
    ]
);

function GetMonthCode(month: number): number{

    const code: number | undefined = MonthMap.get(month);
    if(code){
        return code;
    }

    return -1;

}

function GetYearCode(year: number){

    return (year + (year / 4) % 7);

}

//Only works for Gregorian Dates (Dates past 1752) which should never be a problem since we live in 2022 lol
function GetCenturyCode(century: string){

    let code = YearMap.get(century);

    if(code){
        return code;
    }

    return -1;

}

//Also only works for Gregorian Dates (Dates past 1752) 
function GetLeapYearCode(year: number): number{

    let code = 0;

    if(year % 4 == 0){
        
        if(year % 100 == 0){

            if(year % 400 == 0){
                code = 1;
            }

        }else{
            code = 1;
        }

    }

    return code;

}

//Date Format: YYYY-MM-DD
export function GetDOW(date: string): string{

    let month: number = Number(date.substring(5, 7));
    let day: number  = Number(date.substring(8));
    let year: number = Number(date.substring(0, 4));
    let century: string = date.substring(0, 2);

    let monthCode = GetMonthCode(month);
    let yearCode = GetYearCode(year);
    let centuryCode = GetCenturyCode(century);
    let leapYearCode = GetLeapYearCode(year);

    let dowNumber = Math.floor((yearCode + monthCode + centuryCode + day - leapYearCode) % 7);

    let dow = DowMap.get(dowNumber);
    if(dow){
        return dow;
    }
    else{
        return "Nope";
    }

}


