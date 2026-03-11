import type { Topic } from '../App';
import { useState } from 'react';
import '../Pages/TopicPage.css';

type TopicCardProps = {
  topics: Topic[];
};

export function TopicCard({ topics }: TopicCardProps) {
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);

  return (
    <div className="topic-card">
      <ul className="flex flex-col gap-4">
        {topics.map((topic) => (
          <TopicItem
            key={topic.id}
            topic={topic}
            activeTopic={activeTopic}
            setActiveTopic={setActiveTopic}
          />
        ))}
      </ul>
    </div>
  );
}

type TopicItemProps = {
  topic: Topic;
  activeTopic: Topic | null;
  setActiveTopic: (topic: Topic | null) => void;
};

function TopicItem({ topic, activeTopic, setActiveTopic }: TopicItemProps) {
  function handleClick() {
    if (!activeTopic) setActiveTopic(topic);
    if (activeTopic?.id === topic.id) setActiveTopic(null);
    if (activeTopic?.id !== topic.id) setActiveTopic(topic);
  }

  return (
    <li className="topic-item">
      <h1
        onClick={handleClick}
        className="cursor-pointer text-2xl font-bold mb-1">
        {topic.title}
      </h1>
      <p>{activeTopic?.id === topic.id ? topic.content : ''}</p>
    </li>
  );
}
