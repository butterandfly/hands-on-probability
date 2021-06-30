import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {SectionProgressData, LessonData, SectionData, SectionsMap, PartsMap, PartProgressesMap, SectionProgressesMap, LessonProgressData} from '../lib/datas'
import { num2str } from './utils'
import { createPartData, initPartProgressData } from './part'

const lessonsDirectory = path.join(process.cwd(), 'lessons')

export function getAllLessonIds() {
  const fileNames = fs.readdirSync(lessonsDirectory)
  // ['01', '02', ...]

  return fileNames;
  // return fileNames.map(fileName => {
  //   return {
  //     params: {
  //         // id: fileName.replace(/\.mdx$/, '')
  //         id: fileName
  //     }
  //   }
  // })
}

export async function getAllLessonMetas() {
  const fileNames = fs.readdirSync(lessonsDirectory)

  const lessonDatas = fileNames.map((les) => {
    const dataPath = path.join(lessonsDirectory, les, les + '-00.mdx');
    const fileContents = fs.readFileSync(dataPath, 'utf8')
  
    const matterResult = matter(fileContents)
    return {
      id: les,
      ...matterResult.data
    }
  });
  return lessonDatas;
}

export async function getLessonMeta(id: string): Promise<LessonData> {
  const fullPath = path.join(lessonsDirectory, id, `${id}-00.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const matterResult = matter(fileContents)

  const sectionsMap = getAllSectionMeta(id);
  const lessonData: LessonData = {
    ...matterResult.data,
    id,
    sections: sectionsMap,
  } as LessonData;
  return lessonData;
}

// Get all sections by the lesson id.
export function getAllSectionMeta(id: string) {
  const fullPath = path.join(lessonsDirectory, id);
  let fileNames = fs.readdirSync(fullPath);

  fileNames = fileNames.filter((name: string) => {
    if (name.endsWith('-00.mdx')) return false;
    return true;
  });

  const map: SectionsMap = {};
  fileNames.forEach((name: string) => {
    const sectionPath = path.join(lessonsDirectory, id, name);
    const fileContents = fs.readFileSync(sectionPath, 'utf8')
    const sectionID = name.replace(/\.mdx$/, '');
    map[sectionID] = {
      ...matter(fileContents).data,
      id: sectionID,
    } as SectionData;
  });

  return map;
}

async function getLessonData(lessonID: string) {
  const fullPath = path.join(lessonsDirectory, lessonID, `${lessonID}-00.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const matterResult = matter(fileContents)

  const sectionsMap = await getAllSectionDatas(lessonID);
  const lessonData: LessonData = {
    ...matterResult.data,
    id: lessonID,
    title: matterResult.data.title,
    sections: sectionsMap,
  };
  return lessonData; 
}

async function getAllSectionDatas(lessonID: string) {
  const fullPath = path.join(lessonsDirectory, lessonID);
  let fileNames = fs.readdirSync(fullPath);

  fileNames = fileNames.filter((name: string) => {
    if (name.endsWith('-00.mdx')) return false;
    return true;
  });

  const map: SectionsMap = {};
  for (let i = 0; i< fileNames.length; i++) {
    const sectionID = fileNames[i].replace(/\.mdx$/, '');
    const section = await getSectionData(sectionID);
    map[sectionID] = section;
  }

  return map;
}

export async function initLessonProgressData(lessonID: string) {
  const lesson = await getLessonData(lessonID);

  const sectionProgresses: SectionProgressesMap = {};
  Object.keys(lesson.sections!).forEach((key: string) => {
    const section = lesson.sections![key];
    sectionProgresses[key]= initSectionProgressData(section);
  })

  const lessonProg: LessonProgressData = {
    lessonID: lesson.id,
    lessonTitle: lesson.title,
    isFinished: false,
    activeSection: lesson.id + '-01',
    sectionProgresses,
  };

  return lessonProg;
}

const lockMatch = /^--- lock ---( )*\n/gm;
const lockStr = '--- lock ---\n';
// const lockStr = '<Lock />\n';

export async function getSectionData(id: string) { 
  const lesson = (id.split('-'))[0];
  const fullPath = path.join(lessonsDirectory, lesson, `${id}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const matterResult = matter(fileContents)

  const cleanContent = matterResult.content.replace(lockMatch, lockStr);
  const partContents = cleanContent.split(lockStr);

  const parts: PartsMap = {};
  for (let i = 0; i < partContents.length; i++) {
    const partID = id + '.' + num2str(i+1);
    const partData = await createPartData(partID, partContents[i]);
    parts[partID] = partData;
  }

  const title = matterResult.data.title;
  const sectionData: SectionData = {
    ...matterResult.data,
    id,
    title, 
    parts: parts,
  }

  return sectionData;
}

function initSectionProgressData(sectionData: SectionData): SectionProgressData {
  const partProgresses: PartProgressesMap = {};
  Object.keys(sectionData.parts).forEach((key: string) => {
    const part= sectionData.parts[key];
    partProgresses[key]= initPartProgressData(part);
  })

  const numStr = sectionData.id.split('-')[1];

  return {
    sectionID: sectionData.id,
    sectionTitle: sectionData.title,
    isLocked: numStr === '01' ? false : true,
    isFinished: false,
    partProgresses: partProgresses,
  };
}
