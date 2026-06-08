import { THANK } from './Words/THANK';
import { YOU } from './Words/YOU';
import { GOOD } from './Words/GOOD';
import { MORNING } from './Words/MORNING';
import { NIGHT } from './Words/NIGHT';
import { HOW } from './Words/HOW';
import { ARE } from './Words/ARE';
import { I } from './Words/I';
import { LOVE } from './Words/LOVE';
import { PLEASE } from './Words/PLEASE';
import { HELP } from './Words/HELP';
import { SEE } from './Words/SEE';
import { TAKE } from './Words/TAKE';
import { CARE } from './Words/CARE';
import { NEED } from './Words/NEED';
import { WANT } from './Words/WANT';
import { WATER } from './Words/WATER';
import { LUCK } from './Words/LUCK';
import { JOB } from './Words/JOB';
import { TO } from './Words/TO';
import { GO } from './Words/GO';
import { WELCOME } from './Words/WELCOME';
import { HOME } from './Words/HOME';
import { READY } from './Words/READY';
import { ME } from './Words/ME';

const exactPhraseAnimations = {
    'THANK YOU': (ref) => { THANK(ref); YOU(ref); },
    'GOOD MORNING': (ref) => { GOOD(ref); MORNING(ref); },
    'GOOD NIGHT': (ref) => { GOOD(ref); NIGHT(ref); },
    'HOW ARE YOU': (ref) => { HOW(ref); ARE(ref); YOU(ref); },
    'I LOVE YOU': (ref) => { I(ref); LOVE(ref); YOU(ref); },
    'PLEASE HELP': (ref) => { PLEASE(ref); HELP(ref); },
    'SEE YOU': (ref) => { SEE(ref); YOU(ref); },
    'TAKE CARE': (ref) => { TAKE(ref); CARE(ref); },
    'I NEED HELP': (ref) => { I(ref); NEED(ref); HELP(ref); },
    'I WANT WATER': (ref) => { I(ref); WANT(ref); WATER(ref); },
    'GOOD LUCK': (ref) => { GOOD(ref); LUCK(ref); },
    'GOOD JOB': (ref) => { GOOD(ref); JOB(ref); },
    'GOOD TO GO': (ref) => { GOOD(ref); TO(ref); GO(ref); },
    'WELCOME HOME': (ref) => { WELCOME(ref); HOME(ref); },
    'I AM READY': (ref) => { I(ref); ME(ref); READY(ref); },
};

const phraseList = Object.keys(exactPhraseAnimations);

export {
    exactPhraseAnimations,
    phraseList,
};