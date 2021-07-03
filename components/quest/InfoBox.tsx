import MD from './MD'

interface InfoBoxProps {
  children?: any,
  borderColor: string,
  headerBackground: string,
  title: string,
}

export function InfoBox({children, title, borderColor, headerBackground}: InfoBoxProps) {
  return (<div className="root">
    <div className="box-header">{title}</div>
    <div className="box-body"><MD>{children}</MD></div>
    <style jsx>{`
      .root {
        border-left: 5px solid ${borderColor};
      }

      .root .box-header {
        padding: 8px;
        color: #3e3e3e;
        background: ${headerBackground};
        font-size: 1.1em;;
      }

      .root .box-body {
        padding: 4px 16px;
      }
    `}</style>
  </div>)
}

interface IdeaProps {
  children?: any,
}

export function Idea({children}: IdeaProps) {
  const title = '💡 Idea'
  return <InfoBox title={title} borderColor="#ffe000" headerBackground="#ffffe8">{children}</InfoBox>
}