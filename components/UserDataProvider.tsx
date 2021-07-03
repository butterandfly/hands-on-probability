import { useState } from 'react';
import { createContext, useContext } from 'react';
import { LessonProgressData, LessonProgressesMap, PartProgressData, PartProgressesMap, SectionProgressData, SectionProgressesMap } from '../lib/datas';
import { nextPartID, nextSectionID } from '../lib/utils';
import { isQuestFinished, QuestProgressData } from './quest/questData';

interface UserData {
  userName: string,
  progresses: LessonProgressesMap,
  updateQuestProgress?: (partID: string, questProgress: QuestProgressData) => void,
  updatePartProgress?: (partProgress: PartProgressData) => void,
  updateLessonProgress?: any,
  updateProgresses?: (progresses: LessonProgressesMap) => void,
  activateSection?: (sectionID: string) => void,
  findQuestProgress?: (partID: string) => QuestProgressData,
}

export const UserDataContext = createContext<UserData>({
  userName: 'anonymous',
  progresses: {},
});

// export const UserDataContext = createContext<Partial<UserData>>({});

export function UserDataWrapper({ children }: any) {
  const [userData, setUserData] = useState<UserData>({
    userName: 'anonymous',
    progresses: {},
  })

  const updatePartProgress = (partProgress: PartProgressData) => {
    const newP = JSON.parse(JSON.stringify(userData.progresses)) as LessonProgressesMap;
    const lessonID = partProgress.partID.substring(0, 2);
    const sectionID = partProgress.partID.substring(0, 5);

    const lessonP = newP[lessonID];
    const sectionP = lessonP.sectionProgresses[sectionID];
    sectionP.partProgresses[partProgress.partID] = partProgress;

    if (partProgress.isFinished) {
      const unlockResult = unlockNextPart_(partProgress.partID, sectionP.partProgresses)

      if (!unlockResult) {
        // Finish this section, then unlock next section
        sectionP.isFinished = true;
        const unlockSectionResult = unlockNextSection_(sectionP.sectionID, lessonP.sectionProgresses);

        // If no next section, then finish this lesson
        if (!unlockSectionResult) lessonP.isFinished = true;
      }
    }


    setUserData({
      ...userData,
      progresses: newP,
    })
  }

  const updateLessonProgress = (progress: LessonProgressData) => {
    const progresses = {
      ...userData.progresses,
      [progress.lessonID]: progress
    }
    setUserData({
      ...userData,
      progresses
    });
  }

  const activateSection = (sectionID: string) => {
    // Find lesson prog
    const lessonID = sectionID.substring(0, 2);
    const lessonProg = findLessonProgress(lessonID, userData);
    updateLessonProgress({
      ...lessonProg,
      activeSection: sectionID,
    });
  }

  const updateQuestProgress = (partID: string, newQuestProg: QuestProgressData) => {
    const partProg = findPartProgress(partID, userData);
    const newPartProg = {
      ...partProg,
      questProgress: newQuestProg,
      isFinished: isQuestFinished(newQuestProg.status),
    }
    updatePartProgress(newPartProg);
  }

  const findQuestProgress = (partID: string) => {
    return _findQuestProgress(partID, userData);
  }

  const updateProgresses = (progresses: LessonProgressesMap) => {
    setUserData(_updateProgresses(progresses, userData));
  }

  return (
    <UserDataContext.Provider value={{...userData, 
      updatePartProgress, 
      updateLessonProgress, 
      activateSection,
      updateQuestProgress,
      findQuestProgress,
      updateProgresses,
      }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserDataContext() {
  return useContext(UserDataContext);
}

const _updateProgresses = (progresses: LessonProgressesMap, userData: UserData) => {
  return {
    ...userData,
    progresses,
  }
}

const _findQuestProgress= (partID: string, userData: UserData) =>  {
  return findPartProgress(partID, userData).questProgress;
}

export const findPartProgress= (id: string, userData: UserData) =>  {
  if (id.length !== 8) throw new Error('Not valid section id: ' + id);
  const lessonID = id.substring(0, 2);
  const sectionID = id.substring(0, 5);
  return userData.progresses[lessonID].sectionProgresses[sectionID].partProgresses[id];

}

export const findSectionProgress= (id: string, userData: UserData) =>  {
  if (id.length !== 5) throw new Error('Not valid section id: ' + id);

  const lessonID = id.substring(0, 2);
  return userData.progresses[lessonID].sectionProgresses[id];

}

export const findLessonProgress= (id: string, userData: UserData) =>  {
  if (id.length !== 2) throw new Error('Not valid lesson id: ' + id);

  return userData.progresses[id];
}

export function findLastSectionProgress(lessonProg: LessonProgressData) {
  const progs = getSortedSectionProgresses(lessonProg);
  return progs[progs.length -1];
}

// Find by current section id.
export function findNextSectionProgress(current: string, userData: UserData) {
  const lessonID = current.substring(0, 2);
  const lessonProg = findLessonProgress(lessonID, userData);
  const progs = getSortedSectionProgresses(lessonProg)
  const i = progs.findIndex((prog) => prog.sectionID === current);
  return progs[i + 1];
}

export function getSortedSectionProgresses(lessonProg: LessonProgressData) {
  return Object.values(lessonProg.sectionProgresses);
}

// Find the first unfinished section.
// If all sections are finished, return undefined.
export function findUnfinishedSection(lesson: LessonProgressData) {
  const sectionProgs = lesson.sectionProgresses;
  return Object.values(sectionProgs).find((prog) => {
    if (prog.isFinished) return false;
    return true;
  });
}

// Unlock next part. If there is no next part, return false.
// Mutable function.
function unlockNextPart_(currentID: string, progressesMap: PartProgressesMap) {
  const nextID = nextPartID(currentID);
  if (!progressesMap[nextID]) return false;

  // Unlock next part
  const nextProgress = progressesMap[nextID];
  nextProgress.isLocked = false;
  return true;
}

// Unlock next section. If there is no next section, return false.
// Mutable function.
function unlockNextSection_(currentID: string, progressesMap: SectionProgressesMap) {
  const nextID = nextSectionID(currentID);
  if (!progressesMap[nextID]) return false;

  // Unlock next part
  const nextProgress = progressesMap[nextID];
  nextProgress.isLocked = false;
  return true;
}