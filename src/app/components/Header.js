import React from 'react';


export default function Header(){
  return <div style={headerStyle}>Zurich Customer Portal</div>;
};

const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  fontSize:20,
  height: '64px',
  paddingInline: '48px',
  lineHeight: '64px',
  backgroundColor: '#23366f',
};
