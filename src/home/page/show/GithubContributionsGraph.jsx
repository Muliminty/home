import React, { useEffect, useRef, useState } from "react";
import styles from "./GithubContributionsGraph.module.scss";
const CACHE_KEY = "github_contributions1";
const DEFAULT_CACHE_DURATION = 24 * 60 * 60 * 1000;
const DEFAULT_UPDATE_INTERVAL = 12 * 60 * 60 * 1000;

const DEFAULT_COLORS = ["#e6eef4", "#b3cce0", "#80aacc", "#6688aa", "#4d6680"];

const GithubContributionsGraph = ({
  username,
  year,
  cacheOptions = {},
  customColors,
}) => {
  const [contributions, setContributions] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const LEVEL_COLORS = customColors || DEFAULT_COLORS;

  const {
    enableCache = true,
    duration = DEFAULT_CACHE_DURATION,
    updateInterval = DEFAULT_UPDATE_INTERVAL,
  } = cacheOptions;

  const fetchContributions = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${username}`
      );
      const data = await response.json();
      console.log('data: ', data);
      const today = new Date();
      const lastYear = new Date(today);
      lastYear.setFullYear(today.getFullYear() - 1);

      const thisYearContributions = year
        ? data.contributions.filter(
          (contrib) => new Date(contrib.date).getFullYear() === year
        )
        : data.contributions.filter(
          (contrib) =>
            new Date(contrib.date) >= lastYear &&
            new Date(contrib.date) <= today
        );

      thisYearContributions.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setContributions(thisYearContributions);

      if (enableCache) {
        const cacheData = {
          contributions: thisYearContributions,
          timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      }
    } catch (error) {
      console.error("Error fetching contributions:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCachedData = () => {
    if (!enableCache) return false;
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { contributions, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < duration) {
        setContributions(contributions);
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (!loadCachedData()) {
      fetchContributions();
    }
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollLeft = containerRef.current.scrollWidth;
      }
    }, 0);

    if (enableCache) {
      const intervalId = setInterval(fetchContributions, updateInterval);
      return () => clearInterval(intervalId);
    }
  }, []);

  const getColor = (level) => LEVEL_COLORS[level] || LEVEL_COLORS[0];

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= containerRef.current.scrollWidth / 2;
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += containerRef.current.scrollWidth / 2;
    }
  };

  return (
    // 在 JSX 代码中应用样式
    <div className={styles.githubGraphContainer}>
      {loading ? (
        <div className={styles.loadingContainer}>
          <span className="animate-spin">🔄</span>
        </div>
      ) : (
        <>
          <button
            onClick={scrollLeft}
            className={`${styles.arrow} ${styles.leftArrow} ${isHovering ? styles.showArrow : ""}`}
          >
            ⬅
          </button>
          <button
            onClick={scrollRight}
            className={`${styles.arrow} ${styles.rightArrow} ${isHovering ? styles.showArrow : ""}`}
          >
            ➡
          </button>
          <div
            ref={containerRef}
            id="githubGraph"
            className={styles.githubGraph}
          >
            {contributions.map((contrib, index) => (
              <div
                key={index}
                className={styles.githubGraphBox}
                style={{ backgroundColor: getColor(contrib.level) }}
              ></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GithubContributionsGraph;
