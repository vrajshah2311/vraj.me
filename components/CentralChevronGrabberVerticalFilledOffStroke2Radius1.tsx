import React from 'react';

interface SvgProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function CentralChevronGrabberVerticalFilledOffStroke2Radius1(props: SvgProps) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 6.4141L15.2929 9.70699C15.6834 10.0975 16.3166 10.0975 16.7071 9.70699C17.0976 9.31647 17.0976 8.6833 16.7071 8.29278L13.2374 4.82311C12.554 4.13969 11.446 4.13969 10.7626 4.82311L7.29289 8.29278C6.90237 8.6833 6.90237 9.31647 7.29289 9.70699C7.68342 10.0975 8.31658 10.0975 8.70711 9.70699L12 6.4141ZM7.29289 14.2928C7.68342 13.9023 8.31658 13.9023 8.70711 14.2928L12 17.5857L15.2929 14.2928C15.6834 13.9023 16.3166 13.9023 16.7071 14.2928C17.0976 14.6833 17.0976 15.3165 16.7071 15.707L13.2374 19.1767C12.554 19.8601 11.446 19.8601 10.7626 19.1767L7.29289 15.707C6.90237 15.3165 6.90237 14.6833 7.29289 14.2928Z" fill="currentColor" />
    </svg>
  );
}
