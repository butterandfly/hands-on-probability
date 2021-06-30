interface MathBoxProps {
  children: any,
  header: string,
  color: string,
}

export default function MathBox({children, header, color}: MathBoxProps) {
  return (<div className="root">
    <span className="header">{header}</span>
    {children}

    <style jsx>{`
      .root {
        margin-top: 24px;
        margin-bottom: 16px;
        border: 1px solid ${color};
        border-radius: 4px;
        padding: 8px 16px;
      }

      .header {
        color: ${color};
        font-weight: bold;
        display: inline-block;
        background: white;
        position: absolute;
        transform: translate(0, -20px);
        font-size: 18px;
        padding: 0 4px;
      }

    `}</style>
  </div>)
}

export function Definition({children}: any) {
  return (<div className="root">
    <MathBox header="Definition" color="seagreen">
      {children}
    </MathBox>
    <style jsx>{``}</style>
  </div>)
}

export function Theorem({children}: any) {
  return (<div className="root">
    <MathBox header="Theorem" color="mediumpurple">
      {children}
    </MathBox>
    <style jsx>{``}</style>
  </div>)
}

export function Axiom({children}: any) {
  return (<div className="root">
    <MathBox header="Axiom" color="indianred">
      {children}
    </MathBox>
    <style jsx>{``}</style>
  </div>)
}