export function getDocHeight() {

    var D = document;
    
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    );
}

export function getOffsetTop(element){

    let offsetTop = 0;

    while(element) {
      offsetTop += element.offsetTop;
      element = element.offsetParent;
    }

    return offsetTop;
}

export function convertCssUnit( cssValue, target ) {

    target = target || document.body;

    const supportedUnits = {

        // Absolute sizes
        'px': value => value,
        'cm': value => value * 38,
        'mm': value => value * 3.8,
        'q': value => value * 0.95,
        'in': value => value * 96,
        'pc': value => value * 16,
        'pt': value => value * 1.333333,

        // Relative sizes
        'rem': value => value * parseFloat( getComputedStyle( document.documentElement ).fontSize ),
        'em': value => value * parseFloat( getComputedStyle( target ).fontSize ),
        'vw': value => value / 100 * window.innerWidth,
        'vh': value => value / 100 * window.innerHeight,

        // Times
        'ms': value => value,
        's': value => value * 1000,

        // Angles
        'deg': value => value,
        'rad': value => value * ( 180 / Math.PI ),
        'grad': value => value * ( 180 / 200 ),
        'turn': value => value * 360

    };

    // Match positive and negative numbers including decimals with following unit
    const pattern = new RegExp( `^([\-\+]?(?:\\d+(?:\\.\\d+)?))(${ Object.keys( supportedUnits ).join( '|' ) })$`, 'i' );

    // If is a match, return example: [ "-2.75rem", "-2.75", "rem" ]
    const matches = String.prototype.toString.apply( cssValue ).trim().match( pattern );

    if ( matches ) {
        const value = Number( matches[ 1 ] );
        const unit = matches[ 2 ].toLocaleLowerCase();

        // Sanity check, make sure unit conversion function exists
        if ( unit in supportedUnits ) {
            return supportedUnits[ unit ]( value );
        }
    }

    return cssValue;
}

export function getHexOpacity(opacity) {

    if(opacity == 0)
        return "";

    let hex = "";

    switch(opacity){
        case 0:
            hex = "00";
            break;
        case 0.1:
            hex = "19";
            break;
        case 0.2:
            hex = "33";
            break;
        case 0.3:
            hex = "4C";
            break;
        case 0.4:
            hex = "66";
            break;
        case 0.5:
            hex = "7F";
            break;
        case 0.6:
            hex = "99";
            break;
        case 0.7:
            hex = "B2";
            break;
        case 0.8:
            hex = "CC";
            break;
        case 0.9:
            hex = "E5";
            break;
        case 1:
            hex = "FF";
            break;
        default:
            hex = "7F";
    }

    return hex;
}