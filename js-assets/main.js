document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded, scripts running...");

  /* =========================
     HOMEPAGE FEATURES
  ========================== */

  // Fade-in header on load
  const header = document.querySelector(".container .header");
  if (header) {
    console.log("Homepage header found, applying fade-in...");
    header.style.opacity = 0;
    setTimeout(() => {
      header.style.transition = "opacity 1.5s ease-in-out";
      header.style.opacity = 1;
      console.log("Header fade-in complete");
    }, 200);
  }

  // Rotating tagline
  const tagline = document.querySelector("h2.header");
  if (tagline) {
    console.log(" Rotating tagline initialized");
    const taglines = [
      "Freshly Baked, Just for You",
      "Where Tradition Meets Taste",
      "Baked with Love, Served with Joy",
      "Your Neighborhood Bakery"
    ];
    let index = 0;
    setInterval(() => {
      index = (index + 1) % taglines.length;
      tagline.style.opacity = 0;
      setTimeout(() => {
        tagline.textContent = taglines[index];
        tagline.style.opacity = 1;
        console.log(`📝 Tagline updated: ${taglines[index]}`);
      }, 500);
    }, 4000);
  }

  // Lightbox for images
  const images = document.querySelectorAll(".image-container img, .inspiration-gallery img, .support-image img");
  if (images.length > 0) {
    console.log(` Lightbox enabled for ${images.length} images`);
    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    document.body.appendChild(lightbox);

    images.forEach(img => {
      img.addEventListener("click", () => {
        lightbox.innerHTML = "";
        const clone = document.createElement("img");
        clone.src = img.src;
        lightbox.appendChild(clone);
        lightbox.style.display = "flex";
        console.log(` Lightbox opened for: ${img.alt || img.src}`);
      });
    });

    lightbox.addEventListener("click", () => {
      lightbox.style.display = "none";
      console.log("Lightbox closed");
    });
  }

  // Scroll reveal effect
  const revealElements = document.querySelectorAll(".reveal");
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight - 50) {
        if (!el.classList.contains("active")) {
          el.classList.add("active");
          console.log(` Revealed: ${el.tagName}.${el.className}`);
        }
      }
    });
  };
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  /* =========================
     ABOUT US FEATURES
  ========================== */

  // Team member hover highlight
  const teamMembers = document.querySelectorAll(".team-member");
  if (teamMembers.length > 0) {
    console.log(`Team member hover effect active for ${teamMembers.length} members`);
    teamMembers.forEach(member => {
      member.addEventListener("mouseenter", () => {
        member.classList.add("highlight");
        console.log(`Highlighted: ${member.querySelector("h3")?.innerText || "Team Member"}`);
      });
      member.addEventListener("mouseleave", () => {
        member.classList.remove("highlight");
        console.log(` Unhighlighted: ${member.querySelector("h3")?.innerText || "Team Member"}`);
      });
    });
  }

  /* =========================
   MENU PAGE FEATURES
========================== */

// Load cart from localStorage if it exists
let cart = JSON.parse(localStorage.getItem("cart")) || [];
console.log(`🛒 Cart loaded with ${cart.length} items`);

// Attach event listeners to all menu forms
document.querySelectorAll(".menu-item form").forEach(form => {
  form.addEventListener("submit", e => {
    e.preventDefault();


const menuSearchForm = document.getElementById("menuSearchForm");
const searchInput = document.getElementById("searchInput");
const menuItems = document.querySelectorAll(".menu-item");

function filterMenu(e) {
  if (e) e.preventDefault(); // prevent form reload
  const query = searchInput.value.toLowerCase();
  menuItems.forEach(item => {
    const text = item.innerText.toLowerCase();
    item.style.display = text.includes(query) ? "block" : "none";
  });
}

if (menuSearchForm && searchInput) {
  menuSearchForm.addEventListener("submit", filterMenu);
}


    const itemName = form.querySelector("p").innerText;
    const selects = form.querySelectorAll("select"); // grab ALL selects in the form
    let quantity = 0;

    // Find the quantity select (last one usually)
    selects.forEach(sel => {
      if (sel.id.toLowerCase().includes("qty")) {
        quantity = parseInt(sel.value, 10);
      }
    });

    if (!quantity) {
      console.warn(`⚠️ No quantity selected for ${itemName}`);
      alert("Please select a quantity.");
      return;
    }

    // Extract price from text
    const priceMatch = itemName.match(/R(\d+)/);
    const price = priceMatch ? parseInt(priceMatch[1], 10) : 0;

    const cartItem = {
      name: itemName,
      quantity,
      price,
      total: price * quantity
    };

    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));

    console.log(`✅ Added to cart: ${quantity} × ${itemName} @ R${price} each (Total: R${cartItem.total})`);
    console.log("📦 Current cart:", cart);

    alert(`${quantity} × ${itemName} added to cart!`);

    // 🔑 Reset ALL selects in the form back to placeholder
    selects.forEach(sel => {
      sel.value = "";
    });
  });
});

// =========================
// CUSTOM ORDER PAGE FEATURES
// =========================

