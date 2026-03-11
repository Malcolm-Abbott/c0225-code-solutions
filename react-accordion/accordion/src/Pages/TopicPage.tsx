import './TopicPage.css';
import type { Topic } from '../App';
import { TopicCard } from '../Components/TopicCard';

interface TopicPageProps {
  topics: Topic[];
}

export function TopicPage({ topics }: TopicPageProps) {
  return (
    <div className="topic-page">
      <TopicCard topics={topics} />
    </div>
  );
}
