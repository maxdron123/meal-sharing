"use client";
import React, { useEffect, useState } from "react";
import styles from "./MealList.module.css";
import MealCard from "./MealCard";
import api from "@/utils/api";

function getRandomMeals(meals, count) {
  const shuffled = [...meals].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function MealsList({ full = true }) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedMeals, setDisplayedMeals] = useState([]);
  const [sortKey, setSortKey] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  const fetchMeals = (title = "", sortKeyParam = "", sortDirParam = "asc") => {
    setLoading(true);

    const params = new URLSearchParams();
    if (title) params.append("title", title);
    if (sortKeyParam) {
      params.append("sortKey", sortKeyParam);
      params.append("sortDir", sortDirParam);
    }

    const url = params.toString()
      ? api(`/meals?${params.toString()}`)
      : api("/meals");

    console.log("Fetching meals with URL:", url);
    console.log("Sort params:", {
      sortKey: sortKeyParam,
      sortDir: sortDirParam,
    });

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("Received data:", data);
        setMeals(data);
        setDisplayedMeals(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching meals:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMeals(searchTerm, sortKey, sortDir);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    fetchMeals("", sortKey, sortDir);
  };

  const handleSortKeyChange = (e) => {
    const newSortKey = e.target.value;
    setSortKey(newSortKey);
    fetchMeals(searchTerm, newSortKey, sortDir);
  };

  const handleSortDirChange = (e) => {
    const newSortDir = e.target.value;
    setSortDir(newSortDir);
    fetchMeals(searchTerm, sortKey, newSortDir);
  };

  const handleClearSort = () => {
    setSortKey("");
    setSortDir("asc");
    fetchMeals(searchTerm, "", "asc");
  };

  if (loading) return <p>Loading meals...</p>;
  if (!full) {
    const randomMeals = getRandomMeals(displayedMeals, 5);
    return (
      <div className={styles.containerAlt}>
        <h2 className={styles.heading}>Meals</h2>
        {randomMeals.length === 0 ? (
          <p>No meals found.</p>
        ) : (
          <div className={styles.gridAlt}>
            {randomMeals.map((meal) => (
              <MealCard
                id={meal.id}
                title={meal.title}
                description={meal.description}
                location={meal.location}
                price={meal.price}
                image={meal.image}
                availableSpots={meal.available_spots}
                maxReservations={meal.max_reservations}
                averageRating={meal.average_rating}
                reviewCount={meal.review_count}
                key={meal.id}
                single={false}
              />
            ))}
          </div>
        )}
      </div>
    );
  } else if (full) {
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>Meals</h2>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search meals by title..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className={styles.clearButton}
              >
                Clear
              </button>
            )}
          </div>
        </form>

        <div className={styles.sortControls}>
          <div className={styles.sortContainer}>
            <label htmlFor="sortKey" className={styles.sortLabel}>
              Sort by:
            </label>
            <select
              id="sortKey"
              value={sortKey}
              onChange={handleSortKeyChange}
              className={styles.sortSelect}
            >
              <option value="">Default</option>
              <option value="when">Date</option>
              <option value="price">Price</option>
              <option value="max_reservations">Max Reservations</option>
              <option value="average_rating">Rating</option>
            </select>
          </div>

          {sortKey && (
            <div className={styles.sortContainer}>
              <label htmlFor="sortDir" className={styles.sortLabel}>
                Direction:
              </label>
              <select
                id="sortDir"
                value={sortDir}
                onChange={handleSortDirChange}
                className={styles.sortSelect}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          )}

          {sortKey && (
            <button
              type="button"
              onClick={handleClearSort}
              className={styles.clearButton}
            >
              Clear Sort
            </button>
          )}
        </div>

        {(searchTerm || sortKey) && (
          <div className={styles.searchInfo}>
            {searchTerm && (
              <>
                Showing results for "{searchTerm}" ({displayedMeals.length} meal
                {displayedMeals.length !== 1 ? "s" : ""} found)
              </>
            )}
            {searchTerm && sortKey && <br />}
            {sortKey && (
              <>
                Sorted by{" "}
                {sortKey === "when"
                  ? "Date"
                  : sortKey === "max_reservations"
                  ? "Max Reservations"
                  : sortKey === "average_rating"
                  ? "Rating"
                  : "Price"}{" "}
                ({sortDir === "asc" ? "Ascending" : "Descending"})
              </>
            )}
          </div>
        )}

        {displayedMeals.length === 0 ? (
          <p>
            {searchTerm
              ? `No meals found matching "${searchTerm}".`
              : "No meals found."}
          </p>
        ) : (
          <div className={styles.grid}>
            {displayedMeals.map((meal) => (
              <MealCard
                id={meal.id}
                title={meal.title}
                description={meal.description}
                location={meal.location}
                price={meal.price}
                image={meal.image}
                availableSpots={meal.available_spots}
                maxReservations={meal.max_reservations}
                averageRating={meal.average_rating}
                reviewCount={meal.review_count}
                key={meal.id}
                single={false}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}
