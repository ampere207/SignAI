import { TIME } from './Words/TIME';
import { HOME } from './Words/HOME';
import { PERSON } from './Words/PERSON';
import { YOU } from './Words/YOU';
import { HELLO } from './Words/HELLO';
import { PLEASE } from './Words/PLEASE';
import { THANK } from './Words/THANK';
import { SORRY } from './Words/SORRY';
import { YES } from './Words/YES';
import { NO } from './Words/NO';
import { HELP } from './Words/HELP';
import { GOOD } from './Words/GOOD';
import { BAD } from './Words/BAD';
import { WANT } from './Words/WANT';
import { NEED } from './Words/NEED';
import { LOVE } from './Words/LOVE';
import { KNOW } from './Words/KNOW';
import { LEARN } from './Words/LEARN';
import { WORK } from './Words/WORK';
import { EAT } from './Words/EAT';
import { DRINK } from './Words/DRINK';
import { SLEEP } from './Words/SLEEP';
import { GO } from './Words/GO';
import { COME } from './Words/COME';
import { STOP } from './Words/STOP';
import { NOW } from './Words/NOW';
import { MORNING } from './Words/MORNING';
import { ARE } from './Words/ARE';
import { I } from './Words/I';
import { ME } from './Words/ME';
import { SEE } from './Words/SEE';
import { MEET } from './Words/MEET';
import { NICE } from './Words/NICE';
import { CARE } from './Words/CARE';
import { WATER } from './Words/WATER';
import { FOOD } from './Words/FOOD';
import { JOB } from './Words/JOB';
import { LUCK } from './Words/LUCK';
import { FUN } from './Words/FUN';
import { TO } from './Words/TO';
import { WELCOME } from './Words/WELCOME';
import { READY } from './Words/READY';
import { DO } from './Words/DO';
import { EVENING } from './Words/EVENING';
import { AFTERNOON } from './Words/AFTERNOON';
import { TODAY } from './Words/TODAY';
import { FAMILY } from './Words/FAMILY';
import { FRIEND } from './Words/FRIEND';
import { TAKE } from './Words/TAKE';

const exactWordAnimations = {
    TIME,
    HOME,
    PERSON,
    YOU,
    HELLO,
    PLEASE,
    THANK,
    SORRY,
    YES,
    NO,
    HELP,
    GOOD,
    BAD,
    MORNING,
    ARE,
    I,
    ME,
    SEE,
    MEET,
    NICE,
    CARE,
    WATER,
    FOOD,
    JOB,
    LUCK,
    FUN,
    TO,
    WELCOME,
    READY,
    DO,
    EVENING,
    AFTERNOON,
    TAKE,
    WANT,
    NEED,
    LOVE,
    KNOW,
    LEARN,
    WORK,
    EAT,
    DRINK,
    SLEEP,
    GO,
    COME,
    STOP,
    NOW,
    TODAY,
    FAMILY,
    FRIEND,
};

