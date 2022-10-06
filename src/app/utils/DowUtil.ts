
const MonthMap: Map<string, number> = new Map<string, number>(
    [["January", 0],
     ["February", 3],
     ["March", 3],
     ["April", 6],
     ["May", 1],
     ["June", 4],
     ["July", 6],
     ["August", 2],
     ["September", 5],
     ["October", 0],
     ["November", 3],
     ["December", 5]
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

function GetMonthCode(month: string): number{

    const code: number | undefined = MonthMap.get(month);
    if(code){
        return code;
    }

    return -1;

}

function GetYearCode(year: string){

    let yearNumber: number = 0;

    return (yearNumber + (yearNumber / 4) % 7);

}

//Only works for Gregorian Dates (Dates past 1752) which should never be a problem since we live in 2022 lol
function GetCenturyCode(year: string){

    let century: string = "17";
    let code = YearMap.get(century);

    if(code){
        return code;
    }

    return -1;

}

//Also only works for Gregorian Dates (Dates past 1752) 
function GetLeapYearCode(year: string): number{

    let yearNumber: number = 0;
    let code = 0;

    if(yearNumber % 4 == 0){
        
        if(yearNumber % 100 == 0){

            if(yearNumber % 400 == 0){
                code = 1;
            }

        }else{
            code = 1;
        }

    }

    return code;

}

