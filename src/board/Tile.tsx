import React, { MouseEventHandler } from "react";

export default function Tile({
  tile,
  onClick,
  selected,
  inline,
}: {
  tile: string;
  onClick?: MouseEventHandler;
  selected?: boolean;
  inline?: boolean;
}) {
  const classes = ["tile"];
  selected && classes.push("selected");
  inline && classes.push("inline");
  return (
    <span className={classes.join(" ")} data-tile={tile} onClick={onClick} />
  );
}
