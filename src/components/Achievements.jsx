import { memo, useState } from 'react';
import { ACHIEVEMENT_CATEGORIES, getAllAchievements, getAchievementsByCategory } from '../constants/achievementConstants';
import { useAchievements } from '../hooks/useAchievements';
import { useBooks } from '../hooks/useBooks';

function Achievements() {
  const { books } = useBooks();
  const { userAchievements, isUnlocked, getAchievementProgress } = useAchievements();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { key: 'all', name: 'All', icon: '🏆' },
    { key: ACHIEVEMENT_CATEGORIES.READING, name: 'Reading', icon: '📚' },
    { key: ACHIEVEMENT_CATEGORIES.EMOJI, name: 'Emojis', icon: '😊' },
    { key: ACHIEVEMENT_CATEGORIES.GENRE, name: 'Genres', icon: '📖' },
    { key: ACHIEVEMENT_CATEGORIES.SPEED, name: 'Speed', icon: '⚡' },
    { key: ACHIEVEMENT_CATEGORIES.SOCIAL, name: 'Social', icon: '✍️' }
  ];

  const getFilteredAchievements = () => {
    if (selectedCategory === 'all') {
      return getAllAchievements();
    }
    return getAchievementsByCategory(selectedCategory);
  };

  const getUnlockedCount = () => {
    return userAchievements.length;
  };

  const getTotalCount = () => {
    return getAllAchievements().length;
  };

  const AchievementCard = ({ achievement }) => {
    const unlocked = isUnlocked(achievement.id);
    const progress = getAchievementProgress(achievement.id, books);

    return (
      <div className={`achievement-card card ${unlocked ? 'unlocked' : 'locked'}`}>
        <div className="achievement-header">
          <span className="achievement-icon">{achievement.icon}</span>
          <div className="achievement-info">
            <h4 className="achievement-name">{achievement.name}</h4>
            <p className="achievement-description">{achievement.description}</p>
          </div>
          {unlocked && <span className="achievement-status">✅</span>}
        </div>
        
        {!unlocked && (
          <div className="achievement-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <span className="progress-text">
              {progress.current} / {progress.target}
            </span>
          </div>
        )}
        
        {unlocked && (
          <div className="achievement-unlocked">
            <span className="unlocked-text">Unlocked!</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <h2>Achievements</h2>
        <div className="achievements-stats">
          <span className="achievement-count">
            {getUnlockedCount()} / {getTotalCount()} unlocked
          </span>
          <div className="overall-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(getUnlockedCount() / getTotalCount()) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="achievement-categories">
        {categories.map(category => (
          <button
            key={category.key}
            className={`category-tab ${selectedCategory === category.key ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.key)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      <div className="achievements-grid">
        {getFilteredAchievements().map(achievement => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
}

export default memo(Achievements);