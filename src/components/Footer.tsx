import React from 'react';
import { Status } from '../types/Status';

type Props = {
  count: number;
  hasCompleted: boolean;
  filter: Status;
  setFilter: (status: Status) => void;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  count,
  hasCompleted,
  filter,
  setFilter,
  clearCompleted,
}) => (
  <footer className="todoapp__footer">
    <span>{count} items left</span>

    {Object.values(Status).map(status => (
      <button
        key={status}
        className={filter === status ? 'selected' : ''}
        onClick={() => setFilter(status)}
      >
        {status}
      </button>
    ))}

    <button disabled={!hasCompleted} onClick={clearCompleted}>
      Clear completed
    </button>
  </footer>
);
