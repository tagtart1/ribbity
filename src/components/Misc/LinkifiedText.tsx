import "../../styles/LinkifiedText.css";

interface LinkifiedTextProps {
  className?: string;
  text: string;
}

interface DetectedLink {
  end: number;
  href: string;
  start: number;
  text: string;
}

const URL_PATTERN = /(?:https?:\/\/|www\.)[^\s<]+/gi;
const TRAILING_PUNCTUATION = /[.,!?;:'"]$/;

const countCharacter = (value: string, character: string): number =>
  value.split(character).length - 1;

const trimTrailingCharacters = (value: string): string => {
  let trimmedValue = value;

  while (TRAILING_PUNCTUATION.test(trimmedValue)) {
    trimmedValue = trimmedValue.slice(0, -1);
  }

  const bracketPairs = [
    ["(", ")"],
    ["[", "]"],
    ["{", "}"],
  ];

  bracketPairs.forEach(([openingBracket, closingBracket]) => {
    while (
      trimmedValue.endsWith(closingBracket) &&
      countCharacter(trimmedValue, closingBracket) >
        countCharacter(trimmedValue, openingBracket)
    ) {
      trimmedValue = trimmedValue.slice(0, -1);
    }
  });

  return trimmedValue;
};

export const detectLinks = (text: string): DetectedLink[] => {
  const links: DetectedLink[] = [];
  const urlPattern = new RegExp(URL_PATTERN.source, "gi");
  let match = urlPattern.exec(text);

  while (match) {
    const linkText = trimTrailingCharacters(match[0]);

    if (linkText) {
      const start = match.index;
      links.push({
        start,
        end: start + linkText.length,
        href: linkText.toLowerCase().startsWith("www.")
          ? `https://${linkText}`
          : linkText,
        text: linkText,
      });
    }

    match = urlPattern.exec(text);
  }

  return links;
};

const ExternalLink = ({ href, text }: { href: string; text: string }) => (
  <a
    className="ribbit-link"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(event) => event.stopPropagation()}
  >
    {text}
  </a>
);

const LinkifiedText = ({ className, text }: LinkifiedTextProps) => {
  const links = detectLinks(text);
  const content: React.ReactNode[] = [];
  let cursor = 0;

  links.forEach((link) => {
    if (cursor < link.start) {
      content.push(text.slice(cursor, link.start));
    }

    content.push(
      <ExternalLink
        href={link.href}
        text={link.text}
        key={`${link.start}-${link.href}`}
      />
    );
    cursor = link.end;
  });

  if (cursor < text.length) {
    content.push(text.slice(cursor));
  }

  return <p className={className}>{content}</p>;
};

export const RibbitLinkPreview = ({ text }: { text: string }) => {
  const links = detectLinks(text);

  if (!links.length) return null;

  return (
    <div className="ribbit-link-preview" aria-label="Detected links">
      <span>Link preview:</span>
      {links.map((link) => (
        <ExternalLink
          href={link.href}
          text={link.text}
          key={`${link.start}-${link.href}`}
        />
      ))}
    </div>
  );
};

export default LinkifiedText;
