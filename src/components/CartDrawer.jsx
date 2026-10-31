import { useState } from "react";
import { Link } from "react-router-dom";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalCartCount,
    cartSubtotal
  } = useCart();

  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      setOrderPlaced(false);
      setIsCartOpen(false);
    }, 2800);
  };

  return (
    <>
      <div
        className={`cart-drawer-backdrop ${isCartOpen ? "open" : ""}`}
        onClick={() => setIsCartOpen(false)}
      />

      <aside className={`cart-drawer ${isCartOpen ? "open" : ""}`}>
        <div className="cart-drawer-header">
          <h3>
            <ShoppingBag size={20} />
            Your Pet Cart ({totalCartCount})
          </h3>
          <button
            className="modal-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {orderPlaced ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" }}>
            <CheckCircle2 size={54} color="#16a34a" style={{ marginBottom: "1rem" }} />
            <h3 style={{ color: "#1d4633", marginBottom: "0.5rem" }}>Order Confirmed!</h3>
            <p style={{ color: "#4b5563", fontSize: "0.95rem" }}>
              Thank you for caring for your pets! Your order is being packed and dispatched.
            </p>
          </div>
        ) : cartItems.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center", color: "#6b7280" }}>
            <ShoppingBag size={48} style={{ opacity: 0.35, marginBottom: "1rem" }} />
            <h4>Your cart is empty</h4>
            <p style={{ fontSize: "0.9rem", marginTop: "0.4rem", marginBottom: "1.5rem" }}>
              Explore our wholesome pet foods, durable toys, and cozy beds!
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="shop-add-cart-btn"
            >
              Browse Shop
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-scroll">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-drawer-item">
                  <div className="cart-item-thumbnail">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <div className="cart-item-info">
                    <h5 className="cart-item-title">{item.name}</h5>
                    <span className="cart-item-price">{item.price}</span>
                    <div className="cart-item-qty-row">
                      <div className="qty-stepper">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    className="cart-remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-drawer-footer">
              <div className="cart-summary-line">
                <span>Subtotal</span>
                <span>LKR {cartSubtotal.toLocaleString()}.00</span>
              </div>
              <div className="cart-summary-line">
                <span>Islandwide Delivery</span>
                <span>{cartSubtotal >= 5000 ? "FREE" : "LKR 350.00"}</span>
              </div>
              <div className="cart-summary-line total">
                <span>Total</span>
                <span>
                  LKR {(cartSubtotal + (cartSubtotal >= 5000 || cartSubtotal === 0 ? 0 : 350)).toLocaleString()}.00
                </span>
              </div>

              <button
                className="checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", color: "#6b7280", fontSize: "0.8rem", marginTop: "0.8rem" }}>
                <ShieldCheck size={14} color="#16a34a" /> 100% Safe & Secure Checkout
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
