
interface ISentenceTokenizer {
  (): void;
  trim: (array: string[]) => string[];
  tokenize: (text: string) => string[];
}

const SentenceTokenizer = function () {
}

SentenceTokenizer.trim = function (array: string[]) {
    while (array[array.length - 1] === '') { array.pop() }
    while (array[0] === '') { array.shift() }  
    return array;
}

SentenceTokenizer.tokenize = function (text: string): string[] {
    // break string up in to sentences based on punctation and quotation marks
    // let tokens = text.match(/(?<=\s+|^)["'‘“'"[({⟨]?(.*?[.?!])(\s[.?!])*["'’”'"\])}⟩]?(?=\s+|$)|(?<=\s+|^)\S(.*?[.?!])(\s[.?!])*(?=\s+|$)/g);
    let tokens = null;
    if (!tokens) {
      return [text]
    }

    // remove unecessary white space
    tokens = (tokens as any).map(Function.prototype.call, String.prototype.trim);

    return this.trim(tokens);
}

export default SentenceTokenizer as ISentenceTokenizer;