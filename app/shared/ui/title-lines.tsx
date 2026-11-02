/** Splits a multi-line heading into lines that can be revealed one after another. */
export function TitleLines({ children }: { children: string }) {
  if (!children.includes("\n")) return <>{children}</>;
  return (
    <>
      {children.split("\n").map((line, index) => (
        <span className="title-line" key={index}>
          <span style={{ transitionDelay: `${index * 65}ms` }}>{line}</span>
        </span>
      ))}
    </>
  );
}
