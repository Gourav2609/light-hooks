import React from "react";
import { useLocalStorage } from "../src/index";

// Example 1: Basic usage with primitive values
export const BasicLocalStorageExample: React.FC = () => {
  const { value: count, setValue: setCount, removeValue } = useLocalStorage("count", 0);

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>🔢 Basic LocalStorage (Primitive Values)</h3>
      <p>Current count: <strong>{count}</strong></p>
      <button 
        onClick={() => setCount(prev => prev + 1)}
        style={{ margin: "5px", padding: "8px 16px" }}
      >
        Increment
      </button>
      <button 
        onClick={() => setCount(prev => prev - 1)}
        style={{ margin: "5px", padding: "8px 16px" }}
      >
        Decrement
      </button>
      <button 
        onClick={() => setCount(0)}
        style={{ margin: "5px", padding: "8px 16px" }}
      >
        Reset
      </button>
      <button 
        onClick={removeValue}
        style={{ margin: "5px", padding: "8px 16px", backgroundColor: "#ff6b6b", color: "white" }}
      >
        Remove from Storage
      </button>
      <p style={{ fontSize: "12px", color: "#666" }}>
        Refresh the page to see persistence! The count value will remain.
      </p>
    </div>
  );
};

// Example 2: Object storage with user preferences
export const UserPreferencesExample: React.FC = () => {
  const { value: preferences, setValue: setPreferences, removeValue } = useLocalStorage(
    "userPreferences",
    {
      theme: "light" as "light" | "dark",
      fontSize: 16,
      notifications: true,
      language: "en",
    }
  );

  const updateTheme = (theme: "light" | "dark") => {
    setPreferences(prev => ({ ...prev, theme }));
  };

  const updateFontSize = (fontSize: number) => {
    setPreferences(prev => ({ ...prev, fontSize }));
  };

  const toggleNotifications = () => {
    setPreferences(prev => ({ ...prev, notifications: !prev.notifications }));
  };

  return (
    <div 
      style={{ 
        padding: "20px", 
        border: "1px solid #ccc", 
        margin: "10px",
        backgroundColor: preferences.theme === "dark" ? "#333" : "#fff",
        color: preferences.theme === "dark" ? "#fff" : "#000",
        fontSize: `${preferences.fontSize}px`
      }}
    >
      <h3>⚙️ User Preferences (Object Storage)</h3>
      
      <div style={{ marginBottom: "15px" }}>
        <label>Theme: </label>
        <button
          onClick={() => updateTheme("light")}
          style={{
            margin: "5px",
            padding: "5px 10px",
            backgroundColor: preferences.theme === "light" ? "#007bff" : "#ccc",
            color: preferences.theme === "light" ? "white" : "black"
          }}
        >
          Light
        </button>
        <button
          onClick={() => updateTheme("dark")}
          style={{
            margin: "5px",
            padding: "5px 10px",
            backgroundColor: preferences.theme === "dark" ? "#007bff" : "#ccc",
            color: preferences.theme === "dark" ? "white" : "black"
          }}
        >
          Dark
        </button>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Font Size: </label>
        <input
          type="range"
          min="12"
          max="24"
          value={preferences.fontSize}
          onChange={(e) => updateFontSize(Number(e.target.value))}
          style={{ margin: "0 10px" }}
        />
        <span>{preferences.fontSize}px</span>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>
          <input
            type="checkbox"
            checked={preferences.notifications}
            onChange={toggleNotifications}
            style={{ margin: "0 5px" }}
          />
          Enable Notifications
        </label>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <strong>Current Settings:</strong>
        <pre style={{ backgroundColor: "#f5f5f5", padding: "10px", margin: "5px 0", color: "#000" }}>
          {JSON.stringify(preferences, null, 2)}
        </pre>
      </div>

      <button
        onClick={removeValue}
        style={{
          padding: "8px 16px",
          backgroundColor: "#ff6b6b",
          color: "white",
          border: "none",
          borderRadius: "4px"
        }}
      >
        Reset to Defaults
      </button>
    </div>
  );
};