const commonWordGroups = [
    [
        'I', 'ME', 'MY', 'MINE', 'MYSELF', 'YOU', 'YOUR', 'YOURS', 'YOURSELF',
        'WE', 'US', 'OUR', 'OURS', 'OURSELVES', 'THEY', 'THEM', 'THEIR', 'THEIRS',
        'THEMSELVES', 'HE', 'HIM', 'HIS', 'HIMSELF', 'SHE', 'HER', 'HERS', 'HERSELF',
        'IT', 'ITS', 'ITSELF', 'ONE', 'ONES', 'ANYONE', 'SOMEONE', 'EVERYONE', 'NOONE',
    ],
    [
        'A', 'AN', 'THE', 'THIS', 'THAT', 'THESE', 'THOSE', 'EACH', 'EVERY', 'ALL',
        'SOME', 'ANY', 'NONE', 'MORE', 'MOST', 'MANY', 'MUCH', 'FEW', 'LESS', 'OTHER',
        'ANOTHER', 'BOTH', 'EITHER', 'NEITHER', 'SEVERAL', 'ENOUGH', 'SAME', 'DIFFERENT',
    ],
    [
        'AND', 'OR', 'BUT', 'IF', 'THEN', 'BECAUSE', 'SO', 'SINCE', 'THOUGH', 'ALTHOUGH',
        'WHILE', 'WHEREAS', 'UNLESS', 'UNTIL', 'WHEN', 'WHERE', 'WHY', 'HOW', 'WHAT', 'WHO',
        'WHICH', 'WHOSE', 'WHOM', 'DOES', 'DID', 'DO', 'DONT', 'DIDNT', 'CANT', 'WONT',
        'ISNT', 'ARENT', 'IM', 'IVE', 'ILL', 'YOURE', 'YOURE', 'YOUVE', 'THEYRE', 'WERE',
        'THERES', 'THERE', 'HERE', 'THEREFORE',
    ],
    [
        'PLEASE', 'THANK', 'THANKS', 'THANKYOU', 'SORRY', 'HELLO', 'HI', 'HEY', 'WELCOME',
        'GOODBYE', 'BYE', 'OKAY', 'OK', 'PLEASED', 'EXCUSE', 'PARDON', 'CONGRATULATIONS',
        'WELCOME', 'NICE', 'PEACE', 'HELP', 'HELPFUL', 'READY', 'PLEASED', 'GREETINGS',
    ],
    [
        'GOOD', 'BAD', 'BEST', 'WORST', 'BIG', 'SMALL', 'LONG', 'SHORT', 'FAST', 'SLOW',
        'NEW', 'OLD', 'YOUNG', 'EARLY', 'LATE', 'HOT', 'COLD', 'WARM', 'COOL', 'HAPPY',
        'SAD', 'ANGRY', 'TIRED', 'SICK', 'HEALTHY', 'HUNGRY', 'THIRSTY', 'LOUD', 'QUIET',
        'BRIGHT', 'DARK', 'EASY', 'HARD', 'SIMPLE', 'DIFFICULT', 'IMPORTANT', 'NEEDED',
    ],
    [
        'NOW', 'TODAY', 'TOMORROW', 'YESTERDAY', 'TONIGHT', 'MORNING', 'AFTERNOON', 'EVENING',
        'NIGHT', 'DAY', 'DAYS', 'WEEK', 'WEEKS', 'MONTH', 'MONTHS', 'YEAR', 'YEARS', 'TIME',
        'HOUR', 'HOURS', 'MINUTE', 'MINUTES', 'SECOND', 'SECONDS', 'SOON', 'LATER', 'ALWAYS',
        'NEVER', 'AGAIN', 'FIRST', 'LAST', 'NEXT', 'PAST', 'FUTURE', 'BEFORE', 'AFTER', 'EVER',
    ],
    [
        'HOME', 'HOUSE', 'ROOM', 'FAMILY', 'FRIEND', 'FRIENDS', 'PERSON', 'PEOPLE', 'MAN',
        'WOMAN', 'BOY', 'GIRL', 'CHILD', 'CHILDREN', 'BABY', 'MOTHER', 'FATHER', 'MOM',
        'DAD', 'SISTER', 'BROTHER', 'SON', 'DAUGHTER', 'HUSBAND', 'WIFE', 'PARENT', 'PARENTS',
        'RELATIVE', 'NEIGHBOR', 'COLLEAGUE', 'TEAM', 'CLASS', 'TEACHER', 'STUDENT', 'NAME',
        'AGE', 'ADDRESS', 'CITY', 'COUNTRY', 'PLACE', 'LOCATION', 'WORLD', 'COMMUNITY',
    ],
    [
        'GO', 'COME', 'STOP', 'START', 'BEGIN', 'END', 'OPEN', 'CLOSE', 'MAKE', 'DO', 'DID',
        'DONE', 'TAKE', 'GIVE', 'GOT', 'GET', 'HAVE', 'HAD', 'KEEP', 'LEAVE', 'RETURN', 'SEND',
        'BRING', 'MOVE', 'TURN', 'CHANGE', 'USE', 'WORK', 'PLAY', 'READ', 'WRITE', 'SPEAK',
        'LISTEN', 'HEAR', 'SEE', 'LOOK', 'SHOW', 'TELL', 'ASK', 'ANSWER', 'CALL', 'WAIT',
        'WANT', 'NEED', 'LIKE', 'LOVE', 'KNOW', 'UNDERSTAND', 'LEARN', 'TEACH', 'FEEL', 'TRY',
    ],
    [
        'EAT', 'DRINK', 'SLEEP', 'WAKE', 'WASH', 'CLEAN', 'COOK', 'BUY', 'SELL', 'PAY', 'OPEN',
        'CLOSE', 'CUT', 'FIX', 'BUILD', 'CREATE', 'SAVE', 'SHARE', 'WORK', 'STUDY', 'TRAIN',
        'DRIVE', 'TRAVEL', 'VISIT', 'MEET', 'JOIN', 'LEAVE', 'ARRIVE', 'RETURN', 'WAIT', 'QUEUE',
        'SUBMIT', 'UPLOAD', 'DOWNLOAD', 'SEARCH', 'FIND', 'REPLACE', 'REMOVE', 'ADD', 'EDIT',
    ],
    [
        'CAN', 'COULD', 'WILL', 'WOULD', 'SHOULD', 'MAY', 'MIGHT', 'MUST', 'SHALL', 'MUSTNOT',
        'ABLE', 'NEED', 'NEEDS', 'NEEDED', 'WANT', 'WANTS', 'WANTED', 'LIKE', 'LIKES', 'LIKED',
        'HAVE', 'HAS', 'HAD', 'DO', 'DOES', 'DID', 'BE', 'AM', 'IS', 'ARE', 'WAS', 'WERE',
    ],
    [
        'IN', 'ON', 'AT', 'BY', 'FOR', 'FROM', 'TO', 'OF', 'WITH', 'WITHOUT', 'ABOUT', 'OVER',
        'UNDER', 'BETWEEN', 'BEHIND', 'BEFORE', 'AFTER', 'INSIDE', 'OUTSIDE', 'AROUND', 'NEAR',
        'FAR', 'UP', 'DOWN', 'LEFT', 'RIGHT', 'FRONT', 'BACK', 'ACROSS', 'THROUGH', 'TOWARD',
    ],
    [
        'YES', 'NO', 'OKAY', 'OK', 'GOOD', 'BAD', 'PLEASE', 'THANK', 'THANKS', 'SORRY', 'HELLO',
        'BYE', 'HELP', 'WAIT', 'STOP', 'GO', 'NOW', 'HERE', 'THERE', 'THIS', 'THAT', 'THESE',
        'THOSE', 'WHAT', 'WHERE', 'WHEN', 'WHY', 'HOW', 'WHO', 'WHICH', 'WHOSE', 'YOUR', 'YOU',
    ],
];

const commonWordList = commonWordGroups.flat();

const wordList = [...new Set([...Object.keys(exactWordAnimations), ...commonWordList])].sort();

export {
    TIME, HOME, PERSON, YOU, HELLO, PLEASE, THANK, SORRY, YES, NO, HELP, GOOD, BAD,
    MORNING, ARE, I, ME, SEE, MEET, NICE, CARE, WATER, FOOD, JOB, LUCK, FUN, TO,
    WELCOME, READY, DO, EVENING, AFTERNOON, TAKE,
    WANT, NEED, LOVE, KNOW, LEARN, WORK, EAT, DRINK, SLEEP, GO, COME, STOP, NOW,
    TODAY, FAMILY, FRIEND, wordList
}

export {
    exactWordAnimations,
    commonWordList,
};