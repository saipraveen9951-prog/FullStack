import React from 'react';
import TodoItem from './TodoItem';
import Loader from './Loader';
import EmptyState from './EmptyState';

export default function TodoList({
  todos,
  loading,
  onToggle,
  onUpdate,
  onDeleteTrigger,
}) {
  if (loading) {
    return <Loader count={3} />;
  }

  if (todos.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDeleteTrigger={onDeleteTrigger}
          existingTodos={todos}
        />
      ))}
    </div>
  );
}
