import "../../styles/RibbitText.css";
import {
  CSSProperties,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface RibbitTextProps {
  className?: string;
  maxLines?: number;
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

const RibbitText = ({
  className,
  maxLines = 6,
  text,
}: RibbitTextProps) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const links = detectLinks(text);
  const content: React.ReactNode[] = [];
  let cursor = 0;

  useLayoutEffect(() => {
    const textElement = textRef.current;
    if (!textElement || isExpanded) return;

    const updateOverflow = () => {
      setIsOverflowing(
        textElement.scrollHeight > textElement.clientHeight + 1
      );
    };

    updateOverflow();

    const resizeObserver = new ResizeObserver(updateOverflow);
    resizeObserver.observe(textElement);

    return () => resizeObserver.disconnect();
  }, [isExpanded, text]);

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

  return (
    <div className="ribbit-text-wrapper">
      <p
        className={`${className || ""} ribbit-text ${
          isExpanded ? "expanded" : "collapsed"
        }`}
        ref={textRef}
        style={{ WebkitLineClamp: maxLines } as CSSProperties}
      >
        {content}
      </p>
      {isOverflowing ? (
        <button
          type="button"
          className="ribbit-text-toggle"
          aria-expanded={isExpanded}
          onClick={(event) => {
            event.stopPropagation();
            setIsExpanded((expanded) => !expanded);
          }}
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      ) : null}
    </div>
  );
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

export default RibbitText;