// Example 3: Shopping cart with custom serializer
export const ShoppingCartExample: React.FC = () => {
  interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }

  const { value: cart, setValue: setCart, removeValue, clear } = useLocalStorage<CartItem[]>(
    "shoppingCart",
    [],
    {
      // Custom serializer with date handling
      serializer: {
        stringify: (value) => JSON.stringify(value, null, 2),
        parse: (value) => JSON.parse(value),
      }
    }
  );

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setCart(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setCart(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const sampleProducts = [
    { id: 1, name: "JavaScript Book", price: 29.99 },
    { id: 2, name: "React Hooks Guide", price: 19.99 },
    { id: 3, name: "TypeScript Manual", price: 34.99 },
  ];

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>🛒 Shopping Cart (Array Storage)</h3>
      
      <div style={{ marginBottom: "20px" }}>
        <h4>Products:</h4>
        {sampleProducts.map(product => (
          <div key={product.id} style={{ margin: "5px 0", padding: "5px", backgroundColor: "#f9f9f9" }}>
            <span>{product.name} - ${product.price}</span>
            <button
              onClick={() => addItem(product)}
              style={{ margin: "0 10px", padding: "4px 8px", backgroundColor: "#28a745", color: "white" }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4>Cart ({cart.length} items):</h4>
        {cart.length === 0 ? (
          <p style={{ color: "#666" }}>Your cart is empty</p>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.id} style={{ margin: "10px 0", padding: "10px", backgroundColor: "#e9ecef" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span><strong>{item.name}</strong> - ${item.price} each</span>
                  <div>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{ margin: "0 5px", padding: "2px 6px" }}
                    >
                      -
                    </button>
                    <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ margin: "0 5px", padding: "2px 6px" }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{ margin: "0 10px", padding: "4px 8px", backgroundColor: "#dc3545", color: "white" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div style={{ marginTop: "5px", fontSize: "14px", color: "#666" }}>
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
            <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#d4edda", fontWeight: "bold" }}>
              Total: ${totalPrice.toFixed(2)}
            </div>
          </>
        )}
      </div>

      <div>
        <button
          onClick={removeValue}
          style={{ margin: "5px", padding: "8px 16px", backgroundColor: "#ffc107", color: "black" }}
        >
          Clear Cart
        </button>
        <button
          onClick={clear}
          style={{ margin: "5px", padding: "8px 16px", backgroundColor: "#ff6b6b", color: "white" }}
        >
          Clear All Storage
        </button>
      </div>

      <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
        Open multiple tabs to see cart sync across tabs!
      </p>
    </div>
  );
};

// Example 4: Form data persistence
export const FormPersistenceExample: React.FC = () => {
  interface FormData {
    name: string;
    email: string;
    message: string;
    subscribe: boolean;
  }

  const { value: formData, setValue: setFormData, removeValue } = useLocalStorage<FormData>(
    "contactForm",
    {
      name: "",
      email: "",
      message: "",
      subscribe: false,
    },
    { syncAcrossTabs: false } // Disable tab sync for forms
  );

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Form submitted!\n${JSON.stringify(formData, null, 2)}`);
    // After successful submission, clear the form
    removeValue();
  };

  const isFormValid = formData.name.trim() && formData.email.trim() && formData.message.trim();

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>📝 Form Persistence (No Tab Sync)</h3>
      <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
        Your form data is automatically saved as you type. Try refreshing the page!
      </p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
            placeholder="Enter your name"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
            placeholder="Enter your email"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Message:</label>
          <textarea
            value={formData.message}
            onChange={(e) => updateField("message", e.target.value)}
            style={{ 
              width: "100%", 
              padding: "8px", 
              border: "1px solid #ddd", 
              borderRadius: "4px",
              minHeight: "80px",
              resize: "vertical"
            }}
            placeholder="Enter your message"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={formData.subscribe}
              onChange={(e) => updateField("subscribe", e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            Subscribe to newsletter
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={!isFormValid}
            style={{
              padding: "10px 20px",
              backgroundColor: isFormValid ? "#28a745" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isFormValid ? "pointer" : "not-allowed",
              margin: "5px"
            }}
          >
            Submit Form
          </button>
          <button
            type="button"
            onClick={removeValue}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              margin: "5px"
            }}
          >
            Clear Form
          </button>
        </div>
      </form>

      <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
        <strong>Current Form Data:</strong>
        <pre style={{ fontSize: "12px", marginTop: "5px" }}>
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// Example 5: Settings with custom validation
export const SettingsWithValidationExample: React.FC = () => {
  interface AppSettings {
    maxRetries: number;
    timeout: number;
    autoSave: boolean;
    apiEndpoint: string;
  }

  const validateSettings = (settings: AppSettings): AppSettings => {
    return {
      maxRetries: Math.max(1, Math.min(10, settings.maxRetries)),
      timeout: Math.max(1000, Math.min(30000, settings.timeout)),
      autoSave: settings.autoSave,
      apiEndpoint: settings.apiEndpoint.trim() || "https://api.example.com",
    };
  };

  const { value: settings, setValue: setSettings, removeValue } = useLocalStorage<AppSettings>(
    "appSettings",
    {
      maxRetries: 3,
      timeout: 5000,
      autoSave: true,
      apiEndpoint: "https://api.example.com",
    }
  );

  const updateSetting = (key: keyof AppSettings, value: any) => {
    setSettings(prev => validateSettings({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    removeValue();
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>⚙️ App Settings with Validation</h3>
      <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
        Settings are automatically validated and constrained to valid ranges.
      </p>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Max Retries (1-10):
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={settings.maxRetries}
          onChange={(e) => updateSetting("maxRetries", parseInt(e.target.value) || 1)}
          style={{ padding: "8px", border: "1px solid #ddd", borderRadius: "4px", width: "100px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Timeout (1000-30000ms):
        </label>
        <input
          type="number"
          min="1000"
          max="30000"
          step="1000"
          value={settings.timeout}
          onChange={(e) => updateSetting("timeout", parseInt(e.target.value) || 5000)}
          style={{ padding: "8px", border: "1px solid #ddd", borderRadius: "4px", width: "150px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={settings.autoSave}
            onChange={(e) => updateSetting("autoSave", e.target.checked)}
            style={{ marginRight: "8px" }}
          />
          Enable Auto-save
        </label>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          API Endpoint:
        </label>
        <input
          type="url"
          value={settings.apiEndpoint}
          onChange={(e) => updateSetting("apiEndpoint", e.target.value)}
          style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
          placeholder="https://api.example.com"
        />
      </div>

      <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#e9ecef", borderRadius: "4px" }}>
        <strong>Current Settings:</strong>
        <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
          <li>Max Retries: {settings.maxRetries}</li>
          <li>Timeout: {settings.timeout}ms</li>
          <li>Auto-save: {settings.autoSave ? "Enabled" : "Disabled"}</li>
          <li>API Endpoint: {settings.apiEndpoint}</li>
        </ul>
      </div>

      <button
        onClick={resetToDefaults}
        style={{
          padding: "8px 16px",
          backgroundColor: "#17a2b8",
          color: "white",
          border: "none",
          borderRadius: "4px"
        }}
      >
        Reset to Defaults
      </button>
    </div>
  );
};
