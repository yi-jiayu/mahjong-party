import React, { useRef } from "react";
import { useDrag, useDrop, XYCoord } from "react-dnd";
import { DraggedTile } from "./types";

// Based on https://react-dnd.github.io/react-dnd/examples/sortable/simple

const Tile: React.FC<{
  tile: string;
  index: number;
  moveTile: (from: number, to: number) => void;
}> = ({ tile, index, moveTile }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: "tile",
    hover(item: DraggedTile, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get horizontal middle
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the left
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging leftwards
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      // Dragging rightwards
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      // Time to actually perform the action
      moveTile(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: "tile", tile, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));
  return (
    <div
      ref={ref}
      className={isDragging ? "tile dragging" : "tile draggable"}
      data-tile={tile}
    />
  );
};

const SortableRack: React.FC<{
  tiles: Array<{ tile: string; id: number }>;
  moveTile: (from: number, to: number) => void;
}> = ({ tiles, moveTile }) => {
  const elements = tiles.map(({ tile, id }, index) => (
    <Tile tile={tile} index={index} key={id} moveTile={moveTile} />
  ));
  return <div className="rack">{elements}</div>;
};

export default SortableRack;
