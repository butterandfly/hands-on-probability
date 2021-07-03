
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

export function genSectionUrl(sectionID: string) {
  return `/lessons/${sectionID.substring(0, 2)}/sections/${sectionID}`;
}