const customForm = document.getElementById("customForm");
if (customForm) {
  customForm.addEventListener("submit", e => {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(customForm);
    const orderDetails = Object.fromEntries(formData.entries());

    // Build a cart item
    const cartItem = {
      name: `Custom Cake - ${orderDetails["cake-type"]}`,
      flavor: orderDetails.flavor,
      filling: orderDetails.filling,
      size: orderDetails.size,
      message: orderDetails.message || "",
      price: 200, // base price
      quantity: 1,
      total: 200
    };

    // Load existing cart or create new
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(cartItem);

    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    console.log(" Custom order added to cart:", cartItem);
    console.log(" Current cart:", cart);

    alert("Your custom cake has been added to the cart!");

    // Reset form
    customForm.reset();
  });
}

// =========================
// ORDER ONLINE PAGE FEATURES
// =========================

const cartTableBody = document.querySelector("#cartTable tbody");
const orderForm = document.getElementById("orderForm");
const paymentSelect = document.getElementById("payment");
const bankingDetails = document.querySelector(".banking-details");

if (cartTableBody) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const renderCart = () => {
    cartTableBody.innerHTML = "";
    let grandTotal = 0;

    if (cart.length === 0) {
      cartTableBody.innerHTML = `<tr><td colspan="5">Your cart is empty.</td></tr>`;
      return;
    }

    cart.forEach((item, index) => {
      const row = document.createElement("tr");

      let details = item.flavor || "";
      if (item.filling) details += ` / ${item.filling}`;
      if (item.size) details += ` / ${item.size}`;
      if (item.message) details += ` / Note: ${item.message}`;

      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${details || "-"}</td>
        <td>R${item.total}</td>
        <td><button class="remove-btn" data-index="${index}">Remove</button></td>
      `;

      cartTableBody.appendChild(row);
      grandTotal += item.total;
    });

    // Grand total row
    const totalRow = document.createElement("tr");
    totalRow.classList.add("total-row");
    totalRow.innerHTML = `
      <td colspan="3" style="text-align:right; font-weight:bold;">Grand Total:</td>
      <td colspan="2" style="font-weight:bold;">R${grandTotal}</td>
    `;
    cartTableBody.appendChild(totalRow);

    // Remove buttons
    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const idx = e.target.getAttribute("data-index");
        cart.splice(idx, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });
  };

  renderCart();
}

// Handle order form submission
if (orderForm) {
  orderForm.addEventListener("submit", e => {
    e.preventDefault();

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items before placing an order.");
      return;
    }

    const formData = new FormData(orderForm);
    const orderDetails = Object.fromEntries(formData.entries());

    console.log("📦 Order placed:", orderDetails);
    console.log("🛒 Cart contents:", cart);

    alert("✅ Thank you! Your order has been placed successfully.");

    // Clear cart and form
    localStorage.removeItem("cart");
    orderForm.reset();
    cartTableBody.innerHTML = `<tr><td colspan="5">Your cart is empty.</td></tr>`;
    bankingDetails.style.display = "none";
  });
}

const reviewForm = document.getElementById("reviewForm");
const reviewsSection = document.getElementById("reviews-section");

// Load saved reviews from localStorage
let savedReviews = JSON.parse(localStorage.getItem("reviews")) || [];

// Render only the saved (user-submitted) reviews, appended after your hardcoded ones
function renderSavedReviews() {
  savedReviews.forEach(r => {
    const reviewDiv = document.createElement("div");
    reviewDiv.classList.add("review");
    reviewDiv.innerHTML = `
      <blockquote>"${r.text}"</blockquote>
      <footer>– ${r.name} ${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</footer>
    `;
    reviewsSection.appendChild(reviewDiv);
  });
}

// Initial render of saved reviews
renderSavedReviews();

// Handle new review submission
if (reviewForm) {
  reviewForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("reviewerName").value.trim();
    const text = document.getElementById("reviewText").value.trim();
    const stars = parseInt(document.getElementById("starRating").value);

    if (name && text && stars) {
      const newReview = { name, text, stars };
      savedReviews.push(newReview);

      // Save to localStorage
      localStorage.setItem("reviews", JSON.stringify(savedReviews));

      // Append the new review (don’t clear anything)
      const reviewDiv = document.createElement("div");
      reviewDiv.classList.add("review");
      reviewDiv.innerHTML = `
        <blockquote>"${text}"</blockquote>
        <footer>– ${name} ${"★".repeat(stars)}${"☆".repeat(5 - stars)}</footer>
      `;
      reviewsSection.appendChild(reviewDiv);

      reviewForm.reset();
      alert("✅ Thank you for your review!");
    }
  });
}


const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    alert("✅ Thank you for reaching out! We'll get back to you soon.");
    contactForm.reset();
  });
}

//alert message for when the user submits their enquiry
const enquiryForm = document.getElementById("enquiryForm");

if (enquiryForm) {
  enquiryForm.addEventListener("submit", e => {
    e.preventDefault();
    alert("✅ Thank you for your enquiry! We'll get back to you soon.");
    enquiryForm.reset();
  });
}




});
