// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')'
const startTagOpen = new RegExp('^<' + qnameCapture)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>')
const doctype = /^<!DOCTYPE [^>]+>/i
const comment = /^<!--/
const conditionalComment = /^<!\[/;

export function parseHTML(html, options) {
    const stack = []
    let index = 0;
    /*
      options = {
        chars:  解析到文本的回调
        start:  解析到标签起始的回调
        end:    解析到标签结束的回调
      }
    */
    while (html) {

    }

    function advance (n) {
        index += n
        html = html.substring(n)
    }
}

