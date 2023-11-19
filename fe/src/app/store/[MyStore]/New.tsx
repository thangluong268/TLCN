import React from "react";
interface NewProps {
  title: string;
}

function New(props: NewProps) {
  const { title } = props;
  return <div>New {title}</div>;
}

export default New;
