// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {getSectionData} from '../../../lib/lesson';
import {SectionData} from '../../../lib/datas'

// type Data = {
//   id: string | string[],
//   content: string,
//   title: string,
//   parts: PartData[],
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SectionData>
) {
  const { sid } = req.query
  const sData = await getSectionData(sid.toString());

  res.status(200).json(sData);
}
