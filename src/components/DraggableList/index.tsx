import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { List } from "@mui/material";
import type { ReactNode } from "react";

type DraggableListProps = {
  items: any[] | undefined;
  setItems: (items: any) => void;
  children: ReactNode;
};

const DraggableList = ({ items, setItems, children }: DraggableListProps) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (items && active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      setItems((items: unknown[]) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {items && (
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <List>{children}</List>
        </SortableContext>
      )}
    </DndContext>
  );
};

export default DraggableList;
