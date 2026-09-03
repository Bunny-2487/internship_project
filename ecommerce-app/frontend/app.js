// app.js
// Basic React app (using CDN, no build tools) - learning project
// pages handled manually with a "page" state instead of react-router (haven't learned that yet)

const { useState, useEffect } = React;

const API_URL = "http://localhost:5000/api"; // change this if backend runs elsewhere

// ---------------- NAVBAR ----------------
function Navbar({ page, setPage, user, logout, cartCount }) {
  return (
    <div className="navbar">
      <h1 onClick={() => setPage("home")}>MyShop 🛒</h1>
      <div className="nav-links">
        <span onClick={() => setPage("home")}>Home</span>
        <span onClick={() => setPage("cart")}>
          Cart <span className="cart-count">{cartCount}</span>
        </span>
        {user && <span onClick={() => setPage("orders")}>My Orders</span>}
        {user ? (
          <>
            <span>Hi, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>Login</button>
        )}
      </div>
    </div>
  );
}

// ---------------- PRODUCT LIST (HOME PAGE) ----------------
function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch products from backend when page loads
  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: 30 }}>Loading products...</p>;

  return (
    <div className="container">
      <h2>All Products</h2>
      <div className="product-grid">
        {products.map((p) => (
          <div className="product-card" key={p._id}>
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <div className="price">₹{p.price}</div>
            <button className="add-btn" onClick={() => addToCart(p)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- LOGIN PAGE ----------------
function Login({ setPage, loginUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      loginUser(data.user, data.token);
      setPage("home");
    } catch (err) {
      setError("Something went wrong, try again");
    }
  }

  return (
    <div className="form-box">
      <h2>Login</h2>
      {error && <div className="message error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{" "}
        <a onClick={() => setPage("register")}>Register here</a>
      </p>
    </div>
  );
}

// ---------------- REGISTER PAGE ----------------
function Register({ setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      setSuccess("Account created! You can login now.");
      setTimeout(() => setPage("login"), 1500);
    } catch (err) {
      setError("Something went wrong, try again");
    }
  }

  return (
    <div className="form-box">
      <h2>Register</h2>
      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a onClick={() => setPage("login")}>Login here</a>
      </p>
    </div>
  );
}

// ---------------- CART PAGE ----------------
function Cart({ cart, updateQty, removeFromCart, user, setPage, clearCart, token }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const [msg, setMsg] = useState("");

  async function handleCheckout() {
    if (!user) {
      setPage("login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map((c) => ({
            productId: c._id,
            name: c.name,
            price: c.price,
            quantity: c.qty,
          })),
          totalAmount: total,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsg(data.message || "Checkout failed");
        return;
      }

      setMsg("Order placed successfully!");
      clearCart();
      setTimeout(() => setPage("orders"), 1200);
    } catch (err) {
      setMsg("Something went wrong placing order");
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container">
        <h2>My Cart</h2>
        <p className="empty-text">Your cart is empty. Go add some products!</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>My Cart</h2>
      {msg && <div className="message success">{msg}</div>}
      {cart.map((item) => (
        <div className="cart-item" key={item._id}>
          <div className="cart-item-info">
            <img src={item.image} alt={item.name} />
            <div>
              <strong>{item.name}</strong>
              <p>₹{item.price} x {item.qty}</p>
            </div>
          </div>
          <div className="qty-controls">
            <button onClick={() => updateQty(item._id, -1)}>-</button>
            {item.qty}
            <button onClick={() => updateQty(item._id, 1)}>+</button>
            <button onClick={() => removeFromCart(item._id)}>Remove</button>
          </div>
        </div>
      ))}
      <div className="cart-total">Total: ₹{total}</div>
      <button className="checkout-btn" onClick={handleCheckout}>
        {user ? "Checkout" : "Login to Checkout"}
      </button>
    </div>
  );
}

// ---------------- MY ORDERS PAGE ----------------
function Orders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/orders/myorders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: 30 }}>Loading orders...</p>;

  if (orders.length === 0) {
    return (
      <div className="container">
        <h2>My Orders</h2>
        <p className="empty-text">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Items:</strong> {order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

// ---------------- MAIN APP ----------------
function App() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // check if user was already logged in (saved in localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  function loginUser(userData, tokenData) {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setPage("home");
  }

  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function updateQty(id, change) {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, qty: item.qty + change } : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((item) => item._id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div>
      <Navbar page={page} setPage={setPage} user={user} logout={logout} cartCount={cartCount} />

      {page === "home" && <Home addToCart={addToCart} />}
      {page === "login" && <Login setPage={setPage} loginUser={loginUser} />}
      {page === "register" && <Register setPage={setPage} />}
      {page === "cart" && (
        <Cart
          cart={cart}
          updateQty={updateQty}
          removeFromCart={removeFromCart}
          user={user}
          token={token}
          setPage={setPage}
          clearCart={clearCart}
        />
      )}
      {page === "orders" && <Orders token={token} />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
