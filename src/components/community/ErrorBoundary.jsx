import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default class CommunityErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Community Feed Error Caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          textAlign: "center",
          fontFamily: "'Outfit', 'Inter', sans-serif"
        }}>
          <div style={{
            background: "#fee2e2",
            color: "#b91c1c",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px"
          }}>
            <AlertCircle size={28} />
          </div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#1f2937", marginBottom: "8px" }}>
            Oops! Couldn't load moments right now.
          </h2>
          <p style={{ color: "#6b7280", maxWidth: "420px", marginBottom: "20px", fontSize: "0.92rem" }}>
            We encountered a temporary display issue. Click below to refresh the Petzy feed.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#1d4633",
              color: "#ffffff",
              border: "none",
              padding: "10px 22px",
              borderRadius: "9999px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            <RotateCcw size={16} /> Refresh Feed
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
