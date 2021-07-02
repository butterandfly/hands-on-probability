import { serialize } from 'next-mdx-remote/serialize'
import rehypeKatex from 'rehype-katex'
import {PartProgressData, PartData} from './datas'

import visit from 'unist-util-visit'
import {Plugin} from 'unified';
import { QuestData } from '../components/quest/questData'
import {addPropsToSyntax, getComponentNameFromSyntax} from './utils'
import {buildersMap, mdxContainerCompNames} from '../components/mdx-components'

// ! Important
// We need to use version 3 for the next-mdx-remote
import remarkMath3 from './remark-math-3'

export async function createPartData(partID: string, mdxContent: string) {
  const {source, questData} =  await serializeSectionMDX(mdxContent, partID);

  const part: PartData = {
    id: partID,
    content: mdxContent,
    source: source
  };

  if (questData) {
    part.quest = questData;
  }

  return part;
}

export function initPartProgressData(partData: PartData) {
  const progress: PartProgressData  =  {
    partID: partData.id,
    isFinished: false,
    isLocked: !isFirstPart(),
  }

  if (!partData.quest) throw new Error('Every part should have at least 1 quest!')
  
  const type = partData.quest.questType;
  const initFunc = buildersMap[type].initQuestProgressData;
  progress.questProgress = initFunc(partData.quest);

  return progress;

  function isFirstPart() {
    const partNumStr = partData.id.split('.')[1];
    return partNumStr === '01';
  }
}


export async function serializeSectionMDX(mdx: string, partID: string) {
  let data:any = null;

  const createQuest: Plugin<[]> = ()=> {
    return (tree: any) => {
      visit(tree, 'jsx', (node: any) => {
        const compName = getComponentNameFromSyntax(node);

        if (buildersMap[compName]) {
          const builder = buildersMap[compName];
          data = builder.createQuestData(node);
          builder.replacer(node);
        }

        if (compName === 'Solution') {
          node.value = addPropsToSyntax(node.value, {
            'partID': '{partID}',
            'quest': '{quest}',
          });
        }
        // return node;
      })
    }
  }

  const newMdx = addBlankHeadLine(mdx, mdxContainerCompNames);

  const source = await serialize(newMdx, {
    mdxOptions: {
      remarkPlugins: [remarkMath3, createQuest],
      rehypePlugins: [rehypeKatex],
    }
  });

  return {source, questData: data as QuestData};
}

function addBlankHeadLine(content: string, comps: string[]) {
  const compsStr = comps.join('|');
  const re = new RegExp(`^<(${compsStr})( |([^>]*))>`, 'gm');
  return content.replace(re, '$&' + '\n');
}