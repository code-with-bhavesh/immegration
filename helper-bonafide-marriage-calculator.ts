interface InputValues {
    [key: string]: 'Y'|'y'|'N'|'n'|''|null;
}
  
interface OutputValues {
    [key: string]: string;
}

const expectedInputKeys = [
    'EVI1095',
    'EVI1096',
    'EVI1097',
    'EVI1098',
    'EVI1099',
    'EVI1100',
    'EVI1101',
    'EVI1102',
    'EVI1103',
    'EVI1104',
    'EVI1105',
    'EVI1106',
    'EVI1107',
    'EVI1108',
    'EVI1109',
    'EVI1110',
    'EVI1111',
    'EVI1112',
    'EVI1113',
    'EVI1114',
    'EVI1115',
    'EVI1116',
    'EVI1117',
    'EVI1118',
    'EVI1119',
    'EVI1120',
    'EVI1121',
    'EVI1122'    
];

function calculateBonafideMarriageScore(
    inputValues: InputValues
    ): OutputValues {
    const bonafideScore = "bonafide_score";    

    let total = 0;

    for (const key in inputValues) {
        total += isEnabled(key, inputValues) ? getScore(key) : 0
    }

    return {
        [bonafideScore]: total.toString()
    };
}

function isEnabled(key: string, inputValues: InputValues): boolean {
    return inputValues[key] === 'Y' || inputValues[key] === 'y';
}

function getScore(key: string) {
    switch(key) {
        case 'EVI1095':
            return 50;
        case 'EVI1109':
            return 10;
        case 'EVI1096':
        case 'EVI1097':
        case 'EVI1098':
        case 'EVI1099':
        case 'EVI1100':
        case 'EVI1101':
        case 'EVI1102':
        case 'EVI1103':
        case 'EVI1104':
        case 'EVI1105':
        case 'EVI1106':
        case 'EVI1107':
        case 'EVI1108':
            return 5;
        case 'EVI1110':
        case 'EVI1111':
        case 'EVI1112':
        case 'EVI1113':
        case 'EVI1114':
        case 'EVI1115':
        case 'EVI1116':
        case 'EVI1117':
        case 'EVI1118':
        case 'EVI1119':
        case 'EVI1120':
        case 'EVI1121':
            return 2.5;
        case 'EVI1122':
            return 0.5;
        default:
            return 0;
    }
}

// You might still want to export the function in case you'll use it elsewhere.
export { calculateBonafideMarriageScore };
  