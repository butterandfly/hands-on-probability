import { ContactSupportOutlined } from '@material-ui/icons';
import fs from 'fs'
import matter from 'gray-matter';
import path from 'path'
import { PartsMap, SectionData, SectionProgressesMap, SectionsMap } from "./datas";
import {initSectionProgressData} from './lesson-helper'
import { createPartData } from './part-helper';
import { num2str } from './utils';

export type DemoData = {
  id: string,
  title: string,
  desc: string,
  sections?: SectionsMap,
}

export type DemoProgressData = {
  demoID: string, // '01'
  demoTitle: string,
  isFinished: boolean,
  activeSection: string, // ID of the active section
  sectionProgresses: SectionProgressesMap,
}

const demoDirectory = path.join(process.cwd(), 'demos')

export async function initDemoProgress(demo: DemoData) {
  console.log('--- initDemoProgress ---')
  console.dir(demo)
  const sectionProg = initSectionProgressData(demo.sections![demo.id]);
  console.dir(sectionProg)

  const demoProg: DemoProgressData = {
    demoID: demo.id,
    demoTitle: demo.title,
    isFinished: false,
    activeSection: demo.id,
    sectionProgresses: {
      [demo.id]: sectionProg,
    },
  };

  return demoProg;
}

const lockMatch = /^--- lock ---( )*\n/gm;
const lockStr = '--- lock ---\n';

export async function getDemoData(demoID: string) {
  const fullPath = path.join(demoDirectory, `${demoID}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const matterResult = matter(fileContents);
  const data = matterResult.data;
  const cleanContent = matterResult.content.replace(lockMatch, lockStr);
  const partContents = cleanContent.split(lockStr);

  const parts: PartsMap = {};
  for (let i = 0; i < partContents.length; i++) {
    const partID = demoID + '.' + num2str(i+1);
    const partData = await createPartData(partID, partContents[i]);
    parts[partID] = partData;
  }

  const sectionData: SectionData = {
    id: demoID,
    title: data.title, 
    parts: parts,
  }

  const sectionsMap = {[demoID]: sectionData};
  const demo: DemoData = {
    id: demoID,
    desc: data.desc,
    title: data.title,
    sections: sectionsMap,
  };
  return demo; 
}

export function getAllDemoIDs() {
  const fileNames = fs.readdirSync(demoDirectory);
  const ids = fileNames.map((name) => name.replace(/.mdx$/, ''));
  console.dir(ids);
  return ids;
}

export function getAllDemoMetas() {
  const fileNames = fs.readdirSync(demoDirectory)
  const demoNames = fileNames.map((fileName) => fileName.replace(/.mdx$/, ''));

  const demos = demoNames.map((demoName) => {
    const dataPath = path.join(demoDirectory, demoName + '.mdx');
    const fileContents = fs.readFileSync(dataPath, 'utf8')
  
    const matterResult = matter(fileContents);
    const data = matterResult.data;
    return {
      id: demoName,
      isActive: true,
      desc: data.desc,
      title: data.title,
    } as DemoData;
  });
  return demos;
}

