export const CircleBritishFlag = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      fill="url(#br)"
      d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12Z"
    />
    <defs>
      <pattern
        id="br"
        width={1}
        height={1}
        patternContentUnits="objectBoundingBox"
      >
        <use xlinkHref="#british" transform="matrix(.00629 0 0 .00629 -.5 0)" />
      </pattern>
      <image
        xlinkHref="data:image/png;base64,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"
        id="british"
        width={318}
        height={159}
      />
    </defs>
  </svg>
);
