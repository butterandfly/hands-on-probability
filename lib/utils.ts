
export function num2str(num: number) {
  if (num < 0) return '00';
  if (num < 10) return '0' + num;
  if (num < 100) return '' + num;
  return '99'
}

export function nextLessonID(lessonID: string) {
  return num2str((+lessonID) + 1);
}

export function nextSectionID(sectionID: string) {
  const section = sectionID.substring(3, 5);
  const next = '' + num2str((+section) + 1);
  return sectionID.substring(0, 3) + next;
}

export function nextPartID(partID: string) {
  const part = partID.substring(6, 8);
  const next = '' + num2str((+part) + 1);
  return partID.substring(0, 6) + next;
}

export function getPropsFromSyntax(node: any) {
  const tagContent = (node.value.match(/<([^>]*)>/))[0];

  const pairs: {[key: string]: string} = {}
  tagContent.match(/[a-zA-Z0-9]+=\"([^"]*)\"/gm).forEach((pair: string) => {
    const data = pair.split('='); 
    pairs[data[0]] = data[1].replace(/"/g, '');
  });

  return pairs;
}

export function getComponentNameFromSyntax(node: any) {
  const matches = (node.value as string).trimLeft().match(/^<\w+/) || [];
  if (matches.length < 1) return '';

  return matches[0].substring(1);
}

export function addPropsToSyntax(originJsx: string, props: {[key: string]: string}) {
  const propsStr = Object.keys(props).map((key) => key + '=' + props[key]).join(' ');
  const newVal = originJsx.trimLeft().replace(/^<\w+/, "$& " + propsStr);
  console.log(newVal);
  return newVal;
}

export function genSectionUrl(sectionID: string) {
  return `/lessons/${sectionID.substring(0, 2)}/sections/${sectionID}`;
}