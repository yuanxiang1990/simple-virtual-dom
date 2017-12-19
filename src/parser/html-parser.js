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

const singleAttrIdentifier = /([^\s"'<>/=]+)/
const singleAttrAssign = /(?:=)/
const singleAttrValues = [
    // attr value double quotes
    /"([^"]*)"+/.source,
    // attr value, single quotes
    /'([^']*)'+/.source,
    // attr value, no quotes
    /([^\s"'=<>`]+)/.source
]
const attribute = new RegExp(
    '^\\s*' + singleAttrIdentifier.source +
    '(?:\\s*(' + singleAttrAssign.source + ')' +
    '\\s*(?:' + singleAttrValues.join('|') + '))?'
)

/**
 * 解析字符串 生成 HTMLElment Token流
 * @param html
 * @param options
 */
export function parseHTML(html, options) {
    const stack = []
    let index = 0;
    let lastTag;
    /*
      options = {
        chars:  解析到文本的回调
        start:  解析到标签起始的回调
        end:    解析到标签结束的回调
      }
    */
    while (html) {
        var textEnd = html.indexOf("<");
        if (textEnd == 0) {
            const endTagMatch = html.match(endTag);
            /**
             * 处理结束标签
             */
            if (endTagMatch) { // 把指针挪到 "</xxx>" 后边的位置
                const curIndex = index
                advance(endTagMatch[0].length)
                parseEndTag(endTagMatch[1], curIndex, index) // 处理一下堆栈信息，回调上层
                continue
            }

            // 标签起始：<xxx attr="xx">
            const startTagMatch = parseStartTag()
            if (startTagMatch) {
                handleStartTag(startTagMatch)
                continue
            }
        }
        /**
         * 处理文本
         */
        let text, rest, next
        if (textEnd >= 0) {
            text = html.substring(0, textEnd);
            stack.push({CharsToken:text});
            advance(textEnd)
        } else { // 之后的字符串不包含 '<' ，那剩余整个字符串都是文本节点了
            text = html;
            stack.push({CharsToken:text});
            html = ''
        }

        //options.chars(text)
    }

    /**
     * 移动下标
     * @param n
     */
    function advance(n) {
        index += n
        html = html.substring(n)
    }

    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
                start: index
            }
            advance(start[0].length);
            // 解析属性
            let end, attr
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length)
                match.attrs.push(attr)
            }
            if (end) {
                match.unarySlash = end[1]
                advance(end[0].length)
                match.end = index
                return match
            }
        }
    }

    function handleStartTag(startTagMatch) {
        stack.push({StartToken:startTagMatch});
    }

    /**
     * 处理结束标签
     * @param tagName
     * @param start
     * @param end
     */
    function parseEndTag(tagName, start, end) {
        stack.push({endToken:tagName})
    }

    return stack;
}

