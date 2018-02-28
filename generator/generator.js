/**
 * scratch-ln generators.
 *
 * Generator, using the blockly generator stuff to transform blocks -> text
 *
 * @file   This files defines the blockspecifications const.
 * @author Ellen Vanhove.
 */
import ScratchBlocks from 'scratch-blocks';
import {blockspecifications} from "../blockspecification/blockspecification";


export default function generateText(workspace) {
    let u = ScratchBlocks.text.workspaceToCode(workspace);
    console.log('_____________');
    console.log(u);
    console.log('_____________');
}

// scratch LN
//======================================================
//generator
//======================================================

ScratchBlocks.text = new ScratchBlocks.Generator('text');


//some basis function that are necessary but do not do anything here
ScratchBlocks.text.init = function (workspace) {
    //nope
};

ScratchBlocks.text.scrub_ = function (block, code) {
    return code
};

ScratchBlocks.text.finish = function (code) {
    return code
};

/**
 * Based on something from blockly, see python generator example.
 * @param block
 * @returns {string|Array}
 */
ScratchBlocks.text.getNextCode = function (block) {
    let nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    let nextCode = ScratchBlocks.text.blockToCode(nextBlock); //returns '' if not existing
    return nextCode
};

/**
 * arguments list where the first one is not an array -> args are replaced in order of occurrence
 * or 1 array -> content of this array is used to replace
 * @returns {string}
 */
String.prototype.format = function () {
    let args = arguments;
    if( Array.isArray(args[0])){ //if an array is passed as argument
        args = args[0];
    }
    return this.replace(/%(\d+)/g, function (_, m) {
        return args[--m];
    });
};

//====examples
ScratchBlocks.text['event_whenflagclicked'] = function (block) {
    return 'when greenflag clicked;\n' + ScratchBlocks.text.getNextCode(block);
};

ScratchBlocks.text['pen_penup'] = function (block) {
    return 'pen up;\n' + ScratchBlocks.text.getNextCode(block);
};

ScratchBlocks.text['motion_movesteps'] = function (block) {
    let value_name = ScratchBlocks.text.valueToCode(block, 'STEPS', ScratchBlocks.text.ORDER_NONE);
    console.log(value_name);
    return 'move %1 steps;\n'.format('{' + value_name + '}') + ScratchBlocks.text.getNextCode(block);
};
//====examples

//=========== arguments =================
ScratchBlocks.text['math_number'] = function (block) {
    return [block.getFieldValue('NUM'), ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};

ScratchBlocks.text['text'] = function (block) {
    return [block.getFieldValue('TEXT'), ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};

ScratchBlocks.text['data_variable'] = function (block) {
    return ['('+block.getFieldValue('VARIABLE')+')', ScratchBlocks.text.ORDER_NONE]; //order for parenthese generation or somthing in real code (not important)
};


//========================================

/**
 * init the generator with information from blockspecifications
 *
 */
export function init_generator(){
    //generate the functions
    for(let x=0; x<blockspecifications.length;x++){
        let b = blockspecifications[x];
        let template;
        if(Array.isArray(b['template'])) {
             template = b['template'][0];
        }else{
            template = b['template'];
        }
        let type = b['description']['type'];
        let args = b['description']['args'];
        ScratchBlocks.text[type] = function (block) {
            let values = [];
            for(let i=0; args && i<args.length; i++){
                let v;
                switch (args[i].type){
                    case "field_dropdown":
                        v = block.getFieldValue(args[i].name);
                        v = '[' +  v + ']';
                        break;
                    default:
                        v = ScratchBlocks.text.valueToCode(block, args[i].name, ScratchBlocks.text.ORDER_NONE); //returns undefined if empty
                        v = '{' +  v + '}'; //results in {} if empty
                }
                values.push(v);
            }
            return template.format(values)+'\n' + ScratchBlocks.text.getNextCode(block);
        };
    }
}

init_generator();