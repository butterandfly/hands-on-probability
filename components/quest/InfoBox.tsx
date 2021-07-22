import MD from './MD'

interface InfoBoxProps {
  children?: any,
  borderColor: string,
  backgroundColor: string,
  title: string,
}

export function InfoBox({children, title, borderColor, backgroundColor}: InfoBoxProps) {
  return (<div className="root">
    <div className="box-header">{title}</div>
    <div className="box-body"><MD>{children}</MD></div>
    <style jsx>{`
      .root {
        border-left: 3px solid ${borderColor};
        display: flex;
        background: ${backgroundColor};
      }

      .root .box-header {
        line-height: 18px;
        margin: 16px 0;
        font-size: small;
        padding: 0 8px;
      }

      .root .box-body {
        padding: 0;
      }
    `}</style>
  </div>)
}

interface IdeaProps {
  children?: any,
}

export function Idea({children}: IdeaProps) {
  const title = '💡'
  return <InfoBox title={title} borderColor="#ffe000" backgroundColor="#fffff4">{children}</InfoBox>
}