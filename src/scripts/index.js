import "regenerator-runtime"; /* for async await transpile */
import "../styles/main.css";

const restaurantList = document.getElementById("restaurant-list");

const fetchRestaurants = async () => {
  try {
    const response = await fetch("data/DATA.json");
    const data = await response.json();
    return data.restaurants;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
};

const createRestaurantCard = (restaurant) => {
  const card = document.createElement("article"); // Changed to article for semantic HTML
  card.className = "card";
  card.setAttribute("tabindex", "0"); // Make card focusable
  card.setAttribute("role", "listitem");
  card.setAttribute(
    "aria-label",
    `${restaurant.name} restaurant in ${restaurant.city}`
  );

  const imageContainer = document.createElement("div");
  imageContainer.className = "card-image";

  // Create img element instead of using background-image
  const image = document.createElement("img");
  image.src = restaurant.pictureId;
  image.alt = `Restaurant ${restaurant.name} in ${restaurant.city}`; // Descriptive alt text
  image.className = "restaurant-image";

  const city = document.createElement("span");
  city.className = "city";
  city.setAttribute("aria-label", `Located in ${restaurant.city}`);
  city.textContent = restaurant.city;

  imageContainer.appendChild(image);
  imageContainer.appendChild(city);

  const content = document.createElement("div");
  content.className = "card-content";

  const rating = document.createElement("div");
  rating.className = "card-rating";
  rating.setAttribute("aria-label", `Rating: ${restaurant.rating} out of 5`);
  rating.textContent = `Rating: ${restaurant.rating}`;

  const name = document.createElement("h3");
  name.className = "card-title";
  name.textContent = restaurant.name;

  const description = document.createElement("p");
  description.className = "card-description";
  description.textContent = restaurant.description.substring(0, 100) + "...";

  content.appendChild(rating);
  content.appendChild(name);
  content.appendChild(description);

  card.appendChild(imageContainer);
  card.appendChild(content);

  // Add keyboard interaction
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card.click();
    }
  });

  return card;
};

const displayRestaurants = async () => {
  const restaurants = await fetchRestaurants();
  restaurants.forEach((restaurant) => {
    const card = createRestaurantCard(restaurant);
    restaurantList.appendChild(card);
  });
};

// Sidebar functionality
const initSidebar = () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const closeButton = document.querySelector(".close-button");
  const sidebar = document.getElementById("sidebar");

  // Create overlay element
  const overlay = document.createElement("div");
  overlay.className = "sidebar-overlay";
  document.body.appendChild(overlay);

  const toggleSidebar = () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", !isExpanded);
    sidebar.setAttribute("aria-hidden", isExpanded);
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");

    // Prevent body scrolling when sidebar is open
    document.body.style.overflow = isExpanded ? "auto" : "hidden";

    // If sidebar is opening, focus the close button for better accessibility
    if (!isExpanded) {
      closeButton.focus();
    }
  };

  // Toggle sidebar on hamburger button click
  menuToggle.addEventListener("click", toggleSidebar);

  // Close sidebar on close button click
  closeButton.addEventListener("click", toggleSidebar);

  // Close sidebar when clicking overlay
  overlay.addEventListener("click", toggleSidebar);

  // Handle keyboard accessibility
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("active")) {
      toggleSidebar();
    }
  });

  // Trap focus within sidebar when it's open
  sidebar.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      const focusableElements = sidebar.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // If shift + tab and focus is on first element, move to last
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      // If tab and focus is on last element, move to first
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
};

// Call the function after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
  displayRestaurants();
});
