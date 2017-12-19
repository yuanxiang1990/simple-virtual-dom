import {parseHTML} from '../../src/parser/html-parser';

describe('index2.js:', () => {
    it('parseHTML() should work fine.', () => {
        console.log(parseHTML("<div><p>sss</p>sssssss</div>"))
    });
});