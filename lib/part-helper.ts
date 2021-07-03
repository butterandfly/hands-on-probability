import {PartProgressData, PartData, Piece} from './datas'
import {buildersMap, mdxComponents, questComponents} from '../components/mdx-components'

export function createPartData(partID: string, content: string): PartData {
  const pieces = getPieces(content, Object.keys(mdxComponents));
  const questPiece = pieces.find((piece) => {
    return questComponents.includes(piece.componentName);
  })

  if (!questPiece) throw new Error('There is no quest in part:\n' + content);
  const quest = buildersMap[questPiece.componentName].createQuestData(questPiece);

  return {
    id: partID,
    content: content,
    pieces: pieces,
    quest: quest,
  };
}

export function initPartProgressData(partData: PartData) {
  const progress: PartProgressData  =  {
    partID: partData.id,
    isFinished: false,
    isLocked: !isFirstPart(),
  }

  const type = partData.quest.questType;
  const initFunc = buildersMap[type].initQuestProgressData;
  progress.questProgress = initFunc(partData.quest);

  return progress;

  function isFirstPart() {
    const partNumStr = partData.id.split('.')[1];
    return partNumStr === '01';
  }
}

export function getPieces(partContent: string, validComps: string[], ) {
  const compsStr = validComps.join('|');
  const noWrapCompRE = `(^<(${compsStr})( |([^>]*))\\/>)`
  const wrapCompRE = `(^((<(${compsStr}))( |([^\\/>]*))>([^])*?<\\/(${compsStr})>))`
  const regex = new RegExp(noWrapCompRE + '|' + wrapCompRE, 'gms');

  // Split to pieces
  const reactComps = partContent.match(regex);
  if (!reactComps) {
    return [createMDPiece(partContent)];
  }

  // Set place-holder, record the component
  const temp = partContent.replace(regex, '${placeholder}$')
  const mds = temp.split('${placeholder}$');

  // Rebuild the pieces array
  const pieceArray: Piece[] = [];
  for (let i = 0; i < reactComps.length; i++) {
    const mdContent = mds[i].trim();
    if (mdContent) {
      pieceArray.push(createMDPiece(mdContent));
    }

    const compContent = reactComps[i];
    pieceArray.push({
      type: 'component',
      content: compContent,
      componentName: getComponentName(compContent),
      props: getProps(compContent),
      innerContent: getInnerContent(compContent),
    });
  }
  const mdContent = mds[reactComps.length].trim();
  if (mdContent) {
    pieceArray.push(createMDPiece(mdContent));
  }

  return pieceArray;
}

function createMDPiece(content: string): Piece {
  return {
    type: 'md',
    content: content,
    componentName: 'MD',
    innerContent: content,
    props: {},
  }
}

export function getComponentName(compContent: string) {
  const matches = compContent.match(/^<\w+/) || [];
  if (matches.length < 1) return '';

  return matches[0].substring(1);
}

export function getProps(compContent: string) {
  const tagContent = (compContent.match(/<([^>]*)>/))![0];

  const pairs: {[key: string]: string} = {};
  (tagContent.match(/[a-zA-Z0-9]+=\"([^"]*)\"/gm) || []).forEach((pair: string) => {
    const data = pair.split('='); 
    pairs[data[0]] = data[1].replace(/"/g, '');
  });

  return pairs;
}

export function getInnerContent(compContent: string) {
  const compName = getComponentName(compContent);
  const tag1 = new RegExp(`^<${compName}[^>]*>`, 'gm');
  const tag2 = new RegExp(`^<\\/${compName}>`, 'gm');
  return compContent.replace(tag1, '').replace(tag2, '');
}