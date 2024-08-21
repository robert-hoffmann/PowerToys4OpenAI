/**
 * See if a string ends with a question mark
 * @param question
 */
export function endsWithQuestionMark(question: string) : boolean {
  return (
    question.endsWith('?')  || // ASCII
    question.endsWith('？') || // Chinese/Japanese
    question.endsWith('؟')  || // Arabic
    question.endsWith('⸮')     // Arabic
  )
}

/**
 *
 * @param str Returns an estimate of the number of tokens used
 */
export function getTokenCount(str: string) : number {
  if (str.length == 0) return 0;

  // get the average of words and 4 characters
  return Math.round((str.split(' ').length + str.length/4) / 2);
}

/**
 * Get the number of words in a string
 * @param s
 */
export function getWordCount(s: string) {
  // Info: try different versions
  // https://stackoverflow.com/a/18679657/896849

  s = s.replace(/(^\s*)|(\s*$)/gi,''); // exclude start and end white-space
  s = s.replace(/[ ]{2,}/gi,' ');      // 2 or more space to 1
  s = s.replace(/\n /,'\n');           // exclude newline with a start spacing
  return s.split(' ').filter(function(str: string) { return str != ''; }).length;
  //return s.split(' ').filter(String).length; // - this can also be used
}

/**
 * Convert 2 letter code to a fully qualified language code
 * @param lang
 */
export function getFullyQualifiedLanguage(lang: string) {
  switch (lang) {
    case 'en':
      return 'en-US';

    case 'fr':
      return 'fr-FR';

    default:
      return 'en-US';
  }
}

/**
 * Generate a random GUID
 */
export function guid() : string {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, (c: number) =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

/**
 *
 * @param file Gets the base64 representation of a file
 */
export function getBase64(file: File) : Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = (error) => {
      reject(error);
    }

    reader.onload = () => {
      resolve(reader.result as string);
    }

    reader.readAsDataURL(file);
  });
}

/**
 * Get the body text from a URL
 * @param url
 */
export async function getTextFromUrl(url: string) {
  return await fetch(url)
  .then(response => response.text())
  .then(html => {
    const parser = new DOMParser();
    const doc    = parser.parseFromString(html, 'text/html');

    return doc.body.innerText;
  })
  .catch(error => {
    return error;
  });
}
