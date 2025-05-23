import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type Modifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { List } from "@mui/material";
import { useMemo, type ReactNode } from "react";

type DraggableListProps = {
  items: any[] | undefined;
  setItems: (items: any) => void;
  modifiers?: Modifier[];
  children: ReactNode;
};

const DraggableList = ({ items, setItems, modifiers, children }: DraggableListProps) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (items && active.id !== over?.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  const itemIds = useMemo(() => items!.map(item => item.id), [items]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={modifiers ?? []}
    >
      {items && (
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <List>{children}</List>
        </SortableContext>
      )}
    </DndContext>
  );
};

export default DraggableList;